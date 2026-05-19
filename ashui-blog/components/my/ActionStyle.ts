import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionItem: {
    flexDirection: "row",
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: "row",

    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
  },
  timestamp: {
    color: "#757575",
    fontSize: 12,
  },
  followAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  likeAction: {
    marginTop: 4,
  },
  commentAction: {
    marginTop: 4,
  },
  replyAction: {
    marginTop: 4,
  },
  createAction: {
    marginTop: 4,
  },
  likeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    color: "#424242",
  },
  highlightText: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  blogInfo: {
    marginTop: 6,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
  },
  blogTitle: {
    color: "#424242",
    fontWeight: "500",
  },
  commentContent: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  commentText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 68,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    color: "#9e9e9e",
    fontSize: 16,
  },
});

export default styles;
