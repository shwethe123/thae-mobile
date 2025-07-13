import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';
import VerifyEmail from './verify-email';

const SignUpScreen = () => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !fullName.trim()) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    if (password.length < 6) {
      return Alert.alert('Error', 'Password must be at least 6 characters');
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        username: fullName.replace(/\s+/g, '').toLowerCase(), // optional
        unsafeMetadata: {
          fullName, // store full name in metadata
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to create account');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />;
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={authStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={authStyles.imageContainer}>
            <Image
              source={require('../../assets/images/adaptive-icon.png')}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>
          <View style={authStyles.container}>
            {/* Full Name Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textLight}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.back()}>
              <Text style={authStyles.linkText}>
                Already have an account? <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
