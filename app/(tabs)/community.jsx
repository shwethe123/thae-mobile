// app/(tabs)/community.jsx

import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { communityStyles as styles } from '../../assets/styles/community.styles';
import { COLORS } from '../../constants/colors';
import { dummyPosts } from '../../constants/dummyData';

const PostCard = ({ post }) => {
  const router = useRouter();

  // Navigate to a detail screen when implemented
  const handlePress = () => {
    // We will implement this later
    router.push(`/community/${post.id}`);
    console.log("Navigating to post:", post.id);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.8}>
      {/* Card Header: Avatar, Name, Timestamp */}
      <View style={styles.cardHeader}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>

      {/* Card Body: Content Text and Image */}
      <View style={styles.cardContent}>
        <Text style={styles.contentText}>{post.content}</Text>
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.cardImage} resizeMode="cover" />
        )}
      </View>
      
      {/* Card Footer: Like, Comment buttons */}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color={COLORS.textLight} />
          <Text style={styles.actionText}>{post.likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={COLORS.textLight} />
          <Text style={styles.actionText}>{post.commentsCount} Comments</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const CommunityPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dummyPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/community/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CommunityPage;