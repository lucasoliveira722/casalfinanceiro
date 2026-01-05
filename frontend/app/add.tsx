import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddExpenseScreen() {
  // Estados do formulário
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("user1"); // user1 (Eu) ou user2 (Esposa)
  const [splitType, setSplitType] = useState("equal"); // equal, proportional, custom
  const [category, setCategory] = useState("daily"); // daily, recurrent

  const handleSave = () => {
    // Validação simples
    if (!description || !amount) {
      Alert.alert("Erro", "Preencha a descrição e o valor");
      return;
    }

    // Objeto pronto para enviar ao Backend
    const expenseData = {
      description,
      amount: parseFloat(amount.replace(",", ".")),
      payer,
      splitType,
      category,
      date: new Date().toISOString(),
    };

    console.log("JSON Gerado:", JSON.stringify(expenseData, null, 2));
    Alert.alert(
      "Sucesso",
      "Gasto registrado! (Verifique o console do terminal)"
    );

    // Limpar formulário
    setDescription("");
    setAmount("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Novo Gasto</Text>

      {/* 1. Descrição */}
      <Text style={styles.label}>O que foi comprado?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Mercado, Luz, Jantar"
        value={description}
        onChangeText={setDescription}
      />

      {/* 2. Valor */}
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* 3. Quem pagou? */}
      <Text style={styles.label}>Quem pagou?</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={payer}
          onValueChange={(itemValue) => setPayer(itemValue)}
        >
          <Picker.Item label="Eu (User 1)" value="user1" />
          <Picker.Item label="Ela (User 2)" value="user2" />
        </Picker>
      </View>

      {/* 4. Tipo de Divisão */}
      <Text style={styles.label}>Como dividir?</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={splitType}
          onValueChange={(itemValue) => setSplitType(itemValue)}
        >
          <Picker.Item label="Meio a Meio (50/50)" value="equal" />
          <Picker.Item label="Proporcional ao Salário" value="proportional" />
          <Picker.Item label="Personalizado" value="custom" />
        </Picker>
      </View>

      {/* 5. Categoria */}
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.catButton,
            category === "daily" && styles.catButtonActive,
          ]}
          onPress={() => setCategory("daily")}
        >
          <Text
            style={[
              styles.catText,
              category === "daily" && styles.catTextActive,
            ]}
          >
            Dia a dia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.catButton,
            category === "recurrent" && styles.catButtonActive,
          ]}
          onPress={() => setCategory("recurrent")}
        >
          <Text
            style={[
              styles.catText,
              category === "recurrent" && styles.catTextActive,
            ]}
          >
            Recorrente
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Salvar Despesa" onPress={handleSave} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f2f2f7", flexGrow: 1 },
  headerTitle: {
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
    textTransform: "uppercase",
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
  row: { flexDirection: "row", gap: 10 },
  catButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  catButtonActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  catText: { color: "#007AFF", fontWeight: "600" },
  catTextActive: { color: "white" },
});
