import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function SavedScreen() {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [filter, setFilter] = useState(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await AsyncStorage.getItem('saved_places');
        setSavedPlaces(data ? JSON.parse(data) : []);
      })();
    }, [])
  );

  const removeFromSaved = async (id) => {
    const existing = await AsyncStorage.getItem('saved_places');
    const saved = existing ? JSON.parse(existing) : [];
    const updated = saved.filter((p) => p.id !== id);
    await AsyncStorage.setItem('saved_places', JSON.stringify(updated));
    setSavedPlaces(updated);
  };

  const filteredPlaces = filter
    ? savedPlaces.filter((p) => p.type === filter)
    : savedPlaces;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📌 Your Saved Places</Text>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['All', 'Pagoda', 'Viewpoint', 'Night Market'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type === 'All' ? null : type)}
          >
            <Text
              style={[
                styles.filterBtn,
                filter === type && styles.activeFilter,
                !filter && type === 'All' && styles.activeFilter,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredPlaces.length === 0 ? (
        <Text style={styles.emptyText}>No places found.</Text>
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/attraction/${item.id}`)}
            >
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.desc}>{item.description}</Text>

                  <TouchableOpacity
                    onPress={() => removeFromSaved(item.id)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2a2a2a',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: screenWidth * 0.5,
  },
  textContainer: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  desc: {
    fontSize: 14,
    color: '#555',
  },
  removeBtn: {
    marginTop: 10,
    backgroundColor: '#e63946',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activeFilter: {
    backgroundColor: '#2a9d8f',
    color: '#fff',
  },
});
