"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Network, Wrench, Trophy, Flame, BarChart3, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { QuizStats, QuizAttemptSummary } from "@/types";

const statCards = [
  { key: "total_quizzes", label: "Quizzes Taken", icon: GraduationCap, color: "text-green-400" },
  { key: "protocols_viewed", label: "Protocols Viewed", icon: Network, color: "text-cyan-400" },
  { key: "troubleshoot_sessions", label: "Troubleshoots", icon: Wrench, color: "text-orange-400" },
  { key: "average_score", label: "Avg Score %", icon: Trophy, color: "text-yellow-400" },
];

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#f97316", "#6366f1"];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useApi<QuizStats>("/api/quiz/stats");

  const chartData = stats?.recent_attempts?.map((a: QuizAttemptSummary) => ({
    name: a.category_name.substring(0, 8),
    score: a.percentage,
  })) || [];

  const pieData = stats?.recent_attempts?.reduce((acc: any[], a: QuizAttemptSummary) => {
    const existing = acc.find((x) => x.name === a.category_name);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: a.category_name, value: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.full_name || user?.username}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your learning progress overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          const value = stats
            ? stat.key === "average_score"
              ? stats.average_score.toFixed(1)
              : (stats as any)[stat.key] || 0
            : "—";
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Recent Quiz Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 34% 17%)" />
                    <XAxis dataKey="name" stroke="hsl(215 16% 57%)" fontSize={12} />
                    <YAxis stroke="hsl(215 16% 57%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(224 71% 6%)",
                        border: "1px solid hsl(216 34% 17%)",
                        borderRadius: "8px",
                        color: "hsl(213 31% 91%)",
                      }}
                    />
                    <Bar dataKey="score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <p>Take some quizzes to see your scores here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Quiz Categories Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name }) => name.substring(0, 10)}
                    >
                      {pieData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(224 71% 6%)",
                        border: "1px solid hsl(216 34% 17%)",
                        borderRadius: "8px",
                        color: "hsl(213 31% 91%)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <p>No quiz data yet. Start a quiz to see breakdown!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Quiz Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recent_attempts && stats.recent_attempts.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_attempts.map((attempt: QuizAttemptSummary) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{attempt.category_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Progress value={attempt.percentage} className="h-2" />
                      </div>
                      <Badge variant={attempt.percentage >= 70 ? "default" : "secondary"}>
                        {attempt.score}/{attempt.total_questions}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No activity yet. Start exploring to build your progress!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
