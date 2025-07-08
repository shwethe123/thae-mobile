import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Theme Colors ---
const COLORS = { primary: '#1976D2', background: '#F5F5F5', surface: '#FFFFFF', text: '#212121', textSecondary: '#757575', border: '#E0E0E0', white: '#FFFFFF' };

const CreateSeekerProfileScreen = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        skill: '',
        experience: '',
        location: '',
        lat: '',
        lng: '',
        contactInfo: '',
        bio: '',
    });
    const [image, setImage] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        // --- Validation ---
        for (const key in formData) {
            if (!formData[key]) {
                Alert.alert('Incomplete Form', `Please fill in the ${key} field.`);
                return;
            }
        }
        if (!image) {
            Alert.alert('Incomplete Form', 'Please upload a profile photo.');
            return;
        }

        // --- Prepare FormData ---
        const postData = new FormData();
        postData.append('postType', 'seeker');
        postData.append('userId', 'temp_user_id_123');

        Object.keys(formData).forEach(key => {
            postData.append(key, formData[key]);
        });

        postData.append('image', {
            uri: image,
            name: `photo_${Date.now()}.jpg`,
            type: 'image/jpeg',
        });

        // --- API Call ---
        try {
            const response = await fetch('http://192.168.16.32:5000/api/job-posts', {
                method: 'POST',
                body: postData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) throw new Error('Failed to create profile');

            Alert.alert('Success', 'Your seeker profile has been created!', [
                { text: 'OK', onPress: () => router.push("/jobSearch") }
            ]);
        } catch (error) {
            Alert.alert('Error', `Failed to create profile: ${error.message}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/jobSearch")}>
                        <Ionicons name="arrow-back" size={26} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Your Profile</Text>
                    <View style={{ width: 26 }} />
                </View>

                <View style={styles.formContainer}>
                    <TextInput placeholder="Full Name" style={styles.input} onChangeText={text => handleInputChange('fullName', text)} />
                    <TextInput placeholder="Main Skill (e.g., Senior Plumber)" style={styles.input} onChangeText={text => handleInputChange('skill', text)} />
                    <TextInput placeholder="Years of Experience (e.g., 5+ Years)" style={styles.input} onChangeText={text => handleInputChange('experience', text)} />
                    <TextInput placeholder="Your Location (e.g., Mandalay)" style={styles.input} onChangeText={text => handleInputChange('location', text)} />
                    <View style={styles.row}>
                        <TextInput placeholder="Latitude" style={[styles.input, styles.halfInput]} keyboardType="numeric" onChangeText={text => handleInputChange('lat', text)} />
                        <TextInput placeholder="Longitude" style={[styles.input, styles.halfInput]} keyboardType="numeric" onChangeText={text => handleInputChange('lng', text)} />
                    </View>
                    <TextInput placeholder="Contact Info (Public Phone)" style={styles.input} onChangeText={text => handleInputChange('contactInfo', text)} />
                    <TextInput
                        placeholder="Short Bio (Introduce yourself and your skills)"
                        style={[styles.input, styles.textArea]}
                        multiline
                        numberOfLines={5}
                        onChangeText={text => handleInputChange('bio', text)}
                    />

                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
                        <Text style={styles.imagePickerText}>{image ? 'Profile Photo Selected' : 'Upload Profile Photo'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Create Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateSeekerProfileScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
    formContainer: { padding: 16 },
    input: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
    textArea: { height: 120, textAlignVertical: 'top' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfInput: { flex: 1, marginHorizontal: 4 },
    imagePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 10, justifyContent: 'center', marginBottom: 20 },
    imagePickerText: { marginLeft: 10, color: COLORS.primary, fontWeight: '600' },
    submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 10, alignItems: 'center' },
    submitButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});
