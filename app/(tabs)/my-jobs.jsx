import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { homeStyles as styles } from '../../assets/styles/home.styles';
import { COLORS } from '../../constants/colors';
import { shops } from '../../constants/dummyData';
import { fetchAllJobs } from '../../lib/jobsApi';

// This enables LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// JobCard component - This is the full implementation.
const JobCard = ({ job }) => {
  const router = useRouter();
  const handlePress = () => router.push({ pathname: `/jobs/${job.id}`, params: { jobData: JSON.stringify(job) } });
  
  const getStatusContainerStyle = (status) => {
    switch (status) {
      case 'Pending': return styles.statusPending;
      case 'In Progress': return styles.statusInProgress;
      case 'Completed': return styles.statusCompleted;
      default: return {};
    }
  };
  const getStatusTextStyle = (status) => {
    switch (status) {
      case 'Pending': return styles.statusTextPending;
      case 'In Progress': return styles.statusTextInProgress;
      case 'Completed': return styles.statusTextCompleted;
      default: return {};
    }
  };
  const getIconForStatus = (status) => {
    switch (status) {
      case 'Pending': return 'hourglass-outline';
      case 'In Progress': return 'build-outline';
      case 'Completed': return 'checkmark-done-outline';
      default: return 'alert-circle-outline';
    }
  };

  return (
    <TouchableOpacity style={styles.jobCard} onPress={handlePress}>
      <View style={styles.jobCardIcon}><Ionicons name={getIconForStatus(job.status)} size={24} color={COLORS.primary} /></View>
      <View style={styles.jobCardContent}>
        <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
        <View style={styles.jobMeta}><Ionicons name="location-outline" size={14} color={COLORS.textLight} /><Text style={styles.jobMetaText}>{job.address}</Text></View>
        <View style={styles.jobMeta}><Ionicons name="time-outline" size={14} color={COLORS.textLight} /><Text style={styles.jobMetaText}>{job.time}</Text></View>
        <View style={[styles.jobStatus, getStatusContainerStyle(job.status)]}><Text style={[styles.statusText, getStatusTextStyle(job.status)]}>{job.status}</Text></View>
      </View>
    </TouchableOpacity>
  );
};


const HomePage = () => {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedShop, setSelectedShop] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['All', 'Pending', 'In Progress', 'Completed'];

  const loadJobs = async (isRefreshing = false) => {
    if (!isRefreshing) setIsLoading(true);
    const data = await fetchAllJobs();
    setAllJobs(data || []);
    if (!isRefreshing) setIsLoading(false);
  };

  useEffect(() => { loadJobs(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await loadJobs(true);
    setRefreshing(false);
  }, []);

  const baseFilteredJobs = useMemo(() => {
    let jobs = Array.isArray(allJobs) ? allJobs : [];
    if (searchQuery) jobs = jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedShop !== 'All') jobs = jobs.filter(j => j.shopName === selectedShop);
    return jobs;
  }, [allJobs, searchQuery, selectedShop]);

  const countMap = useMemo(() => ({
      'All': baseFilteredJobs.length,
      'Pending': baseFilteredJobs.filter(j => j.status === 'Pending').length,
      'In Progress': baseFilteredJobs.filter(j => j.status === 'In Progress').length,
      'Completed': baseFilteredJobs.filter(j => j.status === 'Completed').length,
  }), [baseFilteredJobs]);

  const displayedJobs = useMemo(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedStatus === 'All') return baseFilteredJobs;
    return baseFilteredJobs.filter(j => j.status === selectedStatus);
  }, [baseFilteredJobs, selectedStatus]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingHorizontal: 20 }]}>
          <View><Text style={styles.headerTitle}>Welcome Back,</Text><Text style={[styles.headerTitle, styles.userName]}>{user?.firstName || 'Worker'}</Text></View>
          <TouchableOpacity style={styles.notificationButton}><Ionicons name="notifications-outline" size={24} color={COLORS.text} /></TouchableOpacity>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { paddingHorizontal: 20 }]}>
          <View><Text style={styles.headerTitle}>Welcome Back,</Text><Text style={[styles.headerTitle, styles.userName]}>{user?.firstName || 'Worker'}</Text></View>
          <TouchableOpacity style={styles.notificationButton}><Ionicons name="notifications-outline" size={24} color={COLORS.text} /></TouchableOpacity>
        </View>
        
        <View style={styles.filterCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
            <TextInput style={styles.searchInput} placeholder="Search jobs by title..." value={searchQuery} onChangeText={setSearchQuery} />
          </View>

          <View style={styles.shopFilterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shopFilterScrollView}>
              <TouchableOpacity style={[styles.shopFilterButton, selectedShop === 'All' && styles.selectedShopFilter]} onPress={() => setSelectedShop('All')}>
                <Text style={[styles.shopFilterText, selectedShop === 'All' && styles.selectedShopFilterText]}>All Shops</Text>
              </TouchableOpacity>
              {(shops || []).map(s => (
                <TouchableOpacity key={s.id} style={[styles.shopFilterButton, selectedShop === s.name && styles.selectedShopFilter]} onPress={() => setSelectedShop(s.name)}>
                  <Text style={[styles.shopFilterText, selectedShop === s.name && styles.selectedShopFilterText]}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.statusFilterContainer}>
          {statuses.map(status => (
            <TouchableOpacity key={status} style={[styles.statusFilterButton, selectedStatus === status && styles.selectedStatusFilter]} onPress={() => setSelectedStatus(status)}>
              <Text style={[styles.statusFilterText, selectedStatus === status && styles.selectedStatusFilterText]}>
                {`${status} (${countMap[status]})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, minHeight: 300 }}>
          {displayedJobs.length > 0 ? (
            displayedJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="file-tray-outline" size={64} color={COLORS.textLight} />
              <Text style={styles.emptyStateText}>No jobs found matching your criteria.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;