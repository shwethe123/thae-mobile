// assets/styles/post-detail.styles.js

import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const postDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContentContainer: {
    paddingBottom: 80, // Make space for the reply input box
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  // Reply Card Styles
  replyCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  replyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  replyContent: {
    flex: 1,
    backgroundColor: `${COLORS.primary}10`, // primary with 10% opacity
    borderRadius: 12,
    padding: 12,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  replyTimestamp: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  replyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  // Reply Input Box Styles
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});