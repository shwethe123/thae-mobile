import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAttractions } from '../../utils/mapAPI';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attractions, setAttractions] = useState([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required.');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        setMapRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        const data = await getAttractions();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        setAttractions(data);
      } catch (err) {
        console.error('MAP LOAD ERROR:', err);
        Alert.alert('Error', 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Extract unique types from data dynamically
  const attractionTypes = useMemo(() => {
    const types = attractions.map((place) => place.type).filter(Boolean);
    return ['All', ...Array.from(new Set(types))];
  }, [attractions]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    const lower = text.toLowerCase().trim();
    if (lower === '' || lower === 'all') {
      setFilterType(null);
    } else {
      const matchedType = attractionTypes.find(
        (type) => type.toLowerCase() !== 'all' && type.toLowerCase().includes(lower)
      );
      setFilterType(matchedType || null);
    }
  };

  const handleFilterPress = (type) => {
    const selected = type === 'All' ? null : type;
    setFilterType(selected);
    setSearchQuery(selected || '');
  };

  // ✅ Fuzzy search with Fuse.js
  const filteredAttractions = useMemo(() => {
    let results = attractions;

    if (searchQuery.trim() !== '') {
      const fuse = new Fuse(attractions, {
        keys: ['title', 'type', 'description'],
        threshold: 0.3,
      });
      const fuseResults = fuse.search(searchQuery.trim());
      results = fuseResults.map((result) => result.item);
    }

    if (filterType) {
      results = results.filter((place) => place.type === filterType);
    }

    return results;
  }, [searchQuery, filterType, attractions]);

  const onMarkerPress = (place) => {
    setSelectedPlace(place);
    setMapRegion({
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const savePlace = async (place) => {
    try {
      const existing = await AsyncStorage.getItem('saved_places');
      const saved = existing ? JSON.parse(existing) : [];
      const alreadySaved = saved.some((p) => p._id === place._id || p.id === place.id);
      if (alreadySaved) return;
      const updated = [...saved, place];
      await AsyncStorage.setItem('saved_places', JSON.stringify(updated));
      Alert.alert('Saved!', 'Place added to your saved list.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save place.');
    }
  };

  if (loading || !mapRegion || !location?.coords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2a9d8f" />
        <Text style={{ marginTop: 10 }}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles.map} region={mapRegion} showsUserLocation>
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />
        {filteredAttractions.map((place) => (
          <Marker
            key={place._id || place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.title}
            description={place.type}
            pinColor={
              place.type === 'Pagoda'
                ? 'gold'
                : place.type === 'Viewpoint'
                ? 'orange'
                : place.type === 'Night Market'
                ? 'green'
                : 'red'
            }
            onPress={() => onMarkerPress(place)}
          />
        ))}
      </MapView>

      {/* Overlay UI */}
      <BlurView intensity={60} tint="light" style={styles.overlayContainer}>
        <TextInput
          placeholder=" Search places..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchBox}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {attractionTypes.map((type) => (
            <TouchableOpacity key={type} onPress={() => handleFilterPress(type)}>
              <Text
                style={[
                  styles.filterBtn,
                  filterType === type || (type === 'All' && !filterType)
                    ? styles.activeFilter
                    : null,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BlurView>

      {/* Info Card */}
      {selectedPlace && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setSelectedPlace(null)}
        >
          <View style={styles.bottomCard}>
            <Image source={{ uri: selectedPlace.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{selectedPlace.title}</Text>
            <Text style={styles.cardDesc}>{selectedPlace.description}</Text>
            <TouchableOpacity
              onPress={() => router.push(`/attraction/${selectedPlace._id || selectedPlace.id}`)}
            >
              <Text style={styles.linkText}>📍 See more</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => savePlace(selectedPlace)}>
              <Text style={[styles.linkText, { color: '#e63946' }]}>💾 Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 40,
    left: -10,
    right: -10,
    padding: 10,
    borderRadius: 16,
  },
  searchBox: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 50,
    paddingHorizontal: 15,
    fontSize: 14,
    borderColor: '#ddd',
    borderWidth: 0.6,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#3a86ff',
    color: '#fff',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
  },
  linkText: {
    color: '#2a9d8f',
    fontWeight: '600',
    marginTop: 10,
    fontSize: 14,
  },
});
