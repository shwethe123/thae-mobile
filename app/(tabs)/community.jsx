import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { communityStyles as styles } from '../../assets/styles/community.styles';
import { COLORS } from '../../constants/colors';
import { dummyPosts } from '../../constants/dummyData';

// This enables LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// PostCard component
const PostCard = ({ post }) => {
  const router = useRouter();
  const handlePress = () => router.push(`/community/${post.id}`);
  return (
    <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}><Image source={{ uri: post.author.avatar }} style={styles.avatar} /><View style={styles.authorInfo}><Text style={styles.authorName}>{post.author.name}</Text><Text style={styles.timestamp}>{post.timestamp}</Text></View></View>
      <View style={styles.cardContent}><Text style={styles.contentText}>{post.content}</Text>{post.image && (<Image source={{ uri: post.image }} style={styles.cardImage} resizeMode="cover" />)}</View>
      <View style={styles.cardFooter}><TouchableOpacity style={styles.actionButton}><Ionicons name="heart-outline" size={22} color={COLORS.textLight} /><Text style={styles.actionText}>{post.likes} Likes</Text></TouchableOpacity><TouchableOpacity style={styles.actionButton}><Ionicons name="chatbubble-outline" size={22} color={COLORS.textLight} /><Text style={styles.actionText}>{post.commentsCount} Comments</Text></TouchableOpacity></View>
    </TouchableOpacity>
  );
};

// Main CommunityPage component
const CommunityPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(dummyPosts);

  const fetchPosts = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const shuffled = [...dummyPosts].sort(() => 0.5 - Math.random());
            resolve(shuffled);
        }, 1000);
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newPosts = await fetchPosts();
    setPosts(newPosts);
    setRefreshing(false);
  }, []);

  const filteredPosts = useMemo(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (!searchQuery) return posts;
    return posts.filter(post =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, posts]);

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
      <TextInput style={styles.searchInput} placeholder="Search posts or authors..." value={searchQuery} onChangeText={setSearchQuery} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
        ListEmptyComponent={() => (<View style={styles.emptyStateContainer}><Ionicons name="search" size={64} color={COLORS.textLight} /><Text style={styles.emptyStateText}>No posts found for "{searchQuery}"</Text></View>)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      />
      
      <TouchableOpacity style={styles.fab} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/community/create')}} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CommunityPage;