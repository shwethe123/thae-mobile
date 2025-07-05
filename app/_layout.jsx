import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from "expo-router";
import { StatusBar } from 'react-native';
import SafeScreen from '../component/SafeScreen';

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <StatusBar barStyle={'dark-content'}/>
        <Slot/>
      </SafeScreen>
    </ClerkProvider>
  );
}