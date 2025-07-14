// app/profile/my-posts.jsx
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// We can reuse the community styles here
import { communityStyles } from '../../assets/styles/community.styles';
import { COLORS } from '../../constants/colors';
import { dummyPosts } from '../../constants/dummyData';

// Reusing the PostCard component. Ideally, this would be a shared component.
const PostCard = ({ post }) => {
  const router = useRouter();
  const handlePress = () => router.push(`/community/${post.id}`);
  return (
    <TouchableOpacity onPress={handlePress} style={communityStyles.card} activeOpacity={0.8}>
      <View style={communityStyles.cardHeader}><Image source={{ uri: post.author.avatar }} style={communityStyles.avatar} /><View style={communityStyles.authorInfo}><Text style={communityStyles.authorName}>{post.author.name}</Text><Text style={communityStyles.timestamp}>{post.timestamp}</Text></View></View>
      <View style={communityStyles.cardContent}><Text style={communityStyles.contentText}>{post.content}</Text>{post.image && (<Image source={{ uri: post.image }} style={communityStyles.cardImage} resizeMode="cover" />)}</View>
      <View style={communityStyles.cardFooter}><TouchableOpacity style={communityStyles.actionButton}><Ionicons name="heart-outline" size={22} color={COLORS.textLight} /><Text style={communityStyles.actionText}>{post.likes} Likes</Text></TouchableOpacity><TouchableOpacity style={communityStyles.actionButton}><Ionicons name="chatbubble-outline" size={22} color={COLORS.textLight} /><Text style={communityStyles.actionText}>{post.commentsCount} Comments</Text></TouchableOpacity></View>
    </TouchableOpacity>
  );
};

const MyPostsPage = () => {
  const { user } = useAuth();
  // Filter posts where authorId matches the logged-in user's ID
  const myPosts = dummyPosts.filter(p => p.authorId === 'user_123'); // In a real app: p.authorId === user.id

  return (
    <SafeAreaView style={communityStyles.container}>
      <Stack.Screen options={{ title: 'My Posts', headerBackTitle: 'Profile' }} />
      {myPosts.length > 0 ? (
        <FlatList
          data={myPosts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
        />
      ) : (
        <View style={communityStyles.emptyStateContainer}>
          <Ionicons name="document-text-outline" size={64} color={COLORS.textLight} />
          <Text style={communityStyles.emptyStateText}>You haven't posted anything yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyPostsPage;