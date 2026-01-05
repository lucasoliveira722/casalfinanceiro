import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Dados fictícios para visualizar a interface
const MOCK_DATA = {
  user1Name: "Eu",
  user2Name: "Ela",
  totalUser1: 1350.5,
  totalUser2: 980.0,
  // Resultado do cálculo (Ex: User 1 pagou mais, mas a divisão justa diria outra coisa)
  // Positivo: Eu recebo / Negativo: Eu devo
  netBalance: -185.25,
};

const RECENT_EXPENSES = [
  {
    id: "1",
    desc: "Mercado Semanal",
    amount: 450.0,
    payer: "Eu",
    date: "04/01",
  },
  { id: "2", desc: "Conta de Luz", amount: 120.0, payer: "Ela", date: "03/01" },
  { id: "3", desc: "Jantar Ifood", amount: 85.9, payer: "Eu", date: "02/01" },
];

export default function DashboardScreen() {
  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1. Card de Resumo (O Acerto de Contas) */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Resumo de Janeiro</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Você pagou</Text>
            <Text style={styles.value}>
              {formatCurrency(MOCK_DATA.totalUser1)}
            </Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.column}>
            <Text style={styles.label}>Ela pagou</Text>
            <Text style={styles.value}>
              {formatCurrency(MOCK_DATA.totalUser2)}
            </Text>
          </View>
        </View>

        <View style={styles.dividerHorizontal} />

        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Acerto final:</Text>
          {MOCK_DATA.netBalance < 0 ? (
            <Text style={[styles.resultValue, { color: "#e74c3c" }]}>
              Você deve {formatCurrency(Math.abs(MOCK_DATA.netBalance))}
            </Text>
          ) : (
            <Text style={[styles.resultValue, { color: "#27ae60" }]}>
              Você recebe {formatCurrency(MOCK_DATA.netBalance)}
            </Text>
          )}
        </View>
      </View>

      {/* 2. Lista de Gastos Recentes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Últimos lançamentos</Text>
        {/* Link rápido para ir para a tela de adicionar */}
        <Link href="/add" style={styles.linkText}>
          + Novo
        </Link>
      </View>

      {/* Renderização simples da lista */}
      {RECENT_EXPENSES.map((item) => (
        <View key={item.id} style={styles.expenseItem}>
          <View>
            <Text style={styles.expenseDesc}>{item.desc}</Text>
            <Text style={styles.expenseDate}>
              {item.date} • Pago por {item.payer}
            </Text>
          </View>
          <Text style={styles.expenseAmount}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f2f2f7", flexGrow: 1 },

  // Estilos do Card
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Sombra no Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 1, alignItems: "center" },
  dividerVertical: { width: 1, backgroundColor: "#eee", marginHorizontal: 10 },
  dividerHorizontal: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  value: { fontSize: 18, fontWeight: "600", color: "#333" },

  resultContainer: { alignItems: "center" },
  resultLabel: { fontSize: 14, color: "#666", marginBottom: 5 },
  resultValue: { fontSize: 22, fontWeight: "bold" },

  // Estilos da Lista
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  linkText: { color: "#007AFF", fontWeight: "600" },

  expenseItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseDesc: { fontSize: 16, fontWeight: "500", color: "#333" },
  expenseDate: { fontSize: 12, color: "#999", marginTop: 3 },
  expenseAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
});
