import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";
import "react-native-get-random-values"; // DEVE ser a primeira linha do arquivo

// Configuração da nossa "Portaria" na AWS
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_AWLbCZmGz",
      userPoolClientId: "38hpjb8467f286o6l50tv03kr4",
    },
  },
});

export default function RootLayout() {
  return (
    <Stack>
      {/* Oculta o cabeçalho padrão nas telas */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
