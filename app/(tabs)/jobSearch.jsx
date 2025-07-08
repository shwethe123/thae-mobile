import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MapView, { Marker } from 'react-native-maps';

// --- Configuration ---
const API_BASE_URL = 'http://192.168.16.32:5000'; // Your API Server IP

// --- Theme Colors ---
const COLORS = {
  primary: '#1976D2',
  secondary: '#FFC107',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

// --- Reusable Components ---
const PostCard = ({ item, type, onpress }) => {
    // Handle image URL from backend. If it's a relative path, prepend the base URL.
    const imageUrl = item.image && item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`;

    return (
        <TouchableOpacity onPress={onpress}>
          <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              {type === 'employer' ? (
                <>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.jobTitle}</Text>
                  <Text style={styles.cardSubtitle}>{item.companyName}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.fullName}</Text>
                  <Text style={styles.cardSubtitle}>{item.skill}</Text>
                </>
              )}
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={16} color={COLORS.textSecondary} />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} style={{alignSelf:"center"}} />
          </Animatable.View>
        </TouchableOpacity>
    )
};

const JobSearchScreen = () => {
  const [activeTab, setActiveTab] = useState('employer');
  const [viewMode, setViewMode] = useState('list');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const type = activeTab === 'employer' ? 'employer' : 'seeker';
      const response = await fetch(`${API_BASE_URL}/api/job-posts?type=${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from server.');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, [fetchPosts]);

  const handleCreatePost = () => {
    if (activeTab === 'employer') {
      router.push('/create-job-post');
    } else {
      router.push('/create-seeker-profile');
    }
  };

  const renderContent = () => {
    if (loading && !refreshing) {
        return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }
    
    if (posts.length === 0) {
        return <Text style={styles.emptyText}>No posts found. Create one!</Text>;
    }

    if (viewMode === 'map') {
      return (
        <MapView
          style={styles.map}
          initialRegion={{ latitude: 19.8661, longitude: 96.0891, latitudeDelta: 8, longitudeDelta: 8 }}
        >
          {posts.map(item => (
            item.coordinates && (
              <Marker
                key={item._id}
                coordinate={{ latitude: item.coordinates.lat, longitude: item.coordinates.lng }}
                title={activeTab === 'employer' ? item.jobTitle : item.fullName}
                description={activeTab === 'employer' ? item.companyName : item.skill}
                onPress={() => router.push(`/job-details/${item._id}?type=${activeTab}`)}
              />
            )
          ))}
        </MapView>
      );
    }

    return (
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard item={item} type={activeTab} onpress={() => router.push(`/job-details/${item._id}?type=${activeTab}`)} />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header, Search, Tabs are the same */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Hub</Text>
        <TouchableOpacity><Ionicons name="notifications-outline" size={26} color={COLORS.text} /></TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          placeholder={activeTab === 'employer' ? "Search for jobs (e.g., 'Developer')" : "Search for talent (e.g., 'Plumber')"}
          style={styles.searchInput}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'employer' && styles.activeTab]}
          onPress={() => setActiveTab('employer')}
        >
          <MaterialIcons name="business-center" size={20} color={activeTab === 'employer' ? COLORS.white : COLORS.primary} />
          <Text style={[styles.tabText, activeTab === 'employer' && styles.activeTabText]}>Find a Job</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'seeker' && styles.activeTab]}
          onPress={() => setActiveTab('seeker')}
        >
          <MaterialIcons name="person-search" size={20} color={activeTab === 'seeker' ? COLORS.white : COLORS.primary} />
          <Text style={[styles.tabText, activeTab === 'seeker' && styles.activeTabText]}>Find Talent</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'employer' && (
        <View style={styles.viewModeContainer}>
            <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}>
                <Ionicons name="list" size={20} color={viewMode === 'list' ? COLORS.primary : COLORS.textSecondary} />
            </TouchableOpacity>
             <TouchableOpacity onPress={() => setViewMode('map')} style={[styles.viewModeButton, viewMode === 'map' && styles.activeViewMode]}>
                <Ionicons name="map" size={20} color={viewMode === 'map' ? COLORS.primary : COLORS.textSecondary} />
            </TouchableOpacity>
        </View>
      )}

      {/* Content Area */}
      {renderContent()}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default JobSearchScreen;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, paddingHorizontal: 16, borderRadius: 12, height: 50, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
  tabContainer: { flexDirection: 'row', margin: 16, backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, elevation: 2 },
  tab: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.primary, marginLeft: 8, fontWeight: '600' },
  activeTabText: { color: COLORS.white },
  viewModeContainer: { alignSelf: 'center', flexDirection: 'row', backgroundColor: COLORS.border, borderRadius: 12, marginBottom: 10 },
  viewModeButton: { padding: 10 },
  activeViewMode: { backgroundColor: COLORS.white, borderRadius: 10 },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, alignItems: 'center' },
  cardImage: { width: 60, height: 60, borderRadius: 30 },
  cardContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { marginLeft: 4, color: COLORS.textSecondary },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 } },
  map: { flex: 1 },
  errorText: { textAlign: 'center', color: 'red', marginTop: 50 },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 50 }
});