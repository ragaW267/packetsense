"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { PROTOCOL_LIST } from "@/lib/constants";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProtocolsPage() {
  const categories = [...new Set(PROTOCOL_LIST.map((p) => p.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Protocol <span className="gradient-text">Visualizer</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Watch network protocols come alive with interactive step-by-step animations.
          </p>
        </motion.div>

        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {category}
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {PROTOCOL_LIST.filter((p) => p.category === category).map((proto) => (
                <motion.div key={proto.slug} variants={item}>
                  <Link href={`/protocols/${proto.slug}`}>
                    <Card className="group border-border/50 bg-card/50 hover:bg-card/80 transition-all hover:border-primary/30 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
                          style={{ backgroundColor: `${proto.color}20` }}
                        >
                          {proto.icon}
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {proto.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">{category}</Badge>
                        <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Visualize <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
