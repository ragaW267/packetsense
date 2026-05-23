"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Wrench, GraduationCap, Lightbulb, ArrowRight, Zap, Shield, BookOpen } from "lucide-react";
import { PROTOCOL_LIST } from "@/lib/constants";

const features = [
  {
    icon: Network,
    title: "Protocol Visualizer",
    description: "Watch TCP handshakes, DNS lookups, DHCP flows, and more come alive with interactive step-by-step animations.",
    color: "from-cyan-500 to-blue-500",
    href: "/protocols",
  },
  {
    icon: Wrench,
    title: "Troubleshoot Wizard",
    description: "Diagnose real network issues with an adaptive decision-tree engine. Get actionable solutions instantly.",
    color: "from-orange-500 to-red-500",
    href: "/troubleshoot",
  },
  {
    icon: GraduationCap,
    title: "Quiz Mode",
    description: "Test your knowledge across OSI, TCP/IP, subnetting, routing, DNS, DHCP, and switching. Track your progress.",
    color: "from-green-500 to-emerald-500",
    href: "/quiz",
  },
  {
    icon: Lightbulb,
    title: "AI Explain",
    description: "Confused by a concept? Get student-friendly explanations with real-world analogies and key takeaways.",
    color: "from-purple-500 to-violet-500",
    href: "/explain",
  },
];

const stats = [
  { value: "8+", label: "Protocol Visualizations" },
  { value: "50+", label: "Quiz Questions" },
  { value: "7", label: "Troubleshoot Scenarios" },
  { value: "13+", label: "Explain Topics" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          {/* Radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Built for Engineering Students
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Master Networking{" "}
                <span className="gradient-text">Interactively</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Visualize protocols, troubleshoot real issues, ace your exams, and understand
                networking concepts through interactive simulations — not just textbooks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="text-base px-8 glow-cyan">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/protocols">
                  <Button size="lg" variant="outline" className="text-base px-8">
                    <Network className="w-4 h-4 mr-2" />
                    Explore Protocols
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 border-t border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to{" "}
                <span className="gradient-text">Learn Networking</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From interactive visualizations to hands-on troubleshooting — all the tools
                a networking student needs in one platform.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={item}>
                    <Link href={feature.href}>
                      <Card className="group border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/30 cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Protocols Preview */}
        <section className="py-24 border-t border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                <span className="gradient-text">8 Protocol Visualizations</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each protocol comes with step-by-step animation, packet labels, and detailed explanations.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {PROTOCOL_LIST.map((proto) => (
                <motion.div key={proto.slug} variants={item}>
                  <Link href={`/protocols/${proto.slug}`}>
                    <Card className="group text-center border-border/50 bg-card/50 hover:bg-card/80 transition-all hover:border-primary/30 cursor-pointer">
                      <CardContent className="p-5">
                        <div className="text-3xl mb-3">{proto.icon}</div>
                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                          {proto.name}
                        </h4>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {proto.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-border/30">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Ready to ace your networking exams?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join PacketSense and start visualizing, practicing, and mastering
                  computer networks today.
                </p>
                <Link href="/signup">
                  <Button size="lg" className="px-8 glow-cyan">
                    Start Learning Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
