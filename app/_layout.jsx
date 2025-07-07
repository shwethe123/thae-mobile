import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from '../contexts/CartContext'; // Make sure this path is correct
import { ThemeProvider } from '../contexts/ThemeContext';
import { tokenCache } from '../lib/tokenCache'; // Make sure this path is correct

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoaded, isSignedIn]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          {/* 👇 THIS IS THE MOST IMPORTANT PART 👇 */}
          <CartProvider>
              <InitialLayout />
          </CartProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}