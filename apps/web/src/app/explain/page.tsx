"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import type { ExplainResponse } from "@/types";
import { Lightbulb, Search, Loader2, BookOpen, Sparkles, ArrowRight } from "lucide-react";

interface ExplainTopic {
  key: string;
  label: string;
  category: string;
}

export default function ExplainPage() {
  const [topics, setTopics] = useState<ExplainTopic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    apiClient
      .get<ExplainTopic[]>("/api/explain/topics")
      .then(setTopics)
      .catch(console.error);
  }, []);

  const explainTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    try {
      const res = await apiClient.post<ExplainResponse>("/api/explain", { topic });
      setExplanation(res);
    } catch {
      console.error("Failed to get explanation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      explainTopic(searchTerm.trim());
    }
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(topics.map((t) => t.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            AI <span className="gradient-text">Explain Mode</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Click any topic or search for a concept — get student-friendly explanations with analogies.
          </p>
        </motion.div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for a networking concept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-24 h-12 text-base"
            />
            <Button type="submit" size="sm" className="absolute right-2 top-2">
              Explain
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics List */}
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h3>
                <div className="space-y-1">
                  {filteredTopics
                    .filter((t) => t.category === cat)
                    .map((topic) => (
                      <button
                        key={topic.key}
                        onClick={() => explainTopic(topic.key)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                          selectedTopic === topic.key
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {topic.label}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Explanation Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </motion.div>
              ) : explanation ? (
                <motion.div key="explanation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        {explanation.topic.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose prose-invert max-w-none">
                        {explanation.explanation.split("\n").map((paragraph, i) => (
                          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Analogy */}
                      <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <h4 className="font-semibold text-sm">Real-World Analogy</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{explanation.analogy}</p>
                      </div>

                      {/* Key Points */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-sm">Key Takeaways</h4>
                        </div>
                        <ul className="space-y-2">
                          {explanation.key_points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Related Topics */}
                      {explanation.related_topics.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Related Topics</h4>
                          <div className="flex flex-wrap gap-2">
                            {explanation.related_topics.map((topic) => (
                              <Button
                                key={topic}
                                variant="outline"
                                size="sm"
                                onClick={() => explainTopic(topic)}
                                className="text-xs"
                              >
                                {topic.replace(/-/g, " ")}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="border-border/50 bg-card/30 border-dashed">
                    <CardContent className="p-12 text-center">
                      <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select a topic to explore</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose from the sidebar or search for any networking concept to get a student-friendly explanation.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
