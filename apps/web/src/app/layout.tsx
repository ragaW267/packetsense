import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "PacketSense — Interactive Networking Learning Platform",
  description:
    "Learn computer networks interactively. Visualize protocols, troubleshoot network issues, take quizzes, and master networking concepts with PacketSense.",
  keywords: [
    "networking",
    "computer networks",
    "TCP/IP",
    "protocol visualizer",
    "network troubleshooting",
    "learning platform",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen gradient-bg">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
