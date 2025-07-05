import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { Button, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import attractions from '../../../data/attractions';

export default function AttractionDetail() {
  const { id } = useLocalSearchParams();
  const place = attractions.find((item) => item.id === id);

  if (!place) return <Text>Attraction not found</Text>;

  const openMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const savePlace = async () => {
    try {
        const existing = await AsyncStorage.getItem('saved_places');
        const saved = existing ? JSON.parse(existing) : [];
        const isAlreadySaved = saved.some(p => p.id === place.id);
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

  return (
    <View style={styles.container}>
      {/* Transparent Status Bar */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: place.image }} style={styles.image} />
        <View style={styles.content}>
           <Text style={styles.title}>{place.title}</Text>
           <Text style={styles.description}>{place.description}</Text>
            <Button title="Get Directions" onPress={openMap} />
            <Button style={styles.button_container} title="❤️ Save" onPress={savePlace} />
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
    marginTop: -StatusBar.currentHeight || 0, // Move image under status bar
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button_container: {
    paddingTop:10
  }
});
