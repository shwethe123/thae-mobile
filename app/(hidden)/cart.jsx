import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../contexts/CartContext'; // Import the useCart hook

// --- Design Constants (You can move these to a central file) ---
const COLORS = { primary: '#F96D41', white: '#FFFFFF', black: '#1C1C1E', gray: '#8A8A8E', background: '#F8F9FA', danger: '#E63946' };
const SIZES = { padding: 16, radius: 12, h1: 28, h2: 22, body: 14 };

// Reusable component for each item in the cart
const CartItemCard = ({ item, onUpdateQuantity }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.product.image }} style={styles.cardImage} />
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{item.product.name}</Text>
      <Text style={styles.cardPrice}>${item.product.price.toFixed(2)}</Text>
    </View>
    <View style={styles.quantityContainer}>
      <TouchableOpacity onPress={() => onUpdateQuantity(item.product.id, item.quantity - 1)} style={styles.quantityButton}>
        <Ionicons name="remove" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{item.quantity}</Text>
      <TouchableOpacity onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)} style={styles.quantityButton}>
        <Ionicons name="add" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

const CartScreen = () => {
  const { cartItems, updateCartItemQuantity, cartSummary } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)/')}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => (
          <CartItemCard item={item} onUpdateQuantity={updateCartItemQuantity} />
        )}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>${cartSummary.totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

// Add this at the bottom of app/(tabs)/cart.jsx
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: { fontSize: SIZES.h1, fontWeight: 'bold', padding: SIZES.padding, color: COLORS.black },
  // Card
  card: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 10, marginBottom: 15, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  cardImage: { width: 80, height: 80, borderRadius: SIZES.radius },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.black },
  cardPrice: { fontSize: 14, color: COLORS.primary, marginTop: 5, fontWeight: 'bold' },
  // Quantity
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: SIZES.radius },
  quantityButton: { padding: 8 },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },
  // Footer
  footer: { padding: SIZES.padding, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: COLORS.white },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: COLORS.gray },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: COLORS.black },
  checkoutButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: SIZES.radius, alignItems: 'center' },
  checkoutButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  // Empty State
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: SIZES.h2, fontWeight: '600', color: COLORS.black, marginTop: 20 },
  emptySubtitle: { fontSize: 16, color: COLORS.gray, textAlign: 'center', marginTop: 10 },
  shopButton: { marginTop: 30, backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: SIZES.radius },
  shopButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});