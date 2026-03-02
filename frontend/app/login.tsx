import { confirmSignUp, signIn, signUp } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../src/styles/global";

export default function LoginScreen() {
  const router = useRouter();

  // Modos de tela: 'signIn' (Login), 'signUp' (Cadastro), 'confirm' (Código do Email)
  const [authMode, setAuthMode] = useState<"signIn" | "signUp" | "confirm">(
    "signIn",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [coupleId, setCoupleId] = useState("");
  const [code, setCode] = useState(""); // Código que chega no email

  // Função 1: Fazer Login
  const handleSignIn = async () => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      await signIn({
        username: cleanEmail,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH", // <-- A MÁGICA ESTÁ AQUI. Desliga o SRP problemático.
        },
      });

      router.replace("/");
    } catch (error: any) {
      console.error("ERRO COMPLETO DE LOGIN:", error);
      Alert.alert(
        "Erro no Login",
        error.message || "Verifique suas credenciais.",
      );
    }
  };

  // Função 2: Criar Conta
  const handleSignUp = async () => {
    if (!name || !coupleId) {
      Alert.alert("Erro", "Nome e Código do Casal são obrigatórios.");
      return;
    }
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            name: name,
            // O Cognito exige o prefixo "custom:" para atributos personalizados
            "custom:couple_id": coupleId,
          },
        },
      });
      // Se deu certo, pede pra validar o email
      setAuthMode("confirm");
      Alert.alert("Quase lá!", "Um código foi enviado para o seu e-mail.");
    } catch (error: any) {
      Alert.alert("Erro ao Criar Conta", error.message);
    }
  };

  // Função 3: Confirmar Código do Email
  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      Alert.alert("Sucesso!", "Conta verificada. Você já pode fazer login.");
      setAuthMode("signIn");
    } catch (error: any) {
      Alert.alert("Erro na Verificação", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        globalStyles.container,
        { justifyContent: "center", flex: 1 },
      ]}
    >
      <Text
        style={[
          globalStyles.title,
          { textAlign: "center", fontSize: 28, color: "#007AFF" },
        ]}
      >
        Casal Financeiro
      </Text>

      {/* --- MODO: VERIFICAR CÓDIGO --- */}
      {authMode === "confirm" && (
        <View>
          <Text style={globalStyles.label}>Código de Verificação (Email)</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Ex: 123456"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity
            style={globalStyles.buttonPrimary}
            onPress={handleConfirmSignUp}
          >
            <Text style={globalStyles.buttonPrimaryText}>
              Confirmar e Concluir
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- MODO: LOGIN OU CADASTRO --- */}
      {authMode !== "confirm" && (
        <View>
          <Text style={globalStyles.label}>E-mail</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={globalStyles.label}>Senha</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Sua senha secreta"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Campos exclusivos do Cadastro */}
          {authMode === "signUp" && (
            <View>
              <Text style={globalStyles.label}>Seu Nome</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Ex: Lucas"
                value={name}
                onChangeText={setName}
              />

              <Text style={globalStyles.label}>Código Secreto do Casal</Text>
              <Text style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>
                Você e sua esposa devem digitar o MESMO código aqui.
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Ex: LUCAS_E_MARIA_26"
                autoCapitalize="characters"
                value={coupleId}
                onChangeText={setCoupleId}
              />
            </View>
          )}

          {/* Botões Dinâmicos */}
          <TouchableOpacity
            style={globalStyles.buttonPrimary}
            onPress={authMode === "signIn" ? handleSignIn : handleSignUp}
          >
            <Text style={globalStyles.buttonPrimaryText}>
              {authMode === "signIn" ? "Entrar no App" : "Criar Minha Conta"}
            </Text>
          </TouchableOpacity>

          {/* Alternar entre modos */}
          <TouchableOpacity
            style={{ marginTop: 20, alignItems: "center" }}
            onPress={() =>
              setAuthMode(authMode === "signIn" ? "signUp" : "signIn")
            }
          >
            <Text style={{ color: "#007AFF", fontWeight: "600" }}>
              {authMode === "signIn"
                ? "Não tem conta? Crie uma com seu amor!"
                : "Já tem conta? Faça login aqui."}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
