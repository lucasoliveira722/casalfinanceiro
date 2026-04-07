"use client";

import { AuthProvider, useAuth } from "@/src/components/AuthProvider";
import { ExpenseCard } from "@/src/components/ExpenseCard";
import {
  Expense,
  calcTotals,
  deleteExpense,
  formatBRL,
  getExpenses,
  updateExpense,
} from "@/src/services/expenseService";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function HistoryContent() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const { real } = calcTotals(expenses);

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--text-subtle)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              width: 40, height: 40, borderRadius: 10, border: "none",
              background: "var(--glass)", borderWidth: 1, borderStyle: "solid",
              borderColor: "var(--glass-border)", cursor: "pointer",
              fontSize: 18, color: "var(--text)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Histórico</h1>
        </div>

        {/* Year selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 20 }}>
          <button
            onClick={() => setYear((y) => y - 1)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--primary)" }}
          >
            ‹
          </button>
          <span style={{ fontSize: 20, fontWeight: 700 }}>{year}</span>
          <button
            onClick={() => setYear((y) => y + 1)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--primary)" }}
          >
            ›
          </button>
        </div>

        {/* Month selector */}
        <div
          style={{
            display: "flex", gap: 8, overflowX: "auto",
            paddingBottom: 8, marginBottom: 24,
          }}
        >
          {MONTHS.map((m, i) => {
            const idx = i + 1;
            const active = month === idx;
            return (
              <button
                key={idx}
                onClick={() => setMonth(idx)}
                style={{
                  flexShrink: 0, padding: "8px 14px", borderRadius: 20,
                  border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  background: active ? "var(--primary)" : "rgba(255,255,255,0.08)",
                  color: active ? "#fff" : "var(--text-subtle)",
                  boxShadow: active ? "0 2px 12px var(--primary-glow)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {m.substring(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Summary card */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
            borderRadius: 16, padding: "18px 22px", marginBottom: 24,
            boxShadow: "0 8px 32px var(--primary-glow)",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.9, opacity: 0.75, margin: 0 }}>
            Custo Real (Pessoal + 50% Casal)
          </p>
          <p style={{ fontSize: 30, fontWeight: 700, margin: "6px 0 0", letterSpacing: -1 }}>
            {formatBRL(real)}
          </p>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: "var(--text-subtle)", textAlign: "center", paddingTop: 40 }}>Carregando...</p>
        ) : error ? (
          <p style={{ color: "var(--danger)", textAlign: "center", paddingTop: 40 }}>{error}</p>
        ) : expenses.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: 40 }}>
            Nenhum gasto encontrado.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {expenses.map((expense) => (
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
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthProvider>
      <HistoryContent />
    </AuthProvider>
  );
}
