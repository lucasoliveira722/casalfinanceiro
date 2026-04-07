"use client";

import { configureAmplify } from "@/src/lib/amplify";
import {
  confirmSignUp,
  signIn,
  signUp,
} from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

configureAmplify();

type Mode = "signIn" | "signUp" | "confirm";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [coupleId, setCoupleId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ username: email, password, options: { authFlowType: "USER_PASSWORD_AUTH" } });
      router.replace("/");
    } catch {
      setError("Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !coupleId) {
      setError("Nome e Código do Casal são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            name,
            "custom:couple_id": coupleId,
          },
        },
      });
      setMode("confirm");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setMode("signIn");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro na verificação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "var(--primary-light)",
              border: "1px solid rgba(123,108,248,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 28,
            }}
          >
            💑
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
            Casal Financeiro
          </h1>
          <p style={{ color: "var(--text-subtle)", marginTop: 8, fontSize: 14 }}>
            {mode === "signIn" && "Bem-vindo(a) de volta!"}
            {mode === "signUp" && "Crie sua conta"}
            {mode === "confirm" && "Confirme seu e-mail"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: 28 }}>
          {mode === "signIn" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label-upper">E-mail</label>
                <input
                  className="input-glass"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-upper">Senha</label>
                <input
                  className="input-glass"
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>
              )}
              <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "Entrando..." : "Entrar no App"}
              </button>
            </form>
          )}

          {mode === "signUp" && (
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label-upper">E-mail</label>
                <input
                  className="input-glass"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-upper">Senha</label>
                <input
                  className="input-glass"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-upper">Seu Nome</label>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="Ex: Lucas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="label-upper">Código Secreto do Casal</label>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="Ex: LUCAS_E_MARIA_26"
                  value={coupleId}
                  onChange={(e) => setCoupleId(e.target.value)}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                  Você e seu amor devem digitar o MESMO código.
                </p>
              </div>
              {error && (
                <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>
              )}
              <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "Criando..." : "Criar Minha Conta"}
              </button>
            </form>
          )}

          {mode === "confirm" && (
            <form onSubmit={handleConfirm} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ color: "var(--text-subtle)", fontSize: 14, margin: 0 }}>
                Um código foi enviado para <strong style={{ color: "var(--text)" }}>{email}</strong>.
              </p>
              <div>
                <label className="label-upper">Código de Verificação</label>
                <input
                  className="input-glass"
                  type="text"
                  placeholder="Ex: 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>
              )}
              <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "Verificando..." : "Confirmar e Concluir"}
              </button>
            </form>
          )}
        </div>

        {/* Toggle */}
        {mode !== "confirm" && (
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-subtle)", fontSize: 14 }}>
            {mode === "signIn" ? (
              <>
                Não tem conta?{" "}
                <button
                  onClick={() => { setMode("signUp"); setError(""); }}
                  style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                >
                  Crie uma com seu amor!
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  onClick={() => { setMode("signIn"); setError(""); }}
                  style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                >
                  Faça login aqui.
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
