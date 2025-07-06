import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// import LottieView from 'lottie-react-native'; // Optional Lottie animation

export default function AttractionDetail() {
  const { id } = useLocalSearchParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const res = await fetch('https://h-submit-backend-shwethe.onrender.com/api/attractions');
        const data = await res.json();
        const found = data.find((item) => item._id === id || item.id === id);
        setPlace(found);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch attraction details');
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [id]);

  const openMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const savePlace = async () => {
    try {
      const existing = await AsyncStorage.getItem('saved_places');
      const saved = existing ? JSON.parse(existing) : [];
      const isAlreadySaved = saved.some((p) => p._id === place._id || p.id === place.id);
      if (!isAlreadySaved) {
        saved.push(place);
        await AsyncStorage.setItem('saved_places', JSON.stringify(saved));
        Alert.alert('Saved!', 'This place was added to your saved list.');
      } else {
        Alert.alert('Already Saved');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        {/* You can replace spinner with Lottie animation like this:
        <LottieView
          source={require('../../assets/loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        */}
        <ActivityIndicator size="large" color="#2a9d8f" />
        <Text style={styles.loadingText}>Fetching attraction details...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ Attraction not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: place.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{place.title}</Text>
          <Text style={styles.description}>{place.description}</Text>
          <Button title="Get Directions" onPress={openMap} />
          <View style={styles.buttonContainer}>
            <Button title="❤️ Save" onPress={savePlace} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
  },
  image: {
    width: width,
    height: 300,
    marginTop: -StatusBar.currentHeight || 0,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#264653',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#444',
  },
  buttonContainer: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    // color: '#3a86ff',
  },
  errorText: {
    fontSize: 16,
    color: '#e63946',
    textAlign: 'center',
  },
});
