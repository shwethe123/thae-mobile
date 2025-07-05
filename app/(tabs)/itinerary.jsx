import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import itineraries from '../../data/itineraries.json';

const ItineraryScreen = () => {
  const router = useRouter();

  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [attractionsData, setAttractionsData] = useState([]);
  const [form, setForm] = useState({
    title: '',
    type: '',
    latitude: '',
    longitude: '',
    description: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('latitude', form.latitude);
      formData.append('longitude', form.longitude);
      formData.append('description', form.description);

      if (imageUri) {
        const fileName = imageUri.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('image', {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const response = await fetch('http://192.168.16.32:5000/api/attractions', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Server error: ${text}`);
      }

      if (contentType.includes('application/json')) {
        Alert.alert('Success', 'Attraction inserted');
      } else {
        throw new Error('Expected JSON response but got something else');
      }

      setModalVisible(false);
      setForm({
        title: '',
        type: '',
        latitude: '',
        longitude: '',
        description: '',
      });
      setImageUri(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const res = await fetch('http://192.168.16.32:5000/api/attractions');
        const data = await res.json();
        setAttractionsData(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch attractions');
      }
    };
    fetchAttractions();
  }, []);

  const renderAttraction = (id) => {
    const place = attractionsData.find((item) => item._id === id || item.id === id);
    if (!place) return null;

    return (
      <TouchableOpacity
        key={place._id || place.id}
        style={styles.card}
        onPress={() => router.push(`/attraction/${place._id || place.id}`)}
      >
        <Image source={{ uri: place.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{place.title}</Text>
          <Text style={styles.type}>{place.type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>🗓 1-Day Trip</Text>
        {itineraries['1day'].map(renderAttraction)}

        <Text style={styles.header}>🗓 2-Day Trip</Text>
        {itineraries['2day'].map(renderAttraction)}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>＋ Inset</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Inset New Attraction</Text>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#264653',
  },
  type: {
    color: '#888',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2a9d8f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    padding: 24,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
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
    // shadowColor: '#000',
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pickBtn: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  pickBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionBtn: {
    backgroundColor: '#dbe4ee',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  }
});