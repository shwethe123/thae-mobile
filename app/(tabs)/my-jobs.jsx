import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { homeStyles as styles } from '../../assets/styles/home.styles';
import { COLORS } from '../../constants/colors';
import { getDummyJobs, shops } from '../../constants/dummyData';

// JobCard component (same as before)
const JobCard = ({ job }) => {
  const getStatusContainerStyle = (status) => {
    switch (status) {
      case 'Pending':
        return styles.statusPending;
      case 'In Progress':
        return styles.statusInProgress;
      case 'Completed':
        return styles.statusCompleted;
      default:
        return {};
    }
  };

  const getStatusTextStyle = (status) => {
    switch (status) {
      case 'Pending':
        return styles.statusTextPending;
      case 'In Progress':
        return styles.statusTextInProgress;
      case 'Completed':
        return styles.statusTextCompleted;
      default:
        return {};
    }
  };

  const getIconForStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'hourglass-outline';
      case 'In Progress':
        return 'build-outline';
      case 'Completed':
        return 'checkmark-done-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  return (
    <TouchableOpacity style={styles.jobCard}>
      <View style={styles.jobCardIcon}>
        <Ionicons
          name={getIconForStatus(job.status)}
          size={24}
          color={COLORS.primary}
        />
      </View>
      <View style={styles.jobCardContent}>
        <Text style={styles.jobTitle} numberOfLines={2}>
          {job.title}
        </Text>
        <View style={styles.jobMeta}>
          <Ionicons name="location-outline" size={14} color={COLORS.textLight} />
          <Text style={styles.jobMetaText}>{job.address}</Text>
        </View>
        <View style={styles.jobMeta}>
          <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
          <Text style={styles.jobMetaText}>{job.time}</Text>
        </View>
        <View style={[styles.jobStatus, getStatusContainerStyle(job.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(job.status)]}>
            {job.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MyJobs = () => {
  const { user } = useAuth();
  const [selectedShop, setSelectedShop] = useState('All');
  const [job, setJob] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      const data = await getDummyJobs();
      setJob(data);
    }
    loadJobs();
  }, [])

  // Make sure shops and dummyJobs are arrays before using .map()
  const shopsSafe = Array.isArray(shops) ? shops : [];
  const jobsSafe = Array.isArray(job) ? job : [];

  const filteredJobs = useMemo(() => {
    if (selectedShop === 'All') {
      return jobsSafe;
    }
    return jobsSafe.filter((job) => job.shop_name === selectedShop);
  }, [selectedShop, jobsSafe]);

  const pendingJobs = filteredJobs.filter((job) => job.status !== 'Completed')
    .length;
  const completedJobs = filteredJobs.filter((job) => job.status === 'Completed')
    .length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <View>
          <Text style={styles.headerTitle}>Welcome Back,</Text>
          <Text style={[styles.headerTitle, styles.userName]}>
            {user?.firstName || 'Worker'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Shop Filter Bar */}
      <View style={styles.shopFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shopFilterScrollView}
        >
          <TouchableOpacity
            style={[
              styles.shopFilterButton,
              selectedShop === 'All' && styles.selectedShopFilter,
            ]}
            onPress={() => setSelectedShop('All')}
          >
            <Text
              style={[
                styles.shopFilterText,
                selectedShop === 'All' && styles.selectedShopFilterText,
              ]}
            >
              All Shops
            </Text>
          </TouchableOpacity>

          {shopsSafe.map((shop) => (
            <TouchableOpacity
              key={shop.id}
              style={[
                styles.shopFilterButton,
                selectedShop === shop.name && styles.selectedShopFilter,
              ]}
              onPress={() => setSelectedShop(shop.name)}
            >
              <Text
                style={[
                  styles.shopFilterText,
                  selectedShop === shop.name && styles.selectedShopFilterText,
                ]}
              >
                {shop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{filteredJobs.length}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{pendingJobs}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedJobs}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Job List */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            {selectedShop === 'All'
              ? "All Today's Jobs"
              : `Jobs for ${selectedShop}`}
          </Text>
        </View>

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <Text
            style={{ textAlign: 'center', color: COLORS.textLight, marginTop: 20 }}
          >
            No jobs found for this branch.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyJobs;
