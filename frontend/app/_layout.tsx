import { LiquidGlassTabBar } from "@/components/liquid-glass-tab-bar";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/theme";

export default function Layout() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Tabs
        tabBar={(props) => <LiquidGlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="add" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
});
