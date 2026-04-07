
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Documentador — GFT · Banco de Occidente",
  description: "Aceleradores — Cargue de Documento",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icons/FileXmlBox (1).png" type="image/png" />
      </head>
      <body className="bg-gray-50">
        <Header />
        <main className="pt-[var(--header-h)]">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
