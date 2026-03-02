import { Tabs, useRouter } from "expo-router";
// Em breve adicionaremos ícones aqui

export default function Layout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#007AFF" }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen
        name="add"
        options={{ title: "Adicionar" }}
        listeners={{
          tabPress: (e) => {
            // Previne o comportamento padrão de apenas trocar de aba
            e.preventDefault();
            // Força a navegação para a tela "add" sem nenhum parâmetro
            router.push("/add");
          },
        }}
      />
      <Tabs.Screen name="settings" options={{ title: "Ajustes" }} />
    </Tabs>
  );
}
