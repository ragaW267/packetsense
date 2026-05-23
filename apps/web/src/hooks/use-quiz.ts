"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import type { QuizQuestion, QuizResult } from "@/types";

export function useQuiz(categoryId: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get<QuizQuestion[]>(
        `/api/quiz/questions/${categoryId}`
      );
      setQuestions(data);
      setCurrentIndex(0);
      setAnswers(new Map());
      setResult(null);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => new Map(prev).set(questionId, optionIndex));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const answersArray = Array.from(answers.entries()).map(
        ([question_id, selected]) => ({ question_id, selected })
      );

      const res = await apiClient.post<QuizResult>("/api/quiz/submit", {
        category_id: categoryId,
        answers: answersArray,
      });
      setResult(res);
      return res;
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questions,
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    totalQuestions: questions.length,
    answers,
    result,
    isLoading,
    isSubmitting,
    loadQuestions,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    isLastQuestion: currentIndex === questions.length - 1,
    isAnswered: (questionId: string) => answers.has(questionId),
    allAnswered: questions.length > 0 && answers.size === questions.length,
  };
}
