import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchIn - Transforme Ideias em Lançamentos de Sucesso",
  description: "Use o poder da IA para validar suas ideias, analisar o mercado e criar planos de lançamento eficientes para seu produto ou serviço.",
  keywords: "lançamento de produto, inteligência artificial, validação de ideias, análise de mercado, empreendedorismo",
  authors: [{ name: "LaunchIn" }],
  openGraph: {
    title: "LaunchIn - Transforme Ideias em Lançamentos de Sucesso",
    description: "Use o poder da IA para validar suas ideias, analisar o mercado e criar planos de lançamento eficientes.",
    url: "https://launchin.com.br",
    siteName: "LaunchIn",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
