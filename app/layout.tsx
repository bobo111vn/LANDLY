import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landly – Quản lý giao dịch bất động sản",
  description: "Nền tảng quản lý giao dịch bất động sản Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 min-h-screen antialiased">{children}</body>
    </html>
  );
}
