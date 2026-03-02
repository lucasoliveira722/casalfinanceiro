import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";

type TabConfig = {
  name: string;
  label: string;
  icon: string;
  iconOutline: string;
};

const TAB_CONFIG: TabConfig[] = [
  { name: "index", label: "Início", icon: "home", iconOutline: "home-outline" },
  { name: "add", label: "Adicionar", icon: "add", iconOutline: "add" },
  { name: "settings", label: "Ajustes", icon: "person", iconOutline: "person-outline" },
];

export function LiquidGlassTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset + 16 }]} pointerEvents="box-none">
      <View style={styles.container}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
        )}

        <View style={styles.topHighlight} />

        <View style={styles.tabs}>
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG.find((t) => t.name === route.name);
            if (!config) return null;

            const isActive = state.index === index;
            const isAdd = route.name === "add";

            const onPress = () => {
              if (isAdd) {
                router.push("/add");
              } else {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={onPress}
                activeOpacity={0.75}
              >
                {isAdd ? (
                  <View style={styles.addButton}>
                    <View style={styles.addButtonGlow} />
                    <Ionicons name="add" size={26} color={Colors.text} />
                  </View>
                ) : (
                  <>
                    <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                      <Ionicons
                        name={(isActive ? config.icon : config.iconOutline) as any}
                        size={22}
                        color={isActive ? Colors.tabActive : Colors.tabInactive}
                      />
                    </View>
                    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                      {config.label}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "stretch",
  },
  container: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glassBorderStrong,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 16,
  },
  androidBg: {
    backgroundColor: Colors.tabBg,
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.glassHighlight,
    zIndex: 10,
  },
  tabs: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 3,
  },
  iconWrapper: {
    width: 42,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.tabInactive,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.tabActive,
    fontWeight: "600",
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 10,
    marginVertical: -4,
  },
  addButtonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
});
