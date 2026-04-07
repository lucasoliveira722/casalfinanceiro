import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casal Financeiro",
  description: "Gestão financeira para casais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
