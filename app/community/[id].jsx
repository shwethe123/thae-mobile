// app/community/[id].jsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { communityStyles } from '../../assets/styles/community.styles';
import { postDetailStyles as styles } from '../../assets/styles/post-detail.styles';
import { COLORS } from '../../constants/colors';
import { dummyPosts, dummyReplies } from '../../constants/dummyData';

// Re-using the PostCard component from the community feed
// NOTE: In a real app, you might want this in a shared components folder
const PostCard = ({ post }) => (
  <View style={[communityStyles.card, { marginVertical: 0, borderRadius: 0, borderWidth: 0, borderBottomWidth: 1 }]}>
    <View style={communityStyles.cardHeader}>
      <Image source={{ uri: post.author.avatar }} style={communityStyles.avatar} />
      <View style={communityStyles.authorInfo}>
        <Text style={communityStyles.authorName}>{post.author.name}</Text>
        <Text style={communityStyles.timestamp}>{post.timestamp}</Text>
      </View>
    </View>
    <View style={communityStyles.cardContent}>
      <Text style={communityStyles.contentText}>{post.content}</Text>
      {post.image && (
        <Image source={{ uri: post.image }} style={communityStyles.cardImage} resizeMode="cover" />
      )}
    </View>
    <View style={communityStyles.cardFooter}>
       <TouchableOpacity style={communityStyles.actionButton} disabled>
          <Ionicons name="heart" size={22} color={COLORS.danger || '#E63946'} />
          <Text style={communityStyles.actionText}>{post.likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={communityStyles.actionButton} disabled>
          <Ionicons name="chatbubble" size={22} color={COLORS.primary} />
          <Text style={communityStyles.actionText}>{post.commentsCount} Comments</Text>
        </TouchableOpacity>
    </View>
  </View>
);

const ReplyCard = ({ reply }) => (
  <View style={styles.replyCard}>
    <Image source={{ uri: reply.author.avatar }} style={styles.replyAvatar} />
    <View style={styles.replyContent}>
      <View style={styles.replyHeader}>
        <Text style={styles.replyAuthor}>{reply.author.name}</Text>
        <Text style={styles.replyTimestamp}>{reply.timestamp}</Text>
      </View>
      <Text style={styles.replyText}>{reply.content}</Text>
    </View>
  </View>
);

const PostDetailPage = () => {
  const { id } = useLocalSearchParams(); // Get the post ID from the URL
  const [newReply, setNewReply] = useState('');
  
  const post = dummyPosts.find((p) => p.id === id);
  const replies = dummyReplies[id] || [];

  const handleSendReply = () => {
    if (newReply.trim().length === 0) return;
    console.log(`Sending reply for post ${id}:`, newReply);
    // In a real app, you would call an API here to save the reply.
    // Then you would update the state to show the new reply instantly.
    setNewReply('');
    Keyboard.dismiss(); // Hide the keyboard
  };

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Post not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Set the title of the screen in the header */}
      <Stack.Screen options={{ title: "Post Details", headerBackTitle: "Back" }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReplyCard reply={item} />}
          contentContainerStyle={styles.listContentContainer}
          // The main post is rendered as a header component of the list
          ListHeaderComponent={<PostCard post={post} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {/* Reply Input Box */}
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write a reply..."
            placeholderTextColor={COLORS.textLight}
            value={newReply}
            onChangeText={setNewReply}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendReply}>
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailPage;