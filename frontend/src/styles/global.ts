import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f7",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1c1c1e",
  },
  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 8,
    color: "#666",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  pickerWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    overflow: "hidden",
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
