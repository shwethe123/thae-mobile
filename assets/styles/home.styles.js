import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },

  userName: {
    color: COLORS.primary,
  },

  notificationButton: {
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },

  sectionTitleContainer: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },

  // Job card styles
  jobCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  jobCardIcon: {
    marginRight: 16,
    backgroundColor: `${COLORS.primary}20`, // 20 = 12% opacity
    padding: 12,
    borderRadius: 50,
  },

  jobCardContent: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },

  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  jobMetaText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 8,
  },

  jobStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },

  statusPending: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFC107',
    borderWidth: 1,
  },

  statusInProgress: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },

  statusCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  statusTextPending: {
    color: '#FFC107',
  },

  statusTextInProgress: {
    color: COLORS.primary,
  },

  statusTextCompleted: {
    color: '#4CAF50',
  },

  shopFilterContainer: {
    paddingVertical: 16,
  },

  shopFilterScrollView: {
    paddingHorizontal: 20,
  },

  shopFilterButton: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },

  selectedShopFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  shopFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  selectedShopFilterText: {
    color: COLORS.white,
  },
    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 12,
    marginLeft: 8,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 16, // Changed from paddingVertical
  },
  statusFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedStatusFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusFilterText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedStatusFilterText: {
    color: COLORS.white,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});
