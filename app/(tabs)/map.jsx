import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { getAttractions } from '../../utils/mapAPI'; // Assuming this API utility exists

// --- Design System Constants ---
const COLORS = {
  primary: '#0077B6',
  accent: '#FF8C42',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  danger: '#DC3545',
  success: '#28A745',
  lightGray: '#E9ECEF',
};

const SIZES = {
  padding: 20,
  radius: 16,
  h1: 26,
  h2: 20,
  h3: 16,
  body: 14,
};

// --- Reusable Components ---

const CustomMarker = ({ place, isSelected, onPress }) => {
  const getMarkerIcon = (type) => {
    switch (type) {
      case 'Pagoda': return { name: 'landmark', color: '#DAA520' };
      case 'Viewpoint': return { name: 'hiking', color: '#FF8C42' };
      case 'Night Market': return { name: 'shopping-search', color: '#28A745' };
      default: return { name: 'map-marker', color: COLORS.danger };
    }
  };

  const { name, color } = getMarkerIcon(place.type);
  const scale = isSelected ? 1.3 : 1; // Enlarge if selected

  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Animatable.View 
        style={[styles.markerWrapper, { backgroundColor: color, transform: [{ scale }] }]}
        animation={isSelected ? "pulse" : undefined}
        iterationCount="infinite"
      >
        <MaterialCommunityIcons name={name} size={20} color={COLORS.white} />
      </Animatable.View>
    </Marker>
  );
};

const PlaceInfoCard = ({ place, onNavigate, onSave, onClose }) => (
  <Animatable.View animation="slideInUp" duration={500} style={styles.bottomCardContainer}>
    <TouchableOpacity style={styles.closeCardButton} onPress={onClose}>
        <Ionicons name="close-circle" size={30} color={COLORS.textSecondary} />
    </TouchableOpacity>
    <Image source={{ uri: place.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{place.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>{place.description}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onNavigate}>
            <Feather name="arrow-right-circle" size={20} color={COLORS.primary} />
            <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
            <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionButtonText, { color: COLORS.danger }]}>Save Place</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Animatable.View>
);

// --- Main Map Screen ---

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to use the map.');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        const data = await getAttractions();
        if (!Array.isArray(data)) throw new Error('Invalid data format received');
        setAttractions(data);
      } catch (err) {
        console.error('MAP LOAD ERROR:', err);
        Alert.alert('Error', `Failed to load map data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const attractionTypes = useMemo(() => {
    const types = attractions.map((place) => place.type).filter(Boolean);
    return ['All', ...Array.from(new Set(types))];
  }, [attractions]);

  const filteredAttractions = useMemo(() => {
    let results = attractions;
    if (searchQuery.trim()) {
      const fuse = new Fuse(attractions, { keys: ['title', 'type', 'description'], threshold: 0.3 });
      results = fuse.search(searchQuery.trim()).map(result => result.item);
    }
    if (filterType) {
      results = results.filter((place) => place.type === filterType);
    }
    return results;
  }, [searchQuery, filterType, attractions]);

  const onMarkerPress = useCallback((place) => {
    setSelectedPlace(place);
    mapRef.current?.animateToRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 500);
  }, []);

  const savePlace = async (place) => {
    try {
      const existing = await AsyncStorage.getItem('saved_places');
      const saved = existing ? JSON.parse(existing) : [];
      if (saved.some((p) => p._id === place._id)) {
        Alert.alert('Already Saved', 'This place is already in your saved list.');
        return;
      }
      await AsyncStorage.setItem('saved_places', JSON.stringify([...saved, place]));
      Alert.alert('Success!', `${place.title} has been saved.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save the place.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Finding your location...</Text>
      </View>
    );
  }

  if (!location) {
      return (
          <View style={styles.loader}>
              <Feather name="map-pin" size={40} color={COLORS.textSecondary}/>
              <Text style={styles.loaderText}>Location permission is needed.</Text>
              <Text style={styles.loaderSubText}>Please grant permission in your device settings.</Text>
          </View>
      )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsCompass={false}
        onPress={() => setSelectedPlace(null)} // Deselect when map is pressed
      >
        {filteredAttractions.map((place) => (
          <CustomMarker
            key={place._id}
            place={place}
            isSelected={selectedPlace?._id === place._id}
            onPress={() => onMarkerPress(place)}
          />
        ))}
      </MapView>

      <SafeAreaView style={styles.overlayContainer}>
        <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
                placeholder="Search for places or types"
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                onFocus={() => setSelectedPlace(null)}
            />
        </View>
        <FlatList
          data={attractionTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item: type }) => (
            <TouchableOpacity 
                style={[styles.filterButton, (filterType === type || (!filterType && type === 'All')) && styles.activeFilterButton]} 
                onPress={() => setFilterType(type === 'All' ? null : type)}
            >
                <Text style={[styles.filterText, (filterType === type || (!filterType && type === 'All')) && styles.activeFilterText]}>{type}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>

      {selectedPlace && (
        <PlaceInfoCard
          place={selectedPlace}
          onNavigate={() => router.push(`/attraction/${selectedPlace._id}`)}
          onSave={() => savePlace(selectedPlace)}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </View>
  );
};

export default MapScreen;

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, padding: 20 },
  loaderText: { marginTop: 15, fontSize: SIZES.h3, color: COLORS.text, fontWeight: '600' },
  loaderSubText: { marginTop: 5, fontSize: SIZES.body, color: COLORS.textSecondary, textAlign: 'center' },
  // Overlay UI
  overlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: SIZES.padding / 2 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: SIZES.radius, paddingHorizontal: 15, height: 50, marginTop: 10, marginHorizontal: SIZES.padding / 2, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: SIZES.h3, color: COLORS.text },
  filterList: { paddingVertical: 10, paddingHorizontal: SIZES.padding / 2 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: COLORS.card, marginRight: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 } },
  activeFilterButton: { backgroundColor: COLORS.primary },
  filterText: { color: COLORS.text, fontWeight: '500' },
  activeFilterText: { color: COLORS.white },
  // Custom Marker
  markerWrapper: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 2, borderWidth: 2, borderColor: COLORS.white },
  // Info Card
  bottomCardContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' },
  closeCardButton: { position: 'absolute', top: -15, right: 15, backgroundColor: COLORS.white, borderRadius: 15, zIndex: 10 },
  cardImage: { width: '100%', height: 200, borderTopLeftRadius: SIZES.radius, borderTopRightRadius: SIZES.radius },
  cardContent: { padding: SIZES.padding, backgroundColor: COLORS.card, borderBottomLeftRadius: SIZES.radius, borderBottomRightRadius: SIZES.radius, marginTop: -SIZES.radius, paddingTop: SIZES.padding + SIZES.radius },
  cardTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
  cardDescription: { fontSize: SIZES.body, color: COLORS.textSecondary, marginBottom: 15, lineHeight: 20 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: SIZES.radius, backgroundColor: COLORS.lightGray },
  actionButtonText: { marginLeft: 8, fontSize: SIZES.body, fontWeight: '600' },
});