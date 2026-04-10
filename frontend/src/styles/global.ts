import { StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 28,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSub,
    marginTop: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  pickerWrapper: {
    backgroundColor: Colors.glass,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: "hidden",
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPrimaryText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
