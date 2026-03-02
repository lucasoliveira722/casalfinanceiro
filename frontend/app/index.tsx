import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../src/styles/global";

const BACKEND_URL = "http://192.168.0.52:9095/api/expenses";

export default function DashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("SHARED");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Passa o mês e o ano atuais para a query inteligente do Java
      const response = await fetch(
        `${BACKEND_URL}?year=${year}&month=${month}`,
      );
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

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, []),
  );

  // Função auxiliar essencial: Retorna a Parcela se for INSTALLMENT, ou o Valor se for Único/Recorrente
  const getEffectiveAmount = (item: any) => {
    return item.expenseType === "INSTALLMENT" && item.installmentAmount
      ? item.installmentAmount
      : item.amount;
  };

  const filteredExpenses =
    activeTab === "TOTAL"
      ? expenses
      : expenses.filter((exp) => exp.visibility === activeTab);

  // Calcula os totais com base no valor efetivo (da parcela)
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
    totalAmount = filteredExpenses.reduce(
      (sum, item) => sum + getEffectiveAmount(item),
      0,
    );
  }

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
        {activeTab === "TOTAL" && (
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
        )}
      </View>
      <View style={styles.actionContainer}>
        {/* Mostra o valor que será debitado no mês atual */}
        <Text style={styles.expenseAmount}>
          {formatCurrency(getEffectiveAmount(item))}
        </Text>

        {/* Se for parcelado, mostra discretamente o valor total da compra */}
        {item.expenseType === "INSTALLMENT" && (
          <Text style={styles.totalValueHint}>
            Total: {formatCurrency(item.amount)}
          </Text>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.editButton}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleDelete = (id: string) => {
    Alert.alert("Atenção", "Tem certeza que deseja excluir este gasto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${BACKEND_URL}/${id}`, {
              method: "DELETE",
            });
            if (response.ok) {
              fetchExpenses();
            } else {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          } catch (error) {
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

  const getSummaryLabel = () => {
    if (activeTab === "SHARED") return "Total do Casal";
    if (activeTab === "PERSONAL") return "Seu Total Pessoal";
    return "Seu Custo Real Mensal (100% Pessoal + 50% Casal)";
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Visão Geral</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "SHARED" && styles.activeTab]}
          onPress={() => setActiveTab("SHARED")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "SHARED" && styles.activeTabText,
            ]}
          >
            Casal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "PERSONAL" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("PERSONAL")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "PERSONAL" && styles.activeTabText,
            ]}
          >
            Meus Gastos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "TOTAL" && styles.activeTab]}
          onPress={() => setActiveTab("TOTAL")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "TOTAL" && styles.activeTabText,
            ]}
          >
            Total
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{getSummaryLabel()}</Text>
        <Text style={styles.summaryTotal}>{formatCurrency(totalAmount)}</Text>
      </View>

      <Text style={styles.listTitle}>Lançamentos</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum gasto registrado no mês atual.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e5ea",
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontWeight: "600", color: "#666", fontSize: 13 },
  activeTabText: { color: "#000" },
  summaryCard: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 5,
    textAlign: "center",
  },
  summaryTotal: { color: "white", fontSize: 32, fontWeight: "bold" },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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

  // Novo estilo para o valor total
  totalValueHint: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
    textAlign: "right",
  },

  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
  actionContainer: { alignItems: "flex-end" },
  buttonRow: { flexDirection: "row", marginTop: 8, gap: 15 },
  editButton: { color: "#007AFF", fontWeight: "600", fontSize: 14 },
  deleteButton: { color: "#e74c3c", fontWeight: "600", fontSize: 14 },
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
});
