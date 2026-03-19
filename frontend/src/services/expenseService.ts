import { fetchAuthSession } from "aws-amplify/auth";
import { EXPENSES_URL } from "../config/api";

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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Erro ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getExpenses(year: number, month: number): Promise<any[]> {
  const token = await getToken();
  const response = await fetch(`${EXPENSES_URL}?year=${year}&month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function createExpense(dto: ExpenseDTO): Promise<any> {
  const token = await getToken();
  const response = await fetch(EXPENSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse(response);
}

export async function updateExpense(id: string, dto: ExpenseDTO): Promise<any> {
  const token = await getToken();
  const response = await fetch(`${EXPENSES_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse(response);
}

export async function deleteExpense(id: string): Promise<void> {
  const token = await getToken();
  const response = await fetch(`${EXPENSES_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Erro ${response.status}`);
  }
}
