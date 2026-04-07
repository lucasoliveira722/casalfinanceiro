"use client";

import { configureAmplify } from "@/src/lib/amplify";
import { createExpense, updateExpense } from "@/src/services/expenseService";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

configureAmplify();

function AddForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");
  const isEdit = !!editId;

  const [visibility, setVisibility] = useState(params.get("visibility") || "SHARED");
  const [description, setDescription] = useState(params.get("description") || "");
  const [amount, setAmount] = useState(params.get("amount") || "");
  const [expenseType, setExpenseType] = useState(params.get("expenseType") || "SINGLE");
  const [installments, setInstallments] = useState(params.get("installments") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.get("id")) {
      setVisibility(params.get("visibility") || "SHARED");
      setDescription(params.get("description") || "");
      setAmount(params.get("amount") || "");
      setExpenseType(params.get("expenseType") || "SINGLE");
      setInstallments(params.get("installments") || "");
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!description || !amount) {
      setError("Preencha a descrição e o valor.");
      return;
    }
    if (expenseType === "INSTALLMENT" && !installments) {
      setError("Informe a quantidade de parcelas.");
      return;
    }

    setLoading(true);
    try {
      const dto = {
        description,
        amount: parseFloat(amount.replace(",", ".")),
        visibility,
        expenseType,
        installments: expenseType === "INSTALLMENT" ? parseInt(installments) : null,
      };

      if (isEdit) {
        await updateExpense(editId!, dto);
      } else {
        await createExpense(dto);
      }
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Não foi possível conectar à API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 20px" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: 10, border: "none",
              background: "var(--primary-light)", cursor: "pointer",
              fontSize: 18, color: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
            {isEdit ? "Editar Gasto" : "Novo Gasto"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Visibility */}
          <div>
            <label className="label-upper">Visibilidade</label>
            <select
              className="input-glass"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="SHARED">Compartilhado (Casal)</option>
              <option value="PERSONAL">Apenas Meu (Pessoal)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label-upper">Descrição</label>
            <input
              className="input-glass"
              type="text"
              placeholder="Ex: Mercado, Lanche..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="label-upper">Valor Total (R$)</label>
            <input
              className="input-glass"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Expense type */}
          <div>
            <label className="label-upper">Tipo de Gasto</label>
            <select
              className="input-glass"
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
            >
              <option value="SINGLE">Único (Ex: Mercado)</option>
              <option value="INSTALLMENT">Parcelamento</option>
              <option value="RECURRING">Permanente (Ex: Luz, Internet)</option>
            </select>
          </div>

          {/* Installments (conditional) */}
          {expenseType === "INSTALLMENT" && (
            <div>
              <label className="label-upper">Número de Parcelas</label>
              <input
                className="input-glass"
                type="number"
                min="2"
                placeholder="Ex: 12"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Salvando..." : isEdit ? "✓ Atualizar Despesa" : "✓ Salvar Despesa"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense>
      <AddForm />
    </Suspense>
  );
}
