import { Tabs } from "expo-router";
// Em breve adicionaremos ícones aqui

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#007AFF" }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="add" options={{ title: "Adicionar" }} />
      <Tabs.Screen name="settings" options={{ title: "Ajustes" }} />
    </Tabs>
  );
}
