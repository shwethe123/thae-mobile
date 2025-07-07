import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Swipeable } from 'react-native-gesture-handler';


// --- Design System Constants ---
const COLORS = {
  primary: '#0077B6',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  danger: '#E63946',
  lightGray: '#E9ECEF',
};

const SIZES = {
  padding: 20,
  radius: 12,
  h1: 28,
  h2: 22,
  h3: 16,
  body: 14,
};


// --- Reusable Components ---

const EmptyState = ({ onExplore }) => (
  <Animatable.View animation="fadeInUp" style={styles.emptyContainer}>
    <Feather name="bookmark" size={60} color={COLORS.lightGray} />
    <Text style={styles.emptyTitle}>No Saved Places Yet</Text>
    <Text style={styles.emptySubtitle}>Start exploring and save your favorite spots!</Text>
    <TouchableOpacity style={styles.exploreButton} onPress={onExplore}>
        <Text style={styles.exploreButtonText}>Explore Attractions</Text>
    </TouchableOpacity>
  </Animatable.View>
);

const SavedPlaceCard = ({ item, onNavigate, onRemove }) => {
    const renderRightActions = () => (
      <TouchableOpacity style={styles.deleteAction} onPress={onRemove}>
        <Feather name="trash-2" size={24} color={COLORS.white} />
      </TouchableOpacity>
    );
  
    return (
      <Swipeable renderRightActions={renderRightActions}>
          <TouchableOpacity onPress={onNavigate} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardType}>{item.type}</Text>
            </View>
            <Feather name="chevron-right" size={22} color={COLORS.textSecondary} style={styles.cardChevron}/>
          </TouchableOpacity>
      </Swipeable>
    );
};

// --- Main Screen Component ---

export default function SavedScreen() {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadSavedPlaces = async () => {
        try {
            const data = await AsyncStorage.getItem('saved_places');
            setSavedPlaces(data ? JSON.parse(data) : []);
        } catch (e) {
            console.error("Failed to load saved places", e);
            setSavedPlaces([]);
        }
      };
      loadSavedPlaces();
    }, [])
  );

  const handleRemove = useCallback(async (idToRemove) => {
    Alert.alert(
      "Remove Place",
      "Are you sure you want to remove this place from your saved list?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            const updatedPlaces = savedPlaces.filter(p => (p._id || p.id) !== idToRemove);
            setSavedPlaces(updatedPlaces);
            await AsyncStorage.setItem('saved_places', JSON.stringify(updatedPlaces));
            ToastAndroid.show("Place removed", ToastAndroid.SHORT);
          }
        }
      ]
    );
  }, [savedPlaces]);

  const uniqueTypes = useMemo(() => 
    ['All', ...new Set(savedPlaces.map(p => p.type).filter(Boolean))]
  , [savedPlaces]);

  const filteredPlaces = useMemo(() => 
    activeFilter === 'All' ? savedPlaces : savedPlaces.filter(p => p.type === activeFilter)
  , [savedPlaces, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Saved Places</Text>
      </View>

      {savedPlaces.length > 0 && (
         <View>
          <FlatList
            data={uniqueTypes}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterButton, activeFilter === item && styles.activeFilterButton]}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {filteredPlaces.length === 0 ? (
        <EmptyState onExplore={() => router.push('/(tabs)/itinerary')} />
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item._id || item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <SavedPlaceCard
              item={item}
              onNavigate={() => router.push(`/attraction/${item._id || item.id}`)}
              onRemove={() => handleRemove(item._id || item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: SIZES.h2,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: SIZES.h3,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  exploreButton: {
      marginTop: 30,
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: SIZES.radius,
  },
  exploreButtonText: {
      color: COLORS.white,
      fontWeight: 'bold',
      fontSize: SIZES.h3,
  },
  // Filter
  filterContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.white,
  },
  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: SIZES.radius,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardType: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cardChevron: {
      marginRight: 5,
  },
  // Swipe to delete
  deleteAction: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: SIZES.radius,
    marginBottom: 15,
    marginRight: SIZES.padding
  },
});