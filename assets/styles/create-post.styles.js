// assets/styles/create-post.styles.js
import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const createPostStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.border,
  },
  name: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: COLORS.text,
    textAlignVertical: 'top', // Ensures text starts from the top on Android
    paddingTop: 0,
    lineHeight: 26,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: -16, // Extend to full width
  },
  actionButton: {
    padding: 8,
  },
});