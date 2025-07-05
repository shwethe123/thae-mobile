import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const BorderHelperHomeScreen = () => {
  const navigation = useNavigation();
   const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👋 Welcome to Tachileik Border Helper</Text>
      <Text style={styles.subtitle}>Find helpful info for border crossing and local services</Text>

      <View style={styles.menuContainer}>
        <MenuCard
          icon="document-text-outline"
          title="Visa Info"
          onPress={() => navigation.navigate('productDetail')}
        />
        <MenuCard
          icon="cash-outline"
          title="Exchange Rates"
          onPress={() => navigation.navigate('Rates')}
        />
        <MenuCard
          icon="map-outline"
          title="Places to Visit"
          onPress={() => navigation.navigate('Map')}
        />
        <MenuCard
          icon="language-outline"
          title="Translator"
          onPress={() => navigation.navigate('Translate')}
        />
        <MenuCard
          icon="cloud-outline"
          title="Weather"
          onPress={() => navigation.navigate('Weather')}
        />
      </View>
    </ScrollView>
  );
};

const MenuCard = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#2a9d8f" />
    <Text style={styles.cardText}>{title}</Text>
  </TouchableOpacity>
);

export default BorderHelperHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
