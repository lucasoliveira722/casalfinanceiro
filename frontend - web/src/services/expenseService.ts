import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://3.80.132.177";
const EXPENSES_URL = `${API_BASE}/api/expenses`;

export interface Expense {
  id: string;
  description: string;
  amount: number;
  visibility: "SHARED" | "PERSONAL";
  expenseType: "SINGLE" | "INSTALLMENT" | "RECURRING";
  installments: number | null;
  installmentAmount?: number;
  createdAt: string;
}

export interface ExpenseDTO {
  description: string;
  amount: number;
  visibility: string;
  expenseType: string;
  installments: number | null;
}

async function getToken(): Promise<string> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  return token;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Erro ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getExpenses(year: number, month: number): Promise<Expense[]> {
  const token = await getToken();
  const res = await fetch(`${EXPENSES_URL}?year=${year}&month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function createExpense(dto: ExpenseDTO): Promise<Expense> {
  const token = await getToken();
  const res = await fetch(EXPENSES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
  return handleResponse(res);
}

export async function updateExpense(id: string, dto: ExpenseDTO): Promise<Expense> {
  const token = await getToken();
  const res = await fetch(`${EXPENSES_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
  return handleResponse(res);
}

export async function deleteExpense(id: string): Promise<void> {
  const token = await getToken();
  const res = await fetch(`${EXPENSES_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Erro ${res.status}`);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getEffectiveAmount(expense: Expense): number {
  if (expense.expenseType === "INSTALLMENT" && expense.installmentAmount != null) {
    return expense.installmentAmount;
  }
  return expense.amount;
}

export function getTypeLabel(expense: Expense): string {
  if (expense.expenseType === "RECURRING") return "Permanente";
  if (expense.expenseType === "INSTALLMENT") {
    return `Parcelado (${expense.installments}x)`;
  }
  return "Único";
}

export function calcTotals(expenses: Expense[]) {
  let shared = 0;
  let personal = 0;
  for (const e of expenses) {
    const amt = getEffectiveAmount(e);
    if (e.visibility === "SHARED") shared += amt;
    else personal += amt;
  }
  return {
    shared,
    personal,
    real: personal + shared * 0.5,
  };
}
