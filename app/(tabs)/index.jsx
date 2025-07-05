import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authStyles } from '../../assets/styles/auth.styles';

const categories = [
  { id: '1', name: 'Clothing' },
  { id: '2', name: 'Shoes' },
  { id: '3', name: 'Electronics' },
  { id: '4', name: 'Beauty' },
];

const productsData = [
  {
    id: '1',
    name: 'Nike Air Max',
    price: 120,
    image: 'https://images.pexels.com/photos/8859144/pexels-photo-8859144.jpeg',
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 89,
    image: 'https://shorturl.at/d55yH',
  },
  {
    id: '3',
    name: 'Summer T-Shirt',
    price: 25,
    image: 'https://shorturl.at/dtTJW',
  },
  {
    id: '4',
    name: 'Smart Watch',
    price: 199,
    image: 'https://shorturl.at/NYMYO',
  },
];

const OnlineShoppingHomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Normally you'd refetch data here
      setRefreshing(false);
    }, 2000);
  };

  const filteredProducts = productsData.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <View style={authStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>👋 Hello, Shopper!</Text>
        <View>
          <Ionicons name="cart-outline" size={28} color="#333" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Categories */}
      <View style={{ marginVertical: 16 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.category}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Product Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() =>
                router.push({
                  pathname: '../../component/product_details/productDetail.jsx',
                  params: {
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  },
                })
              }
            >
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
              <TouchableOpacity onPress={addToCart} style={styles.addCartBtn}>
                <Ionicons name="cart" size={18} color="#fff" />
                <Text style={{ color: '#fff', marginLeft: 5 }}>Add</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default OnlineShoppingHomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  category: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginBottom: 8,
  },
  addCartBtn: {
    flexDirection: 'row',
    backgroundColor: '#2a9d8f',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
