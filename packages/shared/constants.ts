// ============================================================
// PacketSense — Shared Constants
// ============================================================

export const PROTOCOL_SLUGS = [
  "tcp-handshake",
  "tcp-retransmission",
  "tcp-congestion",
  "udp-communication",
  "dns-lookup",
  "arp-resolution",
  "dhcp-assignment",
  "http-vs-https",
] as const;

export const PROTOCOL_LABELS: Record<string, string> = {
  "tcp-handshake": "TCP 3-Way Handshake",
  "tcp-retransmission": "TCP Retransmission",
  "tcp-congestion": "TCP Congestion / Slow Start",
  "udp-communication": "UDP Communication",
  "dns-lookup": "DNS Lookup",
  "arp-resolution": "ARP Resolution",
  "dhcp-assignment": "DHCP IP Assignment",
  "http-vs-https": "HTTP vs HTTPS",
};

export const ISSUE_TYPES = [
  "high-ping",
  "packet-loss",
  "websites-not-loading",
  "dns-failure",
  "slow-internet",
  "gaming-lag",
  "unstable-wifi",
] as const;

export const QUIZ_CATEGORIES = [
  "osi-model",
  "tcp-ip",
  "subnetting",
  "routing",
  "switching",
  "dns",
  "dhcp",
] as const;

export const QUIZ_CATEGORY_LABELS: Record<string, string> = {
  "osi-model": "OSI Model",
  "tcp-ip": "TCP/IP",
  subnetting: "Subnetting",
  routing: "Routing",
  switching: "Switching",
  dns: "DNS",
  dhcp: "DHCP",
};

export const APP_NAME = "PacketSense";
export const APP_DESCRIPTION =
  "Interactive networking learning and troubleshooting platform for engineering students.";
