import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { addPostReview, incrementPostView } from '../../lib/api'; // Make sure this path is correct

// --- Theme Colors ---
const COLORS = { 
  primary: '#1976D2', 
  background: '#F5F5F5', 
  surface: '#FFFFFF', 
  text: '#212121', 
  textSecondary: '#757575', 
  border: '#E0E0E0',
  white: '#fff',
  danger: '#B00020',
};

// --- Dummy API functions (replace with your real ones from lib/api.js) ---
const API_BASE_URL = 'http://192.168.16.32:5000'; 
const getJobPostById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/job-posts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch details");
    return response.json();
}
const incrementPostView = (id) => fetch(`${API_BASE_URL}/api/job-posts/${id}/view`, { method: 'POST' });
const addPostReview = (id, reviewData) => fetch(`${API_BASE_URL}/api/job-posts/${id}/review`, { 
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(reviewData)
}).then(res => res.ok ? res.json() : Promise.reject('Failed to submit review'));


// --- Reusable Components for this screen ---
const InfoRow = ({icon, text}) => (
    <View style={styles.infoRow}><Ionicons name={icon} size={20} color={COLORS.primary} /><Text style={styles.infoText}>{text}</Text></View>
);
const ReviewCard = ({review}) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewComment}>"{review.comment}"</Text>
      <Text style={styles.reviewer}>- {review.reviewerName || 'Anonymous'}</Text>
    </View>
);

// --- Review Form Component ---
const ReviewForm = ({ visible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleRating = (rate) => setRating(rate);
    
    const handleSubmit = () => {
        if (!comment.trim()) {
            Alert.alert('Empty Comment', 'Please write a comment for your review.');
            return;
        }
        // Get reviewerId and reviewerName from your auth state (e.g., Clerk)
        const reviewData = {
            reviewerId: 'temp_reviewer_id_456', // Replace with actual user ID
            reviewerName: 'Aung Aung', // Replace with actual user name
            rating,
            comment,
        };
        onSubmit(reviewData);
        setComment('');
        setRating(5);
    }

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Write a Review</Text>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                                <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={32} color="#FFC107" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput 
                        placeholder="Share your experience..."
                        style={styles.reviewInput}
                        multiline
                        value={comment}
                        onChangeText={setComment}
                    />
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={onClose} style={[styles.modalButton, styles.cancelButton]}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                         <TouchableOpacity onPress={handleSubmit} style={[styles.modalButton, styles.submitButton]}>
                            <Text style={{color: '#fff', fontWeight: 'bold'}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const JobDetailScreen = () => {
    const { id, type } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);
    
    useEffect(() => {
        const fetchDetailsAndIncrementView = async () => {
            if (!id) {
                Alert.alert("Error", "Post ID is missing.", [{ text: "Go Back", onPress: () => router.back() }]);
                setLoading(false);
                return;
            }

            try {
                // Increment view count in the background (fire-and-forget)
                incrementPostView(id).catch(err => console.warn("View count failed:", err));

                // Fetch the actual post details
                const result = await getJobPostById(id);
                setData(result);
            } catch (error) {
                Alert.alert("Error", error.message || "Could not load post details.", [{ text: "Go Back", onPress: () => router.back() }]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDetailsAndIncrementView();
    }, [id]);

    const handleAddReview = async (reviewData) => {
        try {
            const updatedPost = await addPostReview(id, reviewData);
            setData(updatedPost); // Update the local state with the new post data
            setReviewModalVisible(false);
            Alert.alert('Success', 'Your review has been submitted.');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit your review.');
        }
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }
    
    if (!data) {
        return (
            <View style={styles.centered}>
                <Text>Post could not be found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{marginTop: 10}}><Text style={{color: COLORS.primary}}>Go Back</Text></TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                 <Image source={{ uri: data.image }} style={styles.headerImage} />
                 
                 <View style={styles.content}>
                     {type === 'employer' ? (
                         <>
                            <Text style={styles.title}>{data.jobTitle}</Text>
                            <Text style={styles.subtitle}>{data.companyName}</Text>
                         </>
                     ) : (
                         <>
                            <Text style={styles.title}>{data.fullName}</Text>
                            <Text style={styles.subtitle}>{data.skill}</Text>
                         </>
                     )}

                    <InfoRow icon="location-sharp" text={data.location} />
                    <InfoRow icon="call" text={data.contactInfo} />
                    {data.salaryRange && <InfoRow icon="wallet" text={data.salaryRange} />}
                    {data.experience && <InfoRow icon="time" text={data.experience} />}
                    
                    <Text style={styles.sectionTitle}>{type === 'employer' ? 'Job Description' : 'About Me'}</Text>
                    <Text style={styles.description}>{data.jobDescription || data.bio}</Text>
                    
                    <Text style={styles.sectionTitle}>Location</Text>
                    {data.coordinates?.lat && data.coordinates?.lng ? (
                        <MapView style={styles.map} initialRegion={{ latitude: data.coordinates.lat, longitude: data.coordinates.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
                            <Marker coordinate={{ latitude: data.coordinates.lat, longitude: data.coordinates.lng }} />
                        </MapView>
                    ) : (
                        <Text style={styles.noReviews}>Location data not available.</Text>
                    )}

                    <View style={styles.reviewHeader}>
                        <Text style={styles.sectionTitle}>Reviews & Recommendations</Text>
                        <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
                            <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>Write a Review</Text>
                        </TouchableOpacity>
                    </View>
                    {data.reviews && data.reviews.length > 0 ? (
                        data.reviews.map((review, index) => <ReviewCard key={index} review={review} />)
                    ) : (
                        <Text style={styles.noReviews}>No reviews yet. Be the first to write one!</Text>
                    )}
                 </View>
            </ScrollView>
            <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Now</Text>
            </TouchableOpacity>
            <ReviewForm visible={isReviewModalVisible} onClose={() => setReviewModalVisible(false)} onSubmit={handleAddReview} />
        </SafeAreaView>
    );
};

export default JobDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerImage: { width: '100%', height: 250 },
    content: { padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
    subtitle: { fontSize: 18, color: COLORS.textSecondary, marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { marginLeft: 15, fontSize: 16, color: COLORS.text },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 25, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 5 },
    description: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 },
    map: { width: '100%', height: 200, borderRadius: 12, marginTop: 10 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 5, marginTop: 25, marginBottom: 10 },
    reviewCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 10, marginBottom: 10 },
    reviewComment: { fontStyle: 'italic', fontSize: 15 },
    reviewer: { alignSelf: 'flex-end', marginTop: 5, fontWeight: 'bold' },
    noReviews: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 20 },
    contactButton: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
    contactButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    ratingContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
    reviewInput: { width: '100%', height: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', width: '100%' },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    cancelButton: { backgroundColor: COLORS.border },
    submitButton: { backgroundColor: COLORS.primary },
});