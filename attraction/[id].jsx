import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import data from '../../data/attractions.json';

export default function AttractionDetailScreen() {
  const { id } = useLocalSearchParams();
  const place = data.find((item) => item.id === id);

  if (!place) {
    return (
      <View style={styles.container}>
        <Text>Place not found</Text>
      </View>
    );
  }

  const openMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: place.image }} style={styles.image} />
      <Text style={styles.title}>{place.title}</Text>
      <Text>{place.description}</Text>
      <Button title="Get Directions" onPress={openMap} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
});
