import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Design System Constants ---
const COLORS = {
  primary: '#0077B6', // A calming blue
  accent: '#FF8C42',  // A warm accent orange
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#E9ECEF',
  danger: '#DC3545',
};

const SIZES = {
  padding: 20,
  radius: 12,
  h1: 26,
  h2: 20,
  h3: 16,
  body: 14,
};

// --- Reusable Components ---

// Card for the main list of attractions
const AttractionCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardInfo}>
      <View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardType}>{item.type}</Text>
      </View>
      <Feather name="chevron-right" size={24} color={COLORS.textSecondary} />
    </View>
  </TouchableOpacity>
);

// Card for the horizontal popular list
const PopularCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.popularItem} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.popularImage} />
    <View style={styles.popularOverlay} />
    <View style={styles.popularTextContainer}>
      <Text style={styles.popularTitle}>{item.title}</Text>
      <Text style={styles.popularViews}>
        <Feather name="eye" size={12} color={COLORS.white} /> {item.viewCount || 0}
      </Text>
    </View>
  </TouchableOpacity>
);

// --- Main Screen Component ---
const ItineraryScreen = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [attractionsData, setAttractionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchAttractions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('https://h-submit-backend-shwethe.onrender.com/api/attractions');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setAttractionsData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch attractions. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttractions();
  }, [fetchAttractions]);

  const incrementView = async (id) => {
    try {
      await fetch(`https://h-submit-backend-shwethe.onrender.com/api/attractions/${id}/view`, {
        method: 'POST',
      });
      // No need to refetch, we can update the state locally for immediate feedback if needed
    } catch (e) {
      console.warn('Failed to increment viewCount', e);
    }
  };

  const handleCardPress = (item) => {
    incrementView(item._id);
    router.push(`/attraction/${item._id}`);
  };

  const onAddSuccess = () => {
    setModalVisible(false);
    fetchAttractions(); // Refetch data after successful submission
  };

  const filteredAttractions = useMemo(() => {
    if (!searchQuery.trim()) return attractionsData;
    const fuse = new Fuse(attractionsData, {
      keys: ['title', 'type', 'description'],
      threshold: 0.3,
    });
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery, attractionsData]);
  
  const popularAttractions = useMemo(
    () => attractionsData.slice().sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5),
    [attractionsData]
  );
    
  if (loading && attractionsData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Attractions...</Text>
      </View>
    );
  }

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Find your next adventure</Text>
      </View>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for places..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {popularAttractions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Popular Now</Text>
          <FlatList
            data={popularAttractions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `popular-${item._id}`}
            renderItem={({ item }) => <PopularCard item={item} onPress={() => handleCardPress(item)} />}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>
      )}
      <Text style={styles.sectionTitle}>📍 All Attractions</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredAttractions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AttractionCard item={item} onPress={() => handleCardPress(item)} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No attractions found for "{searchQuery}"</Text>
        )}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
      
      <AddAttractionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={onAddSuccess}
      />
    </SafeAreaView>
  );
};

// --- Modal Component (for adding new attractions) ---
const AddAttractionModal = ({ visible, onClose, onSuccess }) => {
  const [form, setForm] = useState({ title: '', type: '', latitude: '', longitude: '', description: '' });
  const [imageUri, setImageUri] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const resetForm = () => {
      setForm({ title: '', type: '', latitude: '', longitude: '', description: '' });
      setImageUri(null);
  };
  
  const handleClose = () => {
      resetForm();
      onClose();
  };

  const handleSubmit = async () => {
    if (!form.title || !form.type || !imageUri) {
        Alert.alert('Missing Info', 'Please fill in the title, type, and choose an image.');
        return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      
      const fileName = imageUri.split('/').pop();
      const ext = fileName.split('.').pop();
      formData.append('image', { uri: imageUri, name: fileName, type: `image/${ext}` });
      
      const resp = await fetch('https://h-submit-backend-shwethe.onrender.com/api/attractions', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const txt = await resp.text();
      if (!resp.ok) throw new Error(txt);

      Alert.alert('Success', 'Attraction added successfully!');
      resetForm();
      onSuccess();
    } catch (err) {
      Alert.alert('Error', `Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Add New Attraction</Text>
             <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={COLORS.textSecondary}/>
             </TouchableOpacity>
          </View>
          
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
            data={[{key: 'form'}]} // FlatList needs data
            renderItem={() => (
                <>
                {['title', 'type', 'latitude', 'longitude', 'description'].map((field) => (
                    <TextInput
                        key={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        style={styles.input}
                        placeholderTextColor={COLORS.textSecondary}
                        value={form[field]}
                        onChangeText={(text) => handleChange(field, text)}
                        keyboardType={field === 'latitude' || field === 'longitude' ? 'numeric' : 'default'}
                    />
                ))}
    
                <TouchableOpacity onPress={pickImage} style={styles.pickBtn}>
                    <Feather name="image" size={20} color={COLORS.primary} />
                    <Text style={styles.pickBtnText}>{imageUri ? 'Change Image' : 'Select Image'}</Text>
                </TouchableOpacity>
    
                {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage}/>}
                
                <TouchableOpacity onPress={handleSubmit} style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.submitBtnText}>Submit Attraction</Text>
                    )}
                </TouchableOpacity>
                </>
            )}
            />
        </SafeAreaView>
    </Modal>
  );
};


// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 12, fontSize: SIZES.h3, color: COLORS.textSecondary },
  // Header & Search
  header: { paddingBottom: 10 },
  headerTitle: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text },
  headerSubtitle: { fontSize: SIZES.h3, color: COLORS.textSecondary },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: SIZES.radius, paddingHorizontal: 16, height: 50, marginVertical: 10, elevation: 2, shadowColor: COLORS.black, shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: SIZES.h3, color: COLORS.text },
  // Sections
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text, marginTop: 10, marginBottom: 5 },
  // Popular Card
  popularItem: { width: 180, height: 220, marginRight: 15, borderRadius: SIZES.radius, overflow: 'hidden', backgroundColor: COLORS.lightGray },
  popularImage: { width: '100%', height: '100%', position: 'absolute' },
  popularOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  popularTextContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 },
  popularTitle: { fontSize: SIZES.h3, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 },
  popularViews: { fontSize: SIZES.body, color: COLORS.white, opacity: 0.9 },
  // Attraction Card
  card: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, marginBottom: SIZES.padding, overflow: 'hidden', elevation: 2, shadowColor: COLORS.black, shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardImage: { width: '100%', height: 150 },
  cardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  cardTitle: { fontSize: SIZES.h3, fontWeight: '600', color: COLORS.text },
  cardType: { color: COLORS.textSecondary, marginTop: 4, fontSize: SIZES.body },
  // FAB
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 5 },
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  modalTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text },
  closeButton: { padding: 5 },
  modalContent: { padding: SIZES.padding },
  input: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: SIZES.radius, padding: 15, marginBottom: 15, fontSize: SIZES.h3, color: COLORS.text },
  pickBtn: { flexDirection: 'row', backgroundColor: COLORS.lightGray, padding: 15, borderRadius: SIZES.radius, marginBottom: 15, alignItems: 'center', justifyContent: 'center' },
  pickBtnText: { fontSize: SIZES.h3, fontWeight: '600', color: COLORS.primary, marginLeft: 10 },
  previewImage: { width: '100%', height: 200, borderRadius: SIZES.radius, marginBottom: 20 },
  submitBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 10 },
  submitBtnDisabled: { backgroundColor: COLORS.textSecondary },
  submitBtnText: { fontSize: SIZES.h3, fontWeight: 'bold', color: COLORS.white },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 50, fontSize: SIZES.h3 },
});

export default ItineraryScreen;