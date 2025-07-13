// app/community/create.jsx

import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
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

  const handlePost = () => {
    if (content.trim().length === 0) {
      Alert.alert('Empty Post', 'Please write something before posting.');
      return;
    }
    console.log('Posting content:', content);
    // In a real app, you would call an API here.
    // After successful post, navigate back.
    router.back();
  };

  const handleImagePicker = () => {
      // We will implement this in the next step
      Alert.alert('Feature Coming Soon', 'The ability to add images will be available shortly!');
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Create Post',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
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
        {/* Who is posting */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
        </View>

        {/* Text Input for content */}
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          placeholderTextColor={COLORS.textLight}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus // Automatically focus the input field
        />

        {/* Action buttons at the bottom */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleImagePicker}>
            <Ionicons name="image-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          {/* Add other buttons here if needed, e.g., location, tag user */}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreatePostPage;