import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../src/styles/global";

export default function AddExpenseScreen() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [visibility, setVisibility] = useState("SHARED"); // SHARED (Casal) ou PERSONAL (Individual)
  const [expenseType, setExpenseType] = useState("SINGLE"); // SINGLE, INSTALLMENT, RECURRING
  const [endMonthYear, setEndMonthYear] = useState(""); // Ex: 12/2026 (Usado só se for INSTALLMENT)

  const handleSave = () => {
    if (!description || !amount) {
      Alert.alert("Erro", "Preencha a descrição e o valor.");
      return;
    }

    if (expenseType === "INSTALLMENT" && !endMonthYear) {
      Alert.alert("Erro", "Para parcelamentos, informe o mês/ano final.");
      return;
    }

    const expenseData = {
      description,
      amount: parseFloat(amount.replace(",", ".")),
      visibility,
      expenseType,
      // Se não for parcelado, garantimos que a data fim vá nula para o backend
      endMonthYear: expenseType === "INSTALLMENT" ? endMonthYear : null,
    };

    console.log("JSON para o Backend:", JSON.stringify(expenseData, null, 2));
    Alert.alert("Sucesso", "Gasto registrado!");

    // Resetar formulário
    setDescription("");
    setAmount("");
    setEndMonthYear("");
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>Novo Gasto</Text>

      {/* Visibilidade (Requisito 1) */}
      <Text style={globalStyles.label}>De quem é esse gasto?</Text>
      <View style={globalStyles.pickerWrapper}>
        <Picker selectedValue={visibility} onValueChange={setVisibility}>
          <Picker.Item label="Compartilhado (Casal)" value="SHARED" />
          <Picker.Item label="Apenas Meu (Pessoal)" value="PERSONAL" />
        </Picker>
      </View>

      <Text style={globalStyles.label}>Descrição</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Ex: Mercado, Lanche..."
        value={description}
        onChangeText={setDescription}
      />

      <Text style={globalStyles.label}>Valor (R$)</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Tipo de Gasto (Requisito 2) */}
      <Text style={globalStyles.label}>Tipo de Gasto</Text>
      <View style={globalStyles.pickerWrapper}>
        <Picker selectedValue={expenseType} onValueChange={setExpenseType}>
          <Picker.Item label="Único (Ex: Mercado)" value="SINGLE" />
          <Picker.Item label="Parcelamento" value="INSTALLMENT" />
          <Picker.Item
            label="Permanente (Ex: Luz, Internet)"
            value="RECURRING"
          />
        </Picker>
      </View>

      {/* Renderização Condicional: Só aparece se for Parcelamento */}
      {expenseType === "INSTALLMENT" && (
        <View>
          <Text style={globalStyles.label}>Mês/Ano Final (Ex: 12/2026)</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="MM/AAAA"
            keyboardType="numeric"
            maxLength={7}
            value={endMonthYear}
            onChangeText={setEndMonthYear}
          />
        </View>
      )}

      {/* Exemplo prático de uso do TouchableOpacity para botão customizado */}
      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleSave}>
        <Text style={globalStyles.buttonPrimaryText}>Salvar Despesa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
