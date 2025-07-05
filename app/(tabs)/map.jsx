import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import attractions from '../../data/attractions';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterType, setFilterType] = useState(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    })();
  }, []);

  const filteredAttractions = attractions.filter(
    (place) => !filterType || place.type === filterType
  );

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
      const alreadySaved = saved.some((p) => p.id === place.id);
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
      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['All', 'Pagoda', 'Viewpoint', 'Night Market'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilterType(type === 'All' ? null : type)}
          >
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
      </View>

      {/* Map View */}
      <MapView style={styles.map} region={mapRegion} showsUserLocation>
        {/* User Location */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          description="Your current location"
          pinColor="blue"
        />

        {/* Attraction Markers */}
        {filteredAttractions.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
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

      {/* Tap outside to close Info Card */}
      {selectedPlace && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setSelectedPlace(null)}
        >
          <View style={styles.bottomCard}>
            <Image
              source={{ uri: selectedPlace.image }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>{selectedPlace.title}</Text>
            <Text style={styles.cardDesc}>{selectedPlace.description}</Text>

            <TouchableOpacity
              onPress={() => router.push(`/attraction/${selectedPlace.id}`)}
            >
              <Text style={styles.linkText}>📍 See more</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => savePlace(selectedPlace)}>
              <Text style={[styles.linkText, { color: '#e63946' }]}>
                💾 Save
              </Text>
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
    color: '#333',
    fontWeight: '500',
  },
  activeFilter: {
    backgroundColor: '#2a9d8f',
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
