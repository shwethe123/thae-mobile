// app/community/create.jsx

import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createPostStyles as styles } from '../../assets/styles/create-post.styles';
import { COLORS } from '../../constants/colors';

const CreatePostPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (content.trim().length === 0 && !image) {
      Alert.alert('Empty Post', 'Please write something or add an image before posting.');
      return;
    }
    console.log('Posting content:', content, 'with image:', image);
    router.back();
  };

  const handleClose = () => {
    setImage(null);
    setContent('');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Create Post',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={handleClose} style={{ marginLeft: 16 }}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handlePost} style={{ marginRight: 16 }}>
              <Text style={{ color: COLORS.primary, fontSize: 16, fontWeight: 'bold' }}>Post</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
        </View>

        <TextInput
          style={[styles.textInput, { flex: image ? 0 : 1 }]}
          placeholder="What's on your mind?"
          placeholderTextColor={COLORS.textLight}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
        />

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
              <Ionicons name="close" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flex: 1 }} />
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleImagePicker}>
            <Ionicons name="image-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreatePostPage;