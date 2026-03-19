import { Ionicons } from "@expo/vector-icons";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../src/styles/global";
import { getExpenses } from "../src/services/expenseService";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function HistoryScreen() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [selectedYear, selectedMonth]);

  const checkAuthAndFetchData = async () => {
    try {
      await getCurrentUser();
      await fetchExpenses();
    } catch (error) {
      router.replace("/login");
    }
  };

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await getExpenses(selectedYear, selectedMonth);
      setExpenses(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os gastos.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR");
  };

  const getEffectiveAmount = (item: any) => {
    return item.expenseType === "INSTALLMENT" && item.installmentAmount
      ? item.installmentAmount
      : item.amount;
  };

  const renderExpenseItem = ({ item }: { item: any }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDesc}>{item.description}</Text>
        <Text style={styles.expenseMeta}>
          {formatDate(item.createdAt)} •{" "}
          {item.expenseType === "RECURRING"
            ? "Permanente"
            : item.expenseType === "INSTALLMENT"
              ? `Parcelado (${item.installments}x)`
              : "Único"}
        </Text>
        <Text
          style={[
            styles.badge,
            item.visibility === "SHARED"
              ? styles.badgeShared
              : styles.badgePersonal,
          ]}
        >
          {item.visibility === "SHARED" ? "Casal" : "Pessoal"}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.expenseAmount}>
          {formatCurrency(getEffectiveAmount(item))}
        </Text>
      </View>
    </View>
  );

  const totalMonth = expenses.reduce((sum, item) => {
    const amount = getEffectiveAmount(item);
    if (item.visibility === "SHARED") {
      return sum + amount / 2;
    }
    return sum + amount;
  }, 0);

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[globalStyles.title, { marginBottom: 0, color: "#333" }]}>Histórico</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.yearSelector}>
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.yearText}>{selectedYear}</Text>
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}>
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 50, marginBottom: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
        >
          {MONTHS.map((month, index) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthButton,
                selectedMonth === index + 1 && styles.activeMonthButton,
              ]}
              onPress={() => setSelectedMonth(index + 1)}
            >
              <Text
                style={[
                  styles.monthText,
                  selectedMonth === index + 1 && styles.activeMonthText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Custo Real (Pessoal + 50% Casal)</Text>
        <Text style={styles.summaryTotal}>{formatCurrency(totalMonth)}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum gasto encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#e3f2fd",
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 15,
  },
  yearText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  monthButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e5ea",
    marginRight: 10,
    height: 36,
    justifyContent: "center",
  },
  activeMonthButton: {
    backgroundColor: "#007AFF",
  },
  monthText: {
    color: "#666",
    fontWeight: "600",
  },
  activeMonthText: {
    color: "white",
  },
  summaryCard: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  summaryTotal: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  expenseCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  expenseInfo: { flex: 1 },
  expenseDesc: { fontSize: 16, fontWeight: "600", color: "#333" },
  expenseMeta: { fontSize: 12, color: "#888", marginTop: 4 },
  expenseAmount: { fontSize: 16, fontWeight: "bold", color: "#e74c3c" },
  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
    overflow: "hidden",
  },
  badgeShared: { backgroundColor: "#e1bee7", color: "#6a1b9a" },
  badgePersonal: { backgroundColor: "#b3e5fc", color: "#0277bd" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
  actionContainer: { alignItems: "flex-end" },
});
