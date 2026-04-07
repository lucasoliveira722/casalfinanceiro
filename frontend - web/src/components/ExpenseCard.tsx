"use client";

import {
  Expense,
  formatBRL,
  getEffectiveAmount,
  getTypeLabel,
} from "@/src/services/expenseService";

interface Props {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: Props) {
  const amount = getEffectiveAmount(expense);
  const typeLabel = getTypeLabel(expense);
  const isShared = expense.visibility === "SHARED";
  const date = expense.createdAt
    ? new Date(expense.createdAt).toLocaleDateString("pt-BR")
    : "";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", margin: 0 }}>
            {expense.description}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: "4px 0 0" }}>
            {date && `${date} • `}{typeLabel}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--danger)", margin: 0 }}>
            {formatBRL(amount)}
          </p>
          {expense.expenseType === "INSTALLMENT" && expense.installmentAmount != null && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>
              Total: {formatBRL(expense.amount)}
            </p>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className={isShared ? "badge-shared" : "badge-personal"}>
          {isShared ? "Casal" : "Pessoal"}
        </span>

        {(onEdit || onDelete) && (
          <div style={{ display: "flex", gap: 12 }}>
            {onEdit && (
              <button
                onClick={() => onEdit(expense)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(expense.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--danger)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Excluir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
