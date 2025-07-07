import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MapView, { Marker } from 'react-native-maps';

// --- Design System Constants ---
const COLORS = {
  primary: '#0077B6',
  accent: '#FF8C42',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  danger: '#DC3545',
};

const SIZES = {
  padding: 20,
  radius: 16,
  h1: 32,
  h2: 22,
  h3: 16,
  body: 14,
};

// --- Reusable Info Row Component ---
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={20} color={COLORS.primary} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);


export default function AttractionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAttraction = async () => {
      try {
        // --- Improved API Fetch: Fetch only the specific item ---
        const res = await fetch(`https://h-submit-backend-shwethe.onrender.com/api/attractions/${id}`);
        if (!res.ok) throw new Error('Attraction not found');
        const data = await res.json();
        setPlace(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        Alert.alert('Error', 'Failed to fetch attraction details.');
        setPlace(null); // Ensure place is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [id]);

  const openMap = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const savePlace = async () => {
    if (!place) return;
    try {
      const existing = await AsyncStorage.getItem('saved_places');
      const saved = existing ? JSON.parse(existing) : [];
      if (saved.some((p) => p._id === place._id)) {
        Alert.alert('Already Saved', 'This place is already in your list.');
        return;
      }
      await AsyncStorage.setItem('saved_places', JSON.stringify([...saved, place]));
      Alert.alert('Saved!', `${place.title} was added to your list.`);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save the place.');
    }
  };

  if (loading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.statusText}>Loading Details...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.statusContainer}>
        <Feather name="alert-triangle" size={40} color={COLORS.danger} />
        <Text style={styles.statusText}>Attraction Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <ImageBackground source={{ uri: place.image }} style={styles.headerImage}>
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
              <Feather name="chevron-left" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Animatable.View animation="fadeInUp" delay={200} style={styles.titleContainer}>
              <Text style={styles.title}>{place.title}</Text>
              <Text style={styles.subtitle}>{place.type}</Text>
            </Animatable.View>
          </SafeAreaView>
        </ImageBackground>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.contentContainer}>
          {/* --- Quick Info Section --- */}
          <View style={styles.infoGrid}>
            <InfoRow icon="tag" label="Category" value={place.type} />
            <InfoRow icon="eye" label="Views" value={place.viewCount || 'N/A'} />
          </View>
          
          {/* --- About Section --- */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{place.description}</Text>

          {/* --- Map Preview Section --- */}
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity onPress={openMap}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: place.latitude,
                longitude: place.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }} />
            </MapView>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {/* --- Sticky Footer Actions --- */}
      <SafeAreaView style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={savePlace}>
            <Ionicons name="heart-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.directionsButton} onPress={openMap}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  statusContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  statusText: { marginTop: 15, fontSize: SIZES.h3, color: COLORS.textSecondary, fontWeight: '600' },
  backButton: { marginTop: 20, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: SIZES.radius },
  backButtonText: { color: COLORS.white, fontWeight: 'bold' },
  // Header
  headerImage: { width: '100%', height: 350, justifyContent: 'space-between' },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: SIZES.padding },
  backIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, },
  titleContainer: { paddingBottom: 10 },
  title: { fontSize: SIZES.h1, color: COLORS.white, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  subtitle: { fontSize: SIZES.h3, color: COLORS.white, opacity: 0.9 },
  // Content
  contentContainer: { padding: SIZES.padding, backgroundColor: COLORS.background, borderTopLeftRadius: SIZES.radius, borderTopRightRadius: SIZES.radius, marginTop: -SIZES.radius * 1.5, minHeight: 400 },
  sectionTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text, marginBottom: 15, marginTop: 20 },
  description: { fontSize: SIZES.h3, color: COLORS.textSecondary, lineHeight: 24 },
  // Info Grid
  infoGrid: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.card, padding: 15, borderRadius: SIZES.radius, marginBottom: 10 },
  infoRow: { alignItems: 'center', flex: 1 },
  infoTextContainer: { alignItems: 'center', marginTop: 5 },
  infoLabel: { fontSize: SIZES.body, color: COLORS.textSecondary },
  infoValue: { fontSize: SIZES.h3, fontWeight: '600', color: COLORS.text },
  // Map
  map: { height: 200, borderRadius: SIZES.radius, width: '100%', marginTop: 10 },
  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingVertical: 10, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  saveButton: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger, borderRadius: SIZES.radius, marginRight: 15 },
  directionsButton: { flex: 1, height: 56, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderRadius: SIZES.radius },
  directionsButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});