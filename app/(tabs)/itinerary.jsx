import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authStyles } from '../../assets/styles/auth.styles';

const ItineraryScreen = () => {
  const router = useRouter();

  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [attractionsData, setAttractionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    type: '',
    latitude: '',
    longitude: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://h-submit-backend-shwethe.onrender.com/api/attractions');
      const data = await res.json();
      setAttractionsData(data);
    } catch {
      Alert.alert('Error', 'Failed to fetch attractions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  const incrementView = async (id) => {
    try {
      await fetch(`https://h-submit-backend-shwethe.onrender.com/api/attractions/${id}/view`, {
        method: 'POST',
      });
      fetchAttractions();
    } catch (e) {
      console.warn('Failed to increment viewCount', e);
    }
  };

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageUri) {
        const fileName = imageUri.split('/').pop();
        const ext = fileName.split('.').pop();
        formData.append('image', { uri: imageUri, name: fileName, type: `image/${ext}` });
      }

      const resp = await fetch('https://h-submit-backend-shwethe.onrender.com/api/attractions', {
        method: 'POST',
        body: formData,
      });
      const txt = await resp.text();
      if (!resp.ok) throw new Error(txt);
      Alert.alert('Success', 'Attraction inserted');
      setModalVisible(false);
      setForm({ title: '', type: '', latitude: '', longitude: '', description: '' });
      setImageUri(null);
      fetchAttractions();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // ✅ Fuzzy filtered attractions
  const filteredAttractions = useMemo(() => {
    if (!searchQuery.trim()) return attractionsData;
    const fuse = new Fuse(attractionsData, {
      keys: ['title', 'type', 'description'],
      threshold: 0.3,
    });
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery, attractionsData]);

const renderAttraction = (place) => (
  <TouchableOpacity
    key={place._id}
    style={styles.card}
    onPress={() => {
      incrementView(place._id);
      router.push(`/attraction/${place._id}`);
    }}
  >
    <Image source={{ uri: place.image }} style={styles.image} />
    <View style={styles.info}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={styles.title}>{place.title}</Text>
          <Text style={styles.type}>{place.type}</Text>
        </View>
        <Feather name="chevron-right" size={25} color="#999" />
      </View>
    </View>
  </TouchableOpacity>
);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a9d8f" />
        <Text style={{ marginTop: 12, fontSize: 16 }}>Loading attractions...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={authStyles.container}>
                      {/* 🔍 Search Box */}
      <TextInput
        style={styles.searchBox}
        placeholder="🔍 Search attractions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
        {/* 🔥 Popular Section */}
        {attractionsData.length > 0 && (
          <View style={styles.popularCard}>
            <Text style={styles.popularHeader}>🔥 Popular Attractions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {attractionsData
                .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                .slice(0, 5)
                .map((place) => (
                  <TouchableOpacity
                    key={place._id}
                    style={styles.popularItem}
                    onPress={() => {
                      incrementView(place._id);
                      router.push(`/attraction/${place._id}`);
                    }}
                  >
                    <Image source={{ uri: place.image }} style={styles.popularImage} />
                    <Text style={styles.popularTitle}>{place.title}</Text>
                    <Text style={styles.popularType}>
                      {place.type} • {(place.viewCount || 0)} views
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {/* 📍 All List */}
        <Text style={styles.header}>📍 All Attractions</Text>
          {filteredAttractions.map(renderAttraction)}
      </ScrollView>

      {/* ➕ Insert Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>＋ Insert</Text>
      </TouchableOpacity>

      {/* 📥 Modal Insert Form */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Insert New Attraction</Text>
          {['title', 'type', 'latitude', 'longitude', 'description'].map((field) => (
            <TextInput
              key={field}
              placeholder={`Enter ${field}`}
              style={styles.input}
              value={form[field]}
              onChangeText={(text) => handleChange(field, text)}
            />
          ))}

          <TouchableOpacity onPress={pickImage} style={styles.pickBtn}>
            <Text style={styles.pickBtnText}>
              {imageUri ? '📸 Image Selected' : 'Choose Image'}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ height: 200, marginBottom: 12, borderRadius: 10 }}
            />
          )}

          <TouchableOpacity onPress={handleSubmit}>
            <LinearGradient
              colors={['#0496ff', '#90caf9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionBtn}
            >
              <Text style={styles.pickBtnText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.actionBtn}>
            <Text style={styles.pickBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default ItineraryScreen;


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  },
    searchBox: {
    height: 50,
    borderRadius: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  popularCard: {
    marginBottom: 20,
    backgroundColor: '#fff0ea',
    // borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  popularHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 8,
    color: '#e63946',
  },
  popularItem: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 8,
  },
  popularImage: { width: '100%', height: 100 },
  popularTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    marginHorizontal: 8,
    color: '#264653',
  },
  popularType: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 8,
    marginTop: 2,
    paddingBottom: 5
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#2a9d8f',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  info: {
  flex: 1,
  padding: 10,
  justifyContent: 'center',
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#264653' },
  type: { color: '#888', marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2a9d8f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { padding: 24, paddingBottom: 80 },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2a9d8f',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbdefb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#fdfdfd',
    elevation: 1,
  },
  pickBtn: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  pickBtnText: { fontSize: 16, fontWeight: 'bold' },
  actionBtn: {
    backgroundColor: '#dbe4ee',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 2,
  },
});
