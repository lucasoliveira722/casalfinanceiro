import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";

type SettingsItem = {
  icon: string;
  label: string;
  subtitle: string;
};

const SETTINGS_ITEMS: SettingsItem[] = [
  { icon: "person-circle-outline", label: "Perfil", subtitle: "Gerencie sua conta" },
  { icon: "notifications-outline", label: "Notificações", subtitle: "Alertas e lembretes" },
  { icon: "lock-closed-outline", label: "Privacidade", subtitle: "Segurança do app" },
  { icon: "information-circle-outline", label: "Sobre", subtitle: "Versão 1.0.0" },
];

export default function SettingsScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Ajustes</Text>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileCardHighlight} />
            <View style={styles.profileGlow} />
            <View style={styles.avatar}>
              <Ionicons name="people" size={28} color={Colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Casal Financeiro</Text>
              <Text style={styles.profileSub}>Gestão compartilhada</Text>
            </View>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Ativo</Text>
            </View>
          </View>

          {/* Settings group */}
          <View style={styles.settingsGroup}>
            <View style={styles.settingsGroupHighlight} />
            {SETTINGS_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingsItem,
                  index < SETTINGS_ITEMS.length - 1 && styles.settingsItemDivider,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.settingsIconBg}>
                  <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingsText}>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                  <Text style={styles.settingsSub}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={15} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.version}>Casal Financeiro · v1.0.0</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 130,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 28,
  },

  // Profile card
  profileCard: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  profileCardHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.glassHighlight,
  },
  profileGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    top: -60,
    left: -20,
    backgroundColor: Colors.primary,
    opacity: 0.10,
    borderRadius: 60,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  profileSub: {
    fontSize: 13,
    color: Colors.textSub,
    marginTop: 2,
  },
  profileBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.30)",
  },
  profileBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.success,
  },

  // Settings group
  settingsGroup: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 28,
  },
  settingsGroupHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.glassHighlight,
    zIndex: 1,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  settingsItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  settingsIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingsText: { flex: 1 },
  settingsLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  settingsSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  version: {
    textAlign: "center",
    color: Colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
