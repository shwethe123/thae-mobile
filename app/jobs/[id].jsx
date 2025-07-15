// app/jobs/[id].jsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { jobDetailStyles as styles } from '../../assets/styles/job-detail.styles';
import { COLORS } from '../../constants/colors';
import { updateJobStatus } from '../../lib/jobsApi';

// Helper component for status badges with full implementation
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#FFC107' };
      case 'In Progress':
        return { backgroundColor: COLORS.primary };
      case 'Completed':
        return { backgroundColor: '#4CAF50' };
      default:
        return { backgroundColor: COLORS.textLight };
    }
  };
  return (
    <View style={[styles.statusBadge, getStatusStyle()]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const JobDetailPage = () => {
  const params = useLocalSearchParams();

  const [job, setJob] = useState(() => {
    try {
      if (params.jobData) {
        return JSON.parse(params.jobData);
      }
      return null;
    } catch (e) {
      console.error("Failed to parse job data:", e);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error' }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Job data could not be loaded.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAction = async () => {
    let newStatus = '';
    if (job.status === 'Pending') newStatus = 'In Progress';
    if (job.status === 'In Progress') newStatus = 'Completed';
    if (!newStatus) return;

    Alert.alert('Confirm Action', `Are you sure you want to mark this job as "${newStatus}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setIsLoading(true);
          try {
            await updateJobStatus(job.id, newStatus);
            setJob({ ...job, status: newStatus });
            Alert.alert('Success', 'Job status has been updated.');
          } catch (error) {
            Alert.alert('Error', `Failed to update job: ${error.message}`);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const renderActionButton = () => {
    if (job.status === 'Completed') return null;
    
    const isPending = job.status === 'Pending';
    const buttonText = isPending ? 'Start Job' : 'Complete Job';
    const buttonIcon = isPending ? 'play-circle-outline' : 'checkmark-done-circle-outline';
    const buttonColor = isPending ? COLORS.primary : '#4CAF50';

    return (
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: buttonColor, opacity: isLoading ? 0.7 : 1 }]} onPress={handleAction} disabled={isLoading}>
        {isLoading ? (<ActivityIndicator color={COLORS.white} />) : (<><Ionicons name={buttonIcon} size={22} color={COLORS.white} /><Text style={styles.actionButtonText}>{buttonText}</Text></>)}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Job Details' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{job.title}</Text>
          
          <View style={styles.detailItem}>
              <Ionicons name="business-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} />
              <View><Text style={styles.detailLabel}>Shop</Text><Text style={styles.detailText}>{job.shopName}</Text></View>
          </View>
          <View style={styles.detailItem}>
              <Ionicons name="location-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} />
              <View><Text style={styles.detailLabel}>Address</Text><Text style={styles.detailText}>{job.address}</Text></View>
          </View>
          <View style={styles.detailItem}>
              <Ionicons name="time-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} />
              <View><Text style={styles.detailLabel}>Time</Text><Text style={styles.detailText}>{job.time}</Text></View>
          </View>

          <View style={[styles.detailItem, styles.lastDetailItem]}>
              <Ionicons name="flag-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} />
              <View><Text style={styles.detailLabel}>Status</Text><StatusBadge status={job.status} /></View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtonContainer}>
        {renderActionButton()}
      </View>
    </SafeAreaView>
  );
};

export default JobDetailPage;