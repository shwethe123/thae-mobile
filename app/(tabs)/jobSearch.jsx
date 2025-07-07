import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MapView, { Marker } from 'react-native-maps';

// --- Theme Colors (Move to a central file later) ---
const COLORS = {
  primary: '#1976D2', // A professional blue
  secondary: '#FFC107', // An accent yellow
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

// --- Dummy Data (Replace with your actual API data) ---
const employersPosts = [
  { id: 'e1', company: 'Creative Web Solutions', role: 'React Native Developer', location: 'Yangon', lat: 16.8409, lng: 96.1735, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'e2', company: 'Gusto Cafe', role: 'Barista & Waiter', location: 'Mandalay', lat: 21.9587, lng: 96.0891, image: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
];

const jobSeekersPosts = [
  { id: 'js1', name: 'John Doe', skill: 'Senior Plumber - 5 Yrs Exp', location: 'Yangon', rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: 'js2', name: 'Jane Smith', skill: 'Graphic Designer (UI/UX)', location: 'Bago', rating: 5.0, image: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

// --- Reusable Components ---

const PostCard = ({ item, type, onpress }) => (
    <TouchableOpacity onPress={onpress}>
      <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          {type === 'employer' ? (
            <>
              <Text style={styles.cardTitle}>{item.role}</Text>
              <Text style={styles.cardSubtitle}>{item.company}</Text>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>{item.name}</Text>
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
);

const JobSearchScreen = () => {
  const [activeTab, setActiveTab] = useState('employer'); // 'employer' or 'seeker'
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const router = useRouter();

  const handleCreatePost = () => {
      // Navigate to a new screen for creating a post or profile
      if (activeTab === 'employer') {
          router.push('/create-job-post');
      } else {
          router.push('/create-seeker-profile');
      }
  }

  const renderContent = () => {
    const data = activeTab === 'employer' ? employersPosts : jobSeekersPosts;

    if (viewMode === 'map') {
      return (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.8661, // Center of Myanmar
            longitude: 96.0891,
            latitudeDelta: 8,
            longitudeDelta: 8,
          }}
        >
          {data.map(item => (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.lat, longitude: item.lng }}
              title={activeTab === 'employer' ? item.role : item.name}
              description={activeTab === 'employer' ? item.company : item.skill}
            />
          ))}
        </MapView>
      );
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} type={activeTab} onpress={() => router.push(`/job-details/${item.id}?type=${activeTab}`)}/>}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Hub</Text>
        <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          placeholder={activeTab === 'employer' ? "Search for jobs (e.g., 'Developer')" : "Search for talent (e.g., 'Plumber')"}
          style={styles.searchInput}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'employer' && styles.activeTab]}
          onPress={() => setActiveTab('employer')}
        >
          <MaterialIcons name="business-center" size={20} color={activeTab === 'employer' ? COLORS.white : COLORS.primary} />
          <Text style={[styles.tabText, activeTab === 'employer' && styles.activeTabText]}>
            Find a Job
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'seeker' && styles.activeTab]}
          onPress={() => setActiveTab('seeker')}
        >
          <MaterialIcons name="person-search" size={20} color={activeTab === 'seeker' ? COLORS.white : COLORS.primary} />
          <Text style={[styles.tabText, activeTab === 'seeker' && styles.activeTabText]}>
            Find Talent
          </Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Switcher */}
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

      {/* Floating Action Button (FAB) */}
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
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  cardImage: { width: 60, height: 60, borderRadius: 30 },
  cardContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { marginLeft: 4, color: COLORS.textSecondary },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 } },
  map: { flex: 1 }
});