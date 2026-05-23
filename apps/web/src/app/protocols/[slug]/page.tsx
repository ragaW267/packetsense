"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import type { ProtocolInfo, ProtocolStep } from "@/types";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProtocolVisualizerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [protocol, setProtocol] = useState<ProtocolInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const data = await apiClient.get<ProtocolInfo>(`/api/protocols/${slug}`);
        setProtocol(data);
      } catch {
        console.error("Failed to fetch protocol");
      } finally {
        setLoading(false);
      }
    };
    fetchProtocol();
  }, [slug]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || !protocol?.steps) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= (protocol.steps?.length || 1) - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [isPlaying, protocol]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Protocol not found. <Link href="/protocols" className="text-primary underline">Go back</Link></p>
        </div>
      </div>
    );
  }

  const steps = protocol.steps || [];
  const step = steps[currentStep];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/protocols" className="hover:text-primary">Protocols</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{protocol.name}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{protocol.name}</h1>
          <p className="text-muted-foreground max-w-2xl">{protocol.overview || protocol.description}</p>
          <Badge variant="outline" className="mt-3">{protocol.category}</Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Area */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50 overflow-hidden">
              <CardContent className="p-8">
                {/* Network Nodes + Animated Packet */}
                <div className="relative min-h-[300px] flex items-center justify-between">
                  {/* From Node */}
                  <motion.div
                    className="flex flex-col items-center gap-2 z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center">
                      <span className="text-2xl">💻</span>
                    </div>
                    <span className="text-sm font-medium">{step?.from || "Client"}</span>
                  </motion.div>

                  {/* Connection Line */}
                  <div className="absolute left-24 right-24 top-1/2 -translate-y-1/2">
                    <div className="h-0.5 bg-border/50 w-full" />

                    {/* Animated Packet */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`packet-${currentStep}`}
                        className="absolute top-1/2 -translate-y-1/2"
                        initial={{
                          left: step?.from === "Server" || step?.from?.includes("Server") || step?.from?.includes("DHCP") ? "90%" : "0%",
                          opacity: 0,
                          scale: 0.5,
                        }}
                        animate={{
                          left: step?.from === "Server" || step?.from?.includes("Server") || step?.from?.includes("DHCP") ? "10%" : "80%",
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      >
                        <div
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white whitespace-nowrap shadow-lg"
                          style={{ backgroundColor: step?.color || "#06b6d4" }}
                        >
                          {step?.packet_label || step?.label}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* To Node */}
                  <motion.div
                    className="flex flex-col items-center gap-2 z-10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border-2 border-violet-500/30 flex items-center justify-center">
                      <span className="text-2xl">🖥️</span>
                    </div>
                    <span className="text-sm font-medium">{step?.to || "Server"}</span>
                  </motion.div>
                </div>

                {/* Step Info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge style={{ backgroundColor: step?.color || "#06b6d4" }} className="text-white">
                        Step {currentStep + 1}
                      </Badge>
                      <h3 className="font-semibold">{step?.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step?.description}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => { setCurrentStep(0); setIsPlaying(false); }} disabled={currentStep === 0}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button size="icon" onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Step indicators */}
                <div className="mt-4 flex justify-center gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentStep ? "bg-primary w-6" : i < currentStep ? "bg-primary/50" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel — Steps & Key Concepts */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">All Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                      i === currentStep
                        ? "bg-primary/10 border border-primary/30 text-primary"
                        : "hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className="font-semibold">Step {i + 1}:</span> {s.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {protocol.key_concepts && (
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Key Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {protocol.key_concepts.map((concept, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {concept}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
