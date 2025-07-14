// app/(tabs)/profile.jsx

import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { profileStyles as styles } from '../../assets/styles/profile.styles';
import { COLORS } from '../../constants/colors';
import { dummyPosts } from '../../constants/dummyData';

const ProfilePage = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For loading state during save/upload

  const myPostCount = dummyPosts.filter(p => p.authorId === 'user_123').length;

  // Enter editing mode
  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setIsEditing(true);
  };

  // Cancel editing mode
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Function to save profile changes
  const onSaveUser = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "First name and last name cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      // This is the correct way, which will now work after changing the dashboard settings.
      await user?.update({
        first_name: firstName,
        last_name: lastName,
      });
      setIsEditing(false);
      Alert.alert("Success", "Your profile has been updated.");
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image picking and updating profile picture
  const onSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8
    });

    if (!result.canceled) {
      setIsLoading(true);
      try {
        await user?.setProfileImage({ file: result.assets[0].uri });
      } catch (err) {
        console.error("Image upload failed:", err);
        Alert.alert("Error", "Failed to update profile image.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && ( // Show a loading overlay
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10}}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onSelectImage} disabled={isEditing}>
                <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            </TouchableOpacity>
            {isEditing ? (
                <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                    <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={[styles.name, {borderBottomWidth: 1, borderColor: COLORS.border}]}/>
                    <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={[styles.name, {borderBottomWidth: 1, borderColor: COLORS.border}]}/>
                </View>
            ) : (
                <Text style={styles.name}>{user?.fullName}</Text>
            )}
            <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        <View style={styles.statsContainer}>
            {/* ... stats items ... */}
        </View>

        <View style={styles.actionSection}>
          {isEditing ? (
            <>
              <TouchableOpacity style={[styles.actionItem, {backgroundColor: COLORS.primary}]} onPress={onSaveUser}>
                <Ionicons name="save-outline" size={22} color={COLORS.white} />
                <Text style={[styles.actionText, {color: COLORS.white}]}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionItem, {backgroundColor: COLORS.card}]} onPress={handleCancel}>
                <Ionicons name="close-circle-outline" size={22} color={COLORS.textLight} />
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.actionItem} onPress={handleEdit}>
              <Ionicons name="create-outline" size={22} color={COLORS.text} />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/profile/my-posts')}>
            <Ionicons name="document-text-outline" size={22} color={COLORS.text} />
            <Text style={styles.actionText}>My Posts</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E63946" />
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;