"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/hooks/use-quiz";
import { useAuth } from "@/hooks/use-auth";
import type { QuizResult, QuizResultDetail } from "@/types";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader2, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { isAuthenticated } = useAuth();

  const {
    questions, currentQuestion, currentIndex, totalQuestions,
    answers, result, isLoading, isSubmitting,
    loadQuestions, selectAnswer, nextQuestion, prevQuestion,
    submitQuiz, isLastQuestion, isAnswered, allAnswered,
  } = useQuiz(categoryId);

  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSubmit = async () => {
    const res = await submitQuiz();
    if (res) setShowResult(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResult ? (
          <>
            {/* Question View */}
            {currentQuestion && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                  </div>
                  <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="h-2" />
                </div>

                <Card className="border-border/50 bg-card/50">
                  <CardContent className="p-6 space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-lg font-semibold mb-6">{currentQuestion.question}</h2>
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, i) => {
                            const isSelected = answers.get(currentQuestion.id) === i;
                            return (
                              <button
                                key={i}
                                onClick={() => selectAnswer(currentQuestion.id, i)}
                                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                  isSelected ? "border-primary text-primary bg-primary/20" : "border-border"
                                }`}>
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <span className="text-sm">{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={prevQuestion} disabled={currentIndex === 0}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                      </Button>
                      {isLastQuestion ? (
                        <Button onClick={handleSubmit} disabled={!allAnswered || isSubmitting || !isAuthenticated}>
                          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trophy className="w-4 h-4 mr-2" />}
                          {!isAuthenticated ? "Login to Submit" : "Submit Quiz"}
                        </Button>
                      ) : (
                        <Button onClick={nextQuestion}>
                          Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Question nav dots */}
                <div className="mt-6 flex justify-center flex-wrap gap-2">
                  {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        const idx = i;
                        if (idx <= currentIndex || isAnswered(questions[idx < questions.length ? idx : 0].id)) {
                          // navigate by adjusting current index through prev/next
                          while (currentIndex > idx) prevQuestion();
                          while (currentIndex < idx) nextQuestion();
                        }
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        i === currentIndex
                          ? "bg-primary text-primary-foreground"
                          : isAnswered(q.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Result View */
          result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border-border/50 bg-card/50 text-center">
                <CardContent className="p-8">
                  <Trophy className={`w-16 h-16 mx-auto mb-4 ${result.percentage >= 70 ? "text-yellow-400" : "text-muted-foreground"}`} />
                  <h2 className="text-3xl font-bold">{result.score}/{result.total_questions}</h2>
                  <p className="text-lg text-muted-foreground mt-1">{result.percentage}% correct</p>
                  <Badge className="mt-3" variant={result.percentage >= 70 ? "default" : "secondary"}>
                    {result.percentage >= 90 ? "Excellent!" : result.percentage >= 70 ? "Good job!" : result.percentage >= 50 ? "Keep practicing" : "Study more"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader><CardTitle className="text-lg">Review Answers</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {result.details.map((d: QuizResultDetail, i: number) => (
                    <div key={d.question_id} className={`p-4 rounded-lg border ${d.is_correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                      <div className="flex items-start gap-3">
                        {d.is_correct ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-2">Q{i + 1}: {d.question}</p>
                          <p className="text-xs text-muted-foreground">
                            Your answer: <span className={d.is_correct ? "text-green-400" : "text-red-400"}>{d.options[d.selected]}</span>
                          </p>
                          {!d.is_correct && (
                            <p className="text-xs text-green-400 mt-1">
                              Correct: {d.options[d.correct]}
                            </p>
                          )}
                          {d.explanation && (
                            <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">{d.explanation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => { setShowResult(false); loadQuestions(); }}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Retry
                </Button>
                <Link href="/quiz" className="flex-1">
                  <Button className="w-full">All Quizzes</Button>
                </Link>
              </div>
            </motion.div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
