// app/jobs/[id].jsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { jobDetailStyles as styles } from '../../assets/styles/job-detail.styles';
import { COLORS } from '../../constants/colors';

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Pending': return { backgroundColor: '#FFC107' };
      case 'In Progress': return { backgroundColor: COLORS.primary };
      case 'Completed': return { backgroundColor: '#4CAF50' };
      default: return { backgroundColor: COLORS.textLight };
    }
  };
  return (<View style={[styles.statusBadge, getStatusStyle()]}><Text style={styles.statusText}>{status}</Text></View>);
};


const JobDetailPage = () => {
  const params = useLocalSearchParams();
  
  let job = null;
  if (params.jobData) {
      try {
          job = JSON.parse(params.jobData);
      } catch (e) {
          console.error("Failed to parse job data:", e);
      }
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text>Job data could not be loaded.</Text>
      </SafeAreaView>
    );
  }


  const handleAction = () => {
      let action = '';
      if (job.status === 'Pending') action = 'Start this job';
      if (job.status === 'In Progress') action = 'Complete this job';

      Alert.alert('Confirm Action', `Are you sure you want to ${action}?`, [{ text: 'Cancel', style: 'cancel' },{ text: 'Confirm', onPress: () => console.log(`${action} confirmed.`) }]);
  }

  const renderActionButton = () => {
    if (job.status === 'Pending') {
      return (<TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={handleAction}><Ionicons name="play-circle-outline" size={22} color={COLORS.white} /><Text style={styles.actionButtonText}>Start Job</Text></TouchableOpacity>);
    }
    if (job.status === 'In Progress') {
      return (<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]} onPress={handleAction}><Ionicons name="checkmark-done-circle-outline" size={22} color={COLORS.white} /><Text style={styles.actionButtonText}>Complete Job</Text></TouchableOpacity>);
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Job Details' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{job.title}</Text>
          <View style={styles.detailItem}><Ionicons name="business-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} /><View><Text style={styles.detailLabel}>Shop</Text><Text style={styles.detailText}>{job.shopName}</Text></View></View>
          <View style={styles.detailItem}><Ionicons name="location-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} /><View><Text style={styles.detailLabel}>Address</Text><Text style={styles.detailText}>{job.address}</Text></View></View>
          <View style={styles.detailItem}><Ionicons name="time-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} /><View><Text style={styles.detailLabel}>Time</Text><Text style={styles.detailText}>{job.time}</Text></View></View>
          <View style={[styles.detailItem, styles.lastDetailItem]}><Ionicons name="flag-outline" style={styles.detailIcon} size={20} color={COLORS.textLight} /><View><Text style={styles.detailLabel}>Status</Text><StatusBadge status={job.status} /></View></View>
        </View>
      </ScrollView>

      <View style={styles.actionButtonContainer}>
        {renderActionButton()}
      </View>
    </SafeAreaView>
  );
};

export default JobDetailPage;