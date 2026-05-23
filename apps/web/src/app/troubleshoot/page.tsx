"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { TroubleshootIssue, TroubleshootQuestion, TroubleshootAnswer, TroubleshootResult } from "@/types";
import { Wrench, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Loader2, RotateCcw } from "lucide-react";

type WizardState = "select" | "questions" | "result";

export default function TroubleshootPage() {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<WizardState>("select");
  const [issues, setIssues] = useState<TroubleshootIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [questions, setQuestions] = useState<TroubleshootQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<TroubleshootAnswer[]>([]);
  const [result, setResult] = useState<TroubleshootResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    apiClient.get<TroubleshootIssue[]>("/api/troubleshoot/issues")
      .then(setIssues)
      .catch(console.error);
  }, []);

  const selectIssue = async (type: string) => {
    setSelectedIssue(type);
    setIsLoading(true);
    try {
      const qs = await apiClient.get<TroubleshootQuestion[]>(`/api/troubleshoot/questions/${type}`);
      setQuestions(qs);
      setCurrentQ(0);
      setAnswers([]);
      setState("questions");
    } catch {
      console.error("Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  };

  const answerQuestion = (value: string) => {
    const existing = answers.findIndex((a) => a.question_id === questions[currentQ].id);
    const newAnswers = [...answers];
    if (existing >= 0) {
      newAnswers[existing] = { question_id: questions[currentQ].id, value };
    } else {
      newAnswers.push({ question_id: questions[currentQ].id, value });
    }
    setAnswers(newAnswers);
  };

  const submitAnalysis = async () => {
    if (!selectedIssue || !isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await apiClient.post<TroubleshootResult>("/api/troubleshoot/analyze", {
        issue_type: selectedIssue,
        answers,
      });
      setResult(res);
      setState("result");
    } catch (err: any) {
      console.error("Analysis failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setState("select");
    setSelectedIssue(null);
    setQuestions([]);
    setAnswers([]);
    setResult(null);
    setCurrentQ(0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Troubleshoot <span className="gradient-text">Wizard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your network issue and answer a few questions to get a diagnosis.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Issue */}
          {state === "select" && (
            <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issues.map((issue) => (
                  <Card
                    key={issue.type}
                    className="group border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30 cursor-pointer transition-all"
                    onClick={() => selectIssue(issue.type)}
                  >
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">{issue.icon}</div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{issue.label}</h3>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Questions */}
          {state === "questions" && questions.length > 0 && (
            <motion.div key="questions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Question {currentQ + 1} of {questions.length}
                    </CardTitle>
                    <Badge variant="outline">{selectedIssue?.replace(/-/g, " ")}</Badge>
                  </div>
                  <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2 mt-3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg font-medium">{questions[currentQ].text}</p>
                  <div className="space-y-2">
                    {questions[currentQ].options.map((opt) => {
                      const isSelected = answers.find((a) => a.question_id === questions[currentQ].id)?.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => answerQuestion(opt.value)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => currentQ > 0 ? setCurrentQ(currentQ - 1) : reset()}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentQ === 0 ? "Back" : "Previous"}
                    </Button>
                    {currentQ < questions.length - 1 ? (
                      <Button onClick={() => setCurrentQ(currentQ + 1)} disabled={!answers.find((a) => a.question_id === questions[currentQ].id)}>
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={submitAnalysis} disabled={isLoading || !isAuthenticated}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        {!isAuthenticated ? "Login to Analyze" : "Get Diagnosis"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Result */}
          {state === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <CardTitle>{result.diagnosis.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confidence: {result.diagnosis.confidence}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{result.diagnosis.description}</p>

                  <div>
                    <h3 className="font-semibold mb-3">Recommended Solutions</h3>
                    <ul className="space-y-2">
                      {result.diagnosis.solutions.map((sol, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-sm">{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.diagnosis.related_protocols.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Related Protocols</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.diagnosis.related_protocols.map((proto) => (
                          <a key={proto} href={`/protocols/${proto}`}>
                            <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">{proto}</Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={reset} variant="outline" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" /> Start New Diagnosis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
