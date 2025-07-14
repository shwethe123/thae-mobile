// assets/styles/profile.styles.js
import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  // Profile Header
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  // Actions Section
  actionSection: {
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    marginLeft: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E63946',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#E63946',
    fontWeight: '600',
  },
});