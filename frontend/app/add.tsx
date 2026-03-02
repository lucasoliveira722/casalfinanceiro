import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../src/styles/global";

const BACKEND_URL = "http://192.168.0.52:9095/api/expenses";

export default function AddExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [visibility, setVisibility] = useState("SHARED");
  const [expenseType, setExpenseType] = useState("SINGLE");

  // Novo estado para as parcelas (substituindo o endMonthYear)
  const [installments, setInstallments] = useState("");

  // Populates the form for editing or clears it for adding.
  // This runs only when the `id` parameter changes.
  useEffect(() => {
    if (params.id) {
      setDescription((params.description as string) || "");
      setAmount((params.amount as string) || "");
      setVisibility((params.visibility as string) || "SHARED");
      setExpenseType((params.expenseType as string) || "SINGLE");
      setInstallments((params.installments as string) || "");
    } else {
      setDescription("");
      setAmount("");
      setVisibility("SHARED");
      setExpenseType("SINGLE");
      setInstallments("");
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Erro", "Preencha a descrição e o valor.");
      return;
    }

    if (expenseType === "INSTALLMENT" && !installments) {
      Alert.alert(
        "Erro",
        "Para parcelamentos, informe a quantidade de parcelas.",
      );
      return;
    }

    const expenseData = {
      description,
      amount: parseFloat(amount.replace(",", ".")),
      visibility,
      expenseType,
      // Passa como número inteiro para o Java
      installments:
        expenseType === "INSTALLMENT" ? parseInt(installments, 10) : null,
    };

    try {
      const url = isEditing ? `${BACKEND_URL}/${params.id}` : BACKEND_URL;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        Alert.alert(
          "Sucesso",
          isEditing ? "Gasto atualizado!" : "Gasto registrado!",
        );

        if (isEditing) {
          router.back();
        } else {
          setDescription("");
          setAmount("");
          setInstallments("");
        }
      } else {
        Alert.alert("Erro", "Falha ao salvar no servidor.");
      }
    } catch (error) {
      Alert.alert("Erro de Rede", "Não foi possível conectar à API.");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>
        {isEditing ? "Editar Gasto" : "Novo Gasto"}
      </Text>

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

      <Text style={globalStyles.label}>Valor Total (R$)</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

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

      {/* Input de Parcelas em vez de Data */}
      {expenseType === "INSTALLMENT" && (
        <View>
          <Text style={globalStyles.label}>Quantidade de Parcelas</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Ex: 3"
            keyboardType="numeric"
            maxLength={3}
            value={installments}
            onChangeText={setInstallments}
          />
        </View>
      )}

      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleSave}>
        <Text style={globalStyles.buttonPrimaryText}>
          {isEditing ? "Atualizar Despesa" : "Salvar Despesa"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
