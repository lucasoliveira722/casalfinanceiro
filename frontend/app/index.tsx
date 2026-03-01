import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../src/styles/global";

// Dados fictícios simulando o retorno do nosso futuro backend Java
const MOCK_EXPENSES = [
  {
    id: "1",
    desc: "Mercado Mensal",
    amount: 850.0,
    visibility: "SHARED",
    type: "SINGLE",
    date: "05/03/2026",
  },
  {
    id: "2",
    desc: "Conta de Internet",
    amount: 120.0,
    visibility: "SHARED",
    type: "RECURRING",
    date: "10/03/2026",
  },
  {
    id: "3",
    desc: "Tênis de Corrida",
    amount: 350.0,
    visibility: "PERSONAL",
    type: "INSTALLMENT",
    date: "12/03/2026",
    installments: "3/6",
  },
  {
    id: "4",
    desc: "Ifood (Lanche)",
    amount: 45.9,
    visibility: "PERSONAL",
    type: "SINGLE",
    date: "15/03/2026",
  },
];

export default function DashboardScreen() {
  // Estado para controlar qual aba está ativa ('SHARED' ou 'PERSONAL')
  const [activeTab, setActiveTab] = useState("SHARED");

  // Filtra os gastos baseados na aba selecionada
  const filteredExpenses = MOCK_EXPENSES.filter(
    (exp) => exp.visibility === activeTab,
  );

  // Calcula o total da aba atual
  const totalAmount = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Renderiza cada item da lista (boa prática extrair para uma função)
  const renderExpenseItem = ({ item }: { item: any }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDesc}>{item.desc}</Text>
        <Text style={styles.expenseMeta}>
          {item.date} •{" "}
          {item.type === "RECURRING"
            ? "Permanente"
            : item.type === "INSTALLMENT"
              ? `Parcela (${item.installments})`
              : "Único"}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Visão Geral</Text>

      {/* Controle de Abas (Toggle) usando TouchableOpacity */}
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
      </View>

      {/* Card de Resumo Financeiro */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>
          Total {activeTab === "SHARED" ? "do Casal" : "Pessoal"} este mês
        </Text>
        <Text style={styles.summaryTotal}>{formatCurrency(totalAmount)}</Text>
      </View>

      {/* Lista de Gastos usando FlatList (Melhor performance que ScrollView para listas) */}
      <Text style={styles.listTitle}>Lançamentos</Text>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum gasto registrado.</Text>
        }
      />
    </View>
  );
}

// Estilos específicos desta tela (os gerais vêm do globalStyles)
const styles = StyleSheet.create({
  // Estilo do Toggle (Abas)
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
  tabText: { fontWeight: "600", color: "#666" },
  activeTabText: { color: "#000" },

  // Estilo do Card de Resumo
  summaryCard: {
    backgroundColor: "#007AFF", // Azul padrão do app
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  summaryTotal: { color: "white", fontSize: 32, fontWeight: "bold" },

  // Estilos da Lista
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
  expenseAmount: { fontSize: 16, fontWeight: "bold", color: "#e74c3c" }, // Vermelho para saída de dinheiro
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});
