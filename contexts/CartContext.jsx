import { createContext, useContext, useMemo, useState } from 'react';
import { ToastAndroid } from 'react-native';

// 1. Create the context with a default value
// This default value is only used when a component is NOT inside the provider.
// We can give it a shape to prevent 'undefined' errors during development.
const CartContext = createContext({
  cartItems: [],
  cartSummary: { totalItems: 0, totalPrice: 0 },
  addToCart: () => console.warn('addToCart called outside of CartProvider'),
  updateCartItemQuantity: () => console.warn('updateCartItemQuantity called outside of CartProvider'),
  clearCart: () => console.warn('clearCart called outside of CartProvider'),
});


// 2. Create the Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    ToastAndroid.show(`${product.name} added to cart`, ToastAndroid.SHORT);
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.product.id !== productId);
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [cartItems]);

  // Make sure the value object shape matches the context's default value shape
  const value = {
    cartItems,
    addToCart,
    updateCartItemQuantity,
    clearCart,
    cartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Create the custom hook to use the context
export const useCart = () => {
  const context = useContext(CartContext);
  
  // This check is crucial for debugging.
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider. Make sure your component is wrapped correctly in _layout.jsx.');
  }

  return context;
};