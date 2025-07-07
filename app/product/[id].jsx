import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- ဒီနေရာမှာ သင့် app ရဲ့ theme colors/sizes ကို import လုပ်ပါ ---
// ဥပမာ - import { COLORS, SIZES } from '../../constants/theme';
const COLORS = { primary: '#F96D41', white: '#FFFFFF', black: '#1C1C1E', gray: '#8A8A8E', background: '#FFFFFF' };
const SIZES = { padding: 16, h1: 32, h2: 24, body: 16, radius: 12 };

const ProductDetailScreen = () => {
  const router = useRouter();
  // Get the parameters passed from the home screen
  const { id, name, price, image, category, rating } = useLocalSearchParams();

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Product not found!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.productImage} resizeMode="cover" />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>{category}</Text>
          <Text style={styles.productName}>{name}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFC700" />
            <Text style={styles.ratingText}>{rating} (320 Reviews)</Text>
          </View>
          
          <Text style={styles.description}>
            A very comfortable and stylish product that fits all occasions. Made with high-quality materials to ensure durability and a great user experience.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.productPrice}>${price}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    width: '100%',
    height: 350,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SIZES.padding,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  categoryText: {
    fontSize: SIZES.body,
    color: COLORS.gray,
    marginBottom: 8,
  },
  productName: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: SIZES.body,
    color: COLORS.gray,
  },
  description: {
    fontSize: SIZES.body,
    color: COLORS.gray,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: COLORS.white,
  },
  priceLabel: {
    fontSize: SIZES.body,
    color: COLORS.gray,
  },
  productPrice: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: SIZES.radius,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;