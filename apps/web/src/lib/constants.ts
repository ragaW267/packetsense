// ============================================================
// PacketSense Frontend — Constants
// ============================================================

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const APP_NAME = "PacketSense";

export const PROTOCOL_LIST = [
  {
    slug: "tcp-handshake",
    name: "TCP 3-Way Handshake",
    icon: "🤝",
    category: "Transport Layer",
    color: "#06b6d4",
  },
  {
    slug: "tcp-retransmission",
    name: "TCP Retransmission",
    icon: "🔄",
    category: "Transport Layer",
    color: "#f59e0b",
  },
  {
    slug: "tcp-congestion",
    name: "TCP Congestion Control",
    icon: "📊",
    category: "Transport Layer",
    color: "#8b5cf6",
  },
  {
    slug: "udp-communication",
    name: "UDP Communication",
    icon: "⚡",
    category: "Transport Layer",
    color: "#10b981",
  },
  {
    slug: "dns-lookup",
    name: "DNS Lookup",
    icon: "🔍",
    category: "Application Layer",
    color: "#ec4899",
  },
  {
    slug: "arp-resolution",
    name: "ARP Resolution",
    icon: "📡",
    category: "Data Link Layer",
    color: "#f97316",
  },
  {
    slug: "dhcp-assignment",
    name: "DHCP IP Assignment",
    icon: "🏷️",
    category: "Application Layer",
    color: "#14b8a6",
  },
  {
    slug: "http-vs-https",
    name: "HTTP vs HTTPS",
    icon: "🔒",
    category: "Application Layer",
    color: "#6366f1",
  },
] as const;

export const NAV_LINKS = [
  { href: "/protocols", label: "Protocols", icon: "Network" },
  { href: "/troubleshoot", label: "Troubleshoot", icon: "Wrench" },
  { href: "/quiz", label: "Quiz", icon: "GraduationCap" },
  { href: "/explain", label: "AI Explain", icon: "Lightbulb" },
] as const;
