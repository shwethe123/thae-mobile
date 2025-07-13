import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';

const SignInScreen = () => {
    const router = useRouter();

    const {signIn, setActive, isLoaded} = useSignIn()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading ] = useState(false);

    const handleSignIn = async() => {
        if (!email || !password) {
            Alert.alert("Error", "ကျေးဇူးပြုပြီး email နှင့် password ကိုထည့်ပါ");
            return;
        };
        if(!isLoaded) return;
        setLoading(true);

        try {
            const signInAttempt = await signIn.create({ identifier: email, password});
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId});
            } else {
                Alert.alert("Error", "Sign in Failed, ကျေးဇူးပြုပြီးထပ်မံကြိုးစားကြည့်ပါ");
                console.log(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            Alert.alert("Error", err.error?.[0]?.message || "Sign in failed");
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false)
        }
    }

  return (
    <View style={authStyles.container}>
        <KeyboardAvoidingView
            style={authStyles.keyboardView}
            behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={authStyles.scrollContent}
                showsVerticalScrollIndicator = {false}
            >
                <View style={authStyles.imageContainer}>
                    <Image
                        source={require("../../assets/images/adaptive-icon.png")}
                        style={authStyles.image}
                        contentFit="contain"
                    />
                </View>
                <Text style={authStyles.title}>Wellcome Back</Text>
                <View style={authStyles.formContainer}>
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
                    <View style={authStyles.inputContainer}>
                        <TextInput
                            style={authStyles.textInput}
                            placeholder='Enter password'
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
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                color={COLORS.textLight}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                        onPress={handleSignIn}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={authStyles.buttonText}>
                            {loading ? "Signing In...." : "Sign In"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={authStyles.linkContainer}
                        onPress={() => router.push("/(auth)/sign-up")}
                    >
                        <Text style={authStyles.linkText}>
                            Don&apos;t have an account?
                            <Text style={authStyles.link}>Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen