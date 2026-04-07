"use client";

import { AuthProvider, useAuth } from "@/src/components/AuthProvider";
import { ExpenseCard } from "@/src/components/ExpenseCard";
import {
  Expense,
  calcTotals,
  deleteExpense,
  formatBRL,
  getExpenses,
} from "@/src/services/expenseService";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Tab = "SHARED" | "PERSONAL" | "TOTAL";

function Dashboard() {
  const router = useRouter();
  const { userName, isLoading: authLoading, handleSignOut } = useAuth();
  const [tab, setTab] = useState<Tab>("SHARED");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getExpenses(year, month);
      setExpenses(data);
    } catch {
      setError("Não foi possível carregar os gastos.");
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    if (!authLoading) fetchExpenses();
  }, [authLoading, fetchExpenses]);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este gasto?")) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Não foi possível excluir.");
    }
  }

  function handleEdit(expense: Expense) {
    const params = new URLSearchParams({
      id: expense.id,
      description: expense.description,
      amount: expense.amount.toString(),
      visibility: expense.visibility,
      expenseType: expense.expenseType,
      installments: expense.installments?.toString() ?? "",
    });
    router.push(`/add?${params.toString()}`);
  }

  const totals = calcTotals(expenses);

  const filtered =
    tab === "TOTAL"
      ? expenses
      : expenses.filter((e) => e.visibility === tab);

  const summaryLabel =
    tab === "SHARED"
      ? "Total do Casal"
      : tab === "PERSONAL"
        ? "Seu Total Pessoal"
        : "Custo Real Mensal (Pessoal + 50% Casal)";

  const summaryValue =
    tab === "SHARED"
      ? totals.shared
      : tab === "PERSONAL"
        ? totals.personal
        : totals.real;

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--text-subtle)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 100px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: 0 }}>Bem-vindo(a),</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: "4px 0 0", letterSpacing: -0.5 }}>
              Olá, {userName}! 👋
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => router.push("/history")}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--glass)", border: "1px solid var(--glass-border)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: "var(--text)",
              }}
              title="Histórico"
            >
              📅
            </button>
            <button
              onClick={handleSignOut}
              style={{
                height: 40, padding: "0 14px", borderRadius: 10,
                background: "var(--glass)", border: "1px solid var(--glass-border)",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                color: "var(--text-subtle)",
              }}
            >
              Sair
            </button>
          </div>
        </div>

        {/* Tab selector */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 4, background: "rgba(255,255,255,0.06)",
            borderRadius: 10, padding: 4, marginBottom: 20,
          }}
        >
          {(["SHARED", "PERSONAL", "TOTAL"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 0", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#111" : "var(--text-subtle)",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.25)" : "none",
              }}
            >
              {t === "SHARED" ? "Casal" : t === "PERSONAL" ? "Meus Gastos" : "Total"}
            </button>
          ))}
        </div>

        {/* Summary card */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
            borderRadius: 16, padding: "20px 22px", marginBottom: 24,
            boxShadow: "0 8px 32px var(--primary-glow)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.9, opacity: 0.75, margin: 0 }}>
            {summaryLabel}
          </p>
          <p style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 0", letterSpacing: -1 }}>
            {formatBRL(summaryValue)}
          </p>
        </div>

        {/* Expense list */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: 0.2 }}>Lançamentos</h2>
          <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>
            {now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </span>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-subtle)", textAlign: "center", paddingTop: 40 }}>Carregando...</p>
        ) : error ? (
          <p style={{ color: "var(--danger)", textAlign: "center", paddingTop: 40 }}>{error}</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: 40 }}>
            Nenhum gasto registrado no mês atual.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push("/add")}
        style={{
          position: "fixed", bottom: 28, right: 28,
          width: 56, height: 56, borderRadius: 28,
          background: "var(--primary)", border: "none",
          cursor: "pointer", fontSize: 26, color: "#fff",
          boxShadow: "0 4px 20px var(--primary-glow)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.15s",
        }}
        title="Novo gasto"
      >
        +
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
