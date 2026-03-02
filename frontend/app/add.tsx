import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/theme";

const BACKEND_URL = "http://192.168.0.52:9095/api/expenses";

export default function AddExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [visibility, setVisibility] = useState("SHARED");
  const [expenseType, setExpenseType] = useState("SINGLE");
  const [installments, setInstallments] = useState("");

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
      Alert.alert("Campos obrigatórios", "Preencha a descrição e o valor.");
      return;
    }
    if (expenseType === "INSTALLMENT" && !installments) {
      Alert.alert("Parcelas necessárias", "Informe a quantidade de parcelas.");
      return;
    }

    const expenseData = {
      description,
      amount: parseFloat(amount.replace(",", ".")),
      visibility,
      expenseType,
      installments: expenseType === "INSTALLMENT" ? parseInt(installments, 10) : null,
    };

    try {
      const url = isEditing ? `${BACKEND_URL}/${params.id}` : BACKEND_URL;
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        Alert.alert("Sucesso", isEditing ? "Gasto atualizado!" : "Gasto registrado!");
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
    } catch {
      Alert.alert("Erro de Rede", "Não foi possível conectar à API.");
    }
  };

  const visibilityOptions = [
    { value: "SHARED", label: "Compartilhado (Casal)" },
    { value: "PERSONAL", label: "Apenas Meu (Pessoal)" },
  ];

  const typeOptions = [
    { value: "SINGLE", label: "Único (Ex: Mercado)" },
    { value: "INSTALLMENT", label: "Parcelamento" },
    { value: "RECURRING", label: "Permanente (Ex: Luz, Internet)" },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            {isEditing && (
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={20} color={Colors.textSub} />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{isEditing ? "Editar Gasto" : "Novo Gasto"}</Text>
          </View>

          {/* Visibility */}
          <Text style={styles.label}>Visibilidade</Text>
          <View style={styles.pickerCard}>
            <Picker
              selectedValue={visibility}
              onValueChange={setVisibility}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor={Colors.textSub}
            >
              {visibilityOptions.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  color={Platform.OS === "android" ? Colors.text : undefined}
                />
              ))}
            </Picker>
          </View>

          {/* Description */}
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Mercado, Lanche..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />

          {/* Amount */}
          <Text style={styles.label}>Valor Total (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Expense Type */}
          <Text style={styles.label}>Tipo de Gasto</Text>
          <View style={styles.pickerCard}>
            <Picker
              selectedValue={expenseType}
              onValueChange={setExpenseType}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor={Colors.textSub}
            >
              {typeOptions.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  color={Platform.OS === "android" ? Colors.text : undefined}
                />
              ))}
            </Picker>
          </View>

          {/* Installments */}
          {expenseType === "INSTALLMENT" && (
            <>
              <Text style={styles.label}>Número de Parcelas</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 12"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={3}
                value={installments}
                onChangeText={setInstallments}
              />
            </>
          )}

          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <View style={styles.saveBtnGlow} />
            <Ionicons
              name={isEditing ? "checkmark-circle-outline" : "add-circle-outline"}
              size={20}
              color={Colors.text}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.saveBtnText}>
              {isEditing ? "Atualizar Despesa" : "Salvar Despesa"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 130,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSub,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  pickerCard: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 14,
    overflow: "hidden",
  },
  picker: {
    color: Colors.text,
    backgroundColor: "transparent",
  },
  pickerItem: {
    color: Colors.text,
    backgroundColor: Colors.bgSecondary,
    fontSize: 16,
  },

  saveBtn: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },
  saveBtnGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: 0.3,
  },
});
