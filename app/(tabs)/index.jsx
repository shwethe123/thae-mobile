import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useCart } from '../../contexts/CartContext'; // 1. Import the useCart hook

// --- Design System Constants ---
const COLORS = {
  primary: '#F96D41',
  white: '#FFFFFF',
  black: '#1C1C1E',
  lightGray: '#F7F7F7',
  gray: '#8A8A8E',
  darkGray: '#4A4A4A',
  background: '#FFFFFF',
  danger: '#FF3B30',
  star: '#FFC700',
  heart: '#E91E63',
};

const SIZES = {
  padding: 16,
  radius: 12,
  h1: 28,
  h2: 22,
  h3: 16,
  body: 14,
};

// --- Dummy Data ---
const categories = [
  { id: 'all', name: 'All' },
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
    category: 'Shoes',
    rating: 4,
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 89,
    image: 'https://shorturl.at/d55yH',
    category: 'Electronics',
    rating: 5,
  },
  {
    id: '3',
    name: 'Summer T-Shirt',
    price: 25,
    image: 'https://shorturl.at/dtTJW',
    category: 'Clothing',
    rating: 3,
  },
  {
    id: '4',
    name: 'Smart Watch',
    price: 199,
    image: 'https://shorturl.at/NYMYO',
    category: 'Electronics',
    rating: 4,
  },
];


// --- Cart Actions Component ---
const CartActions = ({ quantity, onIncrease, onDecrease }) => (
  <Animatable.View animation="fadeIn" duration={300} style={styles.cartActionsContainer}>
    <TouchableOpacity onPress={onDecrease} style={styles.actionButton}>
      <Ionicons name="remove" size={18} color={COLORS.primary} />
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity onPress={onIncrease} style={styles.actionButton}>
      <Ionicons name="add" size={18} color={COLORS.primary} />
    </TouchableOpacity>
  </Animatable.View>
);


// --- Reusable Product Card Component ---
const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onProductPress, cartItem, onUpdateCart }) => {
  const handleIncrease = () => {
    onUpdateCart(product.id, (cartItem?.quantity || 0) + 1);
  };

  const handleDecrease = () => {
    onUpdateCart(product.id, cartItem.quantity - 1);
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={onProductPress}>
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={onToggleWishlist}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={24}
            color={isWishlisted ? COLORS.heart : COLORS.darkGray}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < product.rating ? 'star' : 'star-outline'}
              size={16}
              color={COLORS.star}
            />
          ))}
        </View>
      </View>

      {cartItem && cartItem.quantity > 0 ? (
        <CartActions
          quantity={cartItem.quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      ) : (
        <TouchableOpacity style={styles.addCartBtn} onPress={() => onAddToCart(product)}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};


// --- Main Home Screen Component ---
const OnlineShoppingHomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  // 2. Get cart data and functions from the context
  const { cartItems, addToCart, updateCartItemQuantity, cartSummary } = useCart();
  
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);
  
  // 3. Get the total item count from the cart summary
  const cartCount = cartSummary.totalItems;

  const filteredProducts = React.useMemo(() => 
    productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) &&
        (!selectedCategory || product.category === selectedCategory)
    ), [query, selectedCategory]
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hello, Shopper!</Text>
          <Text style={styles.title}>Let's find your style</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartIconContainer} 
          onPress={() => router.push('/cart')} // Navigate to cart screen
        >
          <Ionicons name="cart-outline" size={30} color={COLORS.black} />
          {cartCount > 0 && (
            <Animatable.View animation="bounceIn" style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </Animatable.View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color={COLORS.gray} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor={COLORS.gray}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Categories */}
      <View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.name === 'All' ? null : item.name)}
              style={[
                styles.category,
                (selectedCategory === item.name || (!selectedCategory && item.name === 'All')) && styles.categorySelected,
              ]}
            >
              <Text style={[ styles.categoryText, (selectedCategory === item.name || (!selectedCategory && item.name === 'All')) && styles.categoryTextSelected, ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <Text style={styles.sectionTitle}>Featured Products</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={{flex: 1}}>
            {renderHeader()}
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => {
          // 4. Find the cart item from the global context
          const cartItem = cartItems.find(ci => ci.product.id === item.id);
          return (
            <ProductCard
              product={item}
              cartItem={cartItem}
              onAddToCart={addToCart}
              onUpdateCart={updateCartItemQuantity}
              onToggleWishlist={() => toggleWishlist(item.id)}
              isWishlisted={wishlist.includes(item.id)}
              onProductPress={() =>
                router.push({
                  pathname: `/product/${item.id}`,
                  params: { ...item },
                })
              }
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      />
    </SafeAreaView>
  );
};

export default OnlineShoppingHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  greetingText: {
    fontSize: SIZES.body,
    color: COLORS.gray,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  cartIconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: COLORS.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    marginVertical: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.h3,
    color: COLORS.black,
  },
  category: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    marginRight: 10,
    backgroundColor: COLORS.lightGray,
  },
  categorySelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 150,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  addCartBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  cartActionsContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginHorizontal: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: 50,
    fontSize: SIZES.h3,
  },
});