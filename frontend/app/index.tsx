import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/theme";

const BACKEND_URL = "http://192.168.0.52:9095/api/expenses";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function DashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("SHARED");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const currentYear = now.getFullYear();

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const response = await fetch(`${BACKEND_URL}?year=${year}&month=${month}`);
      if (!response.ok) throw new Error("Falha ao buscar dados");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os gastos.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchExpenses(); }, []));

  const getEffectiveAmount = (item: any) => {
    return item.expenseType === "INSTALLMENT" && item.installmentAmount
      ? item.installmentAmount
      : item.amount;
  };

  const filteredExpenses =
    activeTab === "TOTAL"
      ? expenses
      : expenses.filter((exp) => exp.visibility === activeTab);

  let totalAmount = 0;
  if (activeTab === "TOTAL") {
    const personalTotal = expenses
      .filter((e) => e.visibility === "PERSONAL")
      .reduce((sum, item) => sum + getEffectiveAmount(item), 0);
    const sharedTotal = expenses
      .filter((e) => e.visibility === "SHARED")
      .reduce((sum, item) => sum + getEffectiveAmount(item), 0);
    totalAmount = personalTotal + sharedTotal / 2;
  } else {
    totalAmount = filteredExpenses.reduce((sum, item) => sum + getEffectiveAmount(item), 0);
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("pt-BR");
  };

  const getSummaryLabel = () => {
    if (activeTab === "SHARED") return "Total do Casal";
    if (activeTab === "PERSONAL") return "Meus Gastos";
    return "Custo Real Mensal";
  };

  const getTypeIcon = (expenseType: string): any => {
    if (expenseType === "RECURRING") return "repeat";
    if (expenseType === "INSTALLMENT") return "card";
    return "receipt";
  };

  const getTypeLabel = (item: any) => {
    if (item.expenseType === "RECURRING") return "Recorrente";
    if (item.expenseType === "INSTALLMENT") return `${item.installments}x parcelado`;
    return "Único";
  };

  const handleDelete = (id: string) => {
    Alert.alert("Excluir gasto", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
            if (response.ok) fetchExpenses();
            else Alert.alert("Erro", "Não foi possível excluir.");
          } catch {
            Alert.alert("Erro", "Falha na conexão com o servidor.");
          }
        },
      },
    ]);
  };

  const handleEdit = (item: any) => {
    router.push({
      pathname: "/add",
      params: {
        id: item.id,
        description: item.description,
        amount: item.amount.toString(),
        visibility: item.visibility,
        expenseType: item.expenseType,
        installments: item.installments ? item.installments.toString() : "",
      },
    });
  };

  const renderExpenseItem = ({ item }: { item: any }) => (
    <View style={styles.expenseCard}>
      {/* Linha sutil de destaque no topo do card */}
      <View style={styles.cardHighlight} />

      <View style={styles.expenseRow}>
        <View style={styles.expenseIconBg}>
          <Ionicons name={getTypeIcon(item.expenseType)} size={18} color={Colors.primary} />
        </View>

        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDesc} numberOfLines={1}>{item.description}</Text>
          <Text style={styles.expenseMeta}>
            {formatDate(item.createdAt)} · {getTypeLabel(item)}
          </Text>
          {activeTab === "TOTAL" && (
            <View style={[
              styles.badge,
              item.visibility === "SHARED" ? styles.badgeShared : styles.badgePersonal,
            ]}>
              <Text style={[
                styles.badgeText,
                item.visibility === "SHARED" ? styles.badgeSharedText : styles.badgePersonalText,
              ]}>
                {item.visibility === "SHARED" ? "Casal" : "Pessoal"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.expenseRight}>
          <Text style={styles.expenseAmount}>
            − {formatCurrency(getEffectiveAmount(item))}
          </Text>
          {item.expenseType === "INSTALLMENT" && (
            <Text style={styles.expenseTotalHint}>
              Total: {formatCurrency(item.amount)}
            </Text>
          )}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
              <Ionicons name="pencil-outline" size={13} color={Colors.textSub} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={13} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const FILTER_TABS = [
    { key: "SHARED", label: "Casal" },
    { key: "PERSONAL", label: "Pessoal" },
    { key: "TOTAL", label: "Total" },
  ];

  const ListHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Visão Geral</Text>
          <Text style={styles.screenSubtitle}>{currentMonth} · {currentYear}</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchExpenses}>
          <Ionicons name="refresh-outline" size={18} color={Colors.textSub} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryGlow} />
        <View style={styles.summaryCardHighlight} />
        <Text style={styles.summaryLabel}>{getSummaryLabel()}</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(totalAmount)}</Text>
        <Text style={styles.summaryCount}>{filteredExpenses.length} lançamentos este mês</Text>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterPill, activeTab === tab.key && styles.filterPillActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterPillText, activeTab === tab.key && styles.filterPillTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Lançamentos</Text>
    </>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ListHeader />
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 48 }} />
          </View>
        ) : (
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            ListHeaderComponent={<ListHeader />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBg}>
                  <Ionicons name="wallet-outline" size={32} color={Colors.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>Nenhum gasto</Text>
                <Text style={styles.emptySubtitle}>Nenhum lançamento este mês</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safeArea: { flex: 1 },
  loadingWrapper: { flex: 1, paddingHorizontal: 20 },
  listContent: { paddingHorizontal: 20, paddingBottom: 130 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 24,
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 14,
    color: Colors.textSub,
    marginTop: 3,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  summaryGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    top: -110,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    opacity: 0.14,
    borderRadius: 110,
  },
  summaryCardHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.glassHighlight,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textSub,
    textTransform: "uppercase",
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  summaryAmount: {
    fontSize: 42,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -1.5,
  },
  summaryCount: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 10,
  },

  // Filter pills
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  filterPillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSub,
  },
  filterPillTextActive: {
    color: Colors.primary,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Expense card
  expenseCard: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 20,
    marginBottom: 10,
    overflow: "hidden",
  },
  cardHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  expenseIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDesc: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  expenseMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  badge: {
    marginTop: 7,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeShared: {
    backgroundColor: Colors.shared,
    borderColor: Colors.sharedBorder,
  },
  badgePersonal: {
    backgroundColor: Colors.personal,
    borderColor: Colors.personalBorder,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeSharedText: { color: Colors.sharedText },
  badgePersonalText: { color: Colors.personalText },

  // Expense right column
  expenseRight: {
    alignItems: "flex-end",
    marginLeft: 10,
    flexShrink: 0,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.danger,
  },
  expenseTotalHint: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    marginTop: 56,
    gap: 10,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSub,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
