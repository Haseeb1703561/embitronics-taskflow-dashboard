"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, FolderKanban, ListTodo, RefreshCcw } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  STATUS_BADGE_STYLES,
  STATUS_CHART_COLORS,
  TASK_STATUSES,
} from "@/lib/constants";
import { fetchJson } from "@/lib/fetcher";
import { formatDateLabel, getDueDateTone } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export function OverviewClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStats() {
    try {
      setIsLoading(true);
      setError(null);
      const payload = await fetchJson<DashboardStats>("/api/dashboard");
      setStats(payload);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadStats();
  }, []);

  if (isLoading) {
    return <OverviewState title="Loading dashboard..." subtitle="Pulling the latest project and task metrics." />;
  }

  if (error || !stats) {
    return (
      <OverviewState
        title="Unable to load dashboard"
        subtitle={error || "Something went wrong while loading your data."}
      >
        <Button variant="secondary" onClick={() => void loadStats()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </OverviewState>
    );
  }

  const chartData = TASK_STATUSES.map((status) => ({
    name: status,
    value: stats.tasksByStatus[status],
    color: STATUS_CHART_COLORS[status],
  }));

  const completedRate =
    stats.totalTasks === 0
      ? 0
      : Math.round((stats.tasksByStatus.Done / stats.totalTasks) * 100);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Overview
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Keep delivery visible and momentum high.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Track project health, spot overdue work early, and understand how
            tasks are moving through the pipeline.
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            Completion rate
          </p>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-5xl font-semibold text-white">
              {completedRate}%
            </span>
            <span className="pb-2 text-sm text-slate-400">tasks done</span>
          </div>
          <div className="mt-5 h-3 rounded-full bg-slate-800">
            <div
              className="h-3 rounded-full bg-cyan-400 transition-all"
              style={{ width: `${completedRate}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-slate-400">
            {stats.tasksByStatus.Done} completed out of {stats.totalTasks} total
            tasks.
          </p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total projects"
          value={stats.totalProjects}
          accent="from-cyan-500/20 to-cyan-500/5"
          icon={<FolderKanban className="h-5 w-5 text-cyan-300" />}
        />
        <MetricCard
          label="Total tasks"
          value={stats.totalTasks}
          accent="from-blue-500/20 to-blue-500/5"
          icon={<ListTodo className="h-5 w-5 text-blue-300" />}
        />
        <MetricCard
          label="Overdue tasks"
          value={stats.overdueTasks}
          accent="from-rose-500/20 to-rose-500/5"
          icon={<AlertTriangle className="h-5 w-5 text-rose-300" />}
        />
        <MetricCard
          label="In progress"
          value={stats.tasksByStatus["In Progress"]}
          accent="from-amber-500/20 to-amber-500/5"
          icon={<RefreshCcw className="h-5 w-5 text-amber-300" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                Task distribution
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Status breakdown
              </h3>
            </div>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={118}
                  paddingAngle={4}
                >
                  {chartData.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "1px solid #1e293b",
                    borderRadius: "16px",
                    background: "#020617",
                    color: "#e2e8f0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {chartData.map((item) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                key={item.name}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-sm text-slate-300">{item.name}</p>
                </div>
                <p className="text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            Recently updated
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Latest task activity
          </h3>

          <div className="mt-6 space-y-3">
            {stats.recentTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-5 py-8 text-sm text-slate-400">
                No task activity yet. Create your first project and add a task to
                populate this view.
              </div>
            ) : (
              stats.recentTasks.map((task) => (
                <div
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                  key={task.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {task.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {task.description || "No description provided."}
                      </p>
                    </div>
                    <Badge className={STATUS_BADGE_STYLES[task.status]}>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Priority: {task.priority}</span>
                    <span className={getDueDateTone(task.dueDate)}>
                      Due: {formatDateLabel(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card className={`bg-gradient-to-br ${accent} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function OverviewState({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
        {subtitle}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </Card>
  );
}
