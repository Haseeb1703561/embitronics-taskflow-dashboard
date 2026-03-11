"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PRIORITY_BADGE_STYLES,
  STATUS_BADGE_STYLES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/constants";
import { fetchJson } from "@/lib/fetcher";
import { cn, formatDateLabel, getDueDateTone } from "@/lib/utils";
import type { ProjectSummary, TaskItem, TaskPriority, TaskStatus } from "@/types";

const defaultProjectForm = {
  name: "",
  description: "",
};

const defaultTaskForm = {
  title: "",
  description: "",
  status: "To Do" as TaskStatus,
  priority: "Medium" as TaskPriority,
  dueDate: "",
};

export function ProjectsWorkspace() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [taskForm, setTaskForm] = useState(defaultTaskForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const loadProjects = useCallback(async (preferredProjectId?: string) => {
    try {
      setIsLoadingProjects(true);
      setProjectError(null);
      const payload = await fetchJson<ProjectSummary[]>("/api/projects");
      setProjects(payload);
      setSelectedProjectId((currentValue) => {
        if (
          preferredProjectId &&
          payload.some((project) => project.id === preferredProjectId)
        ) {
          return preferredProjectId;
        }

        if (currentValue && payload.some((project) => project.id === currentValue)) {
          return currentValue;
        }

        return payload[0]?.id ?? null;
      });
    } catch (loadError) {
      setProjectError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load projects.",
      );
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const loadTasks = useCallback(
    async (projectId: string) => {
      try {
        setIsLoadingTasks(true);
        setTaskError(null);

        const params = new URLSearchParams({ projectId });

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        if (priorityFilter !== "all") {
          params.set("priority", priorityFilter);
        }

        const payload = await fetchJson<TaskItem[]>(`/api/tasks?${params.toString()}`);
        setTasks(payload);
      } catch (loadError) {
        setTaskError(
          loadError instanceof Error ? loadError.message : "Unable to load tasks.",
        );
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [priorityFilter, statusFilter],
  );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      return;
    }

    void loadTasks(selectedProjectId);
  }, [loadTasks, selectedProjectId]);

  async function handleProjectSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSavingProject(true);

      const payload = await fetchJson<ProjectSummary>(
        editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects",
        {
          method: editingProjectId ? "PUT" : "POST",
          body: JSON.stringify(projectForm),
        },
      );

      toast.success(
        editingProjectId
          ? "Project updated successfully."
          : "Project created successfully.",
      );
      setProjectForm(defaultProjectForm);
      setEditingProjectId(null);
      await loadProjects(payload.id);
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save the project.",
      );
    } finally {
      setIsSavingProject(false);
    }
  }

  function startProjectEdit(project: ProjectSummary) {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      description: project.description || "",
    });
  }

  async function handleProjectDelete(projectId: string) {
    if (!window.confirm("Delete this project and all of its tasks?")) {
      return;
    }

    try {
      await fetchJson<{ id: string }>(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      toast.success("Project deleted.");
      setEditingProjectId((currentValue) =>
        currentValue === projectId ? null : currentValue,
      );
      setProjectForm(defaultProjectForm);
      await loadProjects();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the project.",
      );
    }
  }

  async function handleTaskSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProjectId) {
      toast.error("Choose a project before creating a task.");
      return;
    }

    try {
      setIsSavingTask(true);

      await fetchJson<TaskItem>(
        editingTaskId ? `/api/tasks/${editingTaskId}` : "/api/tasks",
        {
          method: editingTaskId ? "PUT" : "POST",
          body: JSON.stringify(
            editingTaskId
              ? taskForm
              : {
                  ...taskForm,
                  projectId: selectedProjectId,
                },
          ),
        },
      );

      toast.success(editingTaskId ? "Task updated." : "Task created.");
      setTaskForm(defaultTaskForm);
      setEditingTaskId(null);
      await Promise.all([
        loadTasks(selectedProjectId),
        loadProjects(selectedProjectId),
      ]);
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save the task.",
      );
    } finally {
      setIsSavingTask(false);
    }
  }

  function startTaskEdit(task: TaskItem) {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }

  async function handleQuickTaskUpdate(
    taskId: string,
    updates: Partial<Pick<TaskItem, "status" | "priority">>,
  ) {
    if (!selectedProjectId) {
      return;
    }

    try {
      await fetchJson<TaskItem>(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      await Promise.all([
        loadTasks(selectedProjectId),
        loadProjects(selectedProjectId),
      ]);
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update the task.",
      );
    }
  }

  async function handleTaskDelete(taskId: string) {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    if (!selectedProjectId) {
      return;
    }

    try {
      await fetchJson<{ id: string }>(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      toast.success("Task deleted.");
      setEditingTaskId((currentValue) =>
        currentValue === taskId ? null : currentValue,
      );
      setTaskForm(defaultTaskForm);
      await Promise.all([
        loadTasks(selectedProjectId),
        loadProjects(selectedProjectId),
      ]);
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the task.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                  Projects
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Organize your workspaces
                </h2>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingProjectId(null);
                  setProjectForm(defaultProjectForm);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New
              </Button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleProjectSubmit}>
              <Field label="Project name">
                <Input
                  placeholder="Website redesign"
                  required
                  value={projectForm.name}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      name: event.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Description">
                <Textarea
                  placeholder="Add a short summary of the project scope."
                  value={projectForm.description}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      description: event.target.value,
                    }))
                  }
                />
              </Field>

              <div className="flex flex-wrap gap-3">
                <Button disabled={isSavingProject} type="submit">
                  {isSavingProject
                    ? editingProjectId
                      ? "Saving..."
                      : "Creating..."
                    : editingProjectId
                      ? "Save changes"
                      : "Create project"}
                </Button>
                {editingProjectId ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm(defaultProjectForm);
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Your projects</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Select a project to manage its tasks.
                </p>
              </div>
              <span className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-400">
                {projects.length} total
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {isLoadingProjects ? (
                <PanelState
                  title="Loading projects..."
                  description="Fetching your project list."
                />
              ) : projectError ? (
                <PanelState
                  title="Unable to load projects"
                  description={projectError}
                />
              ) : projects.length === 0 ? (
                <PanelState
                  title="No projects yet"
                  description="Create your first project to begin adding tasks."
                />
              ) : (
                projects.map((project) => {
                  const progress =
                    project.totalTasks === 0
                      ? 0
                      : Math.round(
                          (project.completedTasks / project.totalTasks) * 100,
                        );

                  return (
                    <div
                      className={cn(
                        "rounded-2xl border p-4 transition",
                        selectedProjectId === project.id
                          ? "border-cyan-400/40 bg-cyan-400/8"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700",
                      )}
                      key={project.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          className="flex-1 text-left"
                          onClick={() => setSelectedProjectId(project.id)}
                          type="button"
                        >
                          <p className="text-base font-semibold text-white">
                            {project.name}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {project.description || "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span>{project.totalTasks} tasks</span>
                            <span>{project.completedTasks} completed</span>
                          </div>

                          <div className="mt-4 h-2 rounded-full bg-slate-800">
                            <div
                              className="h-2 rounded-full bg-cyan-400 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </button>

                        <div className="flex gap-2">
                          <button
                            aria-label={`Edit ${project.name}`}
                            className="rounded-xl border border-slate-800 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white"
                            onClick={() => startProjectEdit(project)}
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            aria-label={`Delete ${project.name}`}
                            className="rounded-xl border border-rose-500/20 p-2 text-rose-200 transition hover:bg-rose-500/10"
                            onClick={() => void handleProjectDelete(project.id)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                  Tasks
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {selectedProject ? selectedProject.name : "Select a project"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {selectedProject
                    ? selectedProject.description ||
                      "Manage execution, priorities, and deadlines."
                    : "Choose a project from the left to create and manage tasks."}
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleTaskSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Task title">
                  <Input
                    disabled={!selectedProjectId}
                    placeholder="Finalize API response format"
                    required
                    value={taskForm.title}
                    onChange={(event) =>
                      setTaskForm((currentValue) => ({
                        ...currentValue,
                        title: event.target.value,
                      }))
                    }
                  />
                </Field>

                <Field label="Due date">
                  <Input
                    disabled={!selectedProjectId}
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(event) =>
                      setTaskForm((currentValue) => ({
                        ...currentValue,
                        dueDate: event.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <Field label="Description">
                <Textarea
                  disabled={!selectedProjectId}
                  placeholder="Summarize the work to be completed."
                  value={taskForm.description}
                  onChange={(event) =>
                    setTaskForm((currentValue) => ({
                      ...currentValue,
                      description: event.target.value,
                    }))
                  }
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Status">
                  <Select
                    disabled={!selectedProjectId}
                    value={taskForm.status}
                    onChange={(event) =>
                      setTaskForm((currentValue) => ({
                        ...currentValue,
                        status: event.target.value as TaskStatus,
                      }))
                    }
                  >
                    {TASK_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Priority">
                  <Select
                    disabled={!selectedProjectId}
                    value={taskForm.priority}
                    onChange={(event) =>
                      setTaskForm((currentValue) => ({
                        ...currentValue,
                        priority: event.target.value as TaskPriority,
                      }))
                    }
                  >
                    {TASK_PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button disabled={!selectedProjectId || isSavingTask} type="submit">
                  {isSavingTask
                    ? editingTaskId
                      ? "Saving..."
                      : "Creating..."
                    : editingTaskId
                      ? "Save task"
                      : "Create task"}
                </Button>
                {editingTaskId ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingTaskId(null);
                      setTaskForm(defaultTaskForm);
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Task board</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Filter tasks and update status or priority directly from the list.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | TaskStatus)
                  }
                >
                  <option value="all">All statuses</option>
                  {TASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>

                <Select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value as "all" | TaskPriority)
                  }
                >
                  <option value="all">All priorities</option>
                  {TASK_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {!selectedProjectId ? (
                <PanelState
                  title="No project selected"
                  description="Choose a project to start managing tasks."
                />
              ) : isLoadingTasks ? (
                <PanelState
                  title="Loading tasks..."
                  description="Gathering tasks for the selected project."
                />
              ) : taskError ? (
                <PanelState title="Unable to load tasks" description={taskError} />
              ) : tasks.length === 0 ? (
                <PanelState
                  title="No tasks found"
                  description="Create a task or relax the filters to see more work items."
                />
              ) : (
                tasks.map((task) => (
                  <Card className="border-slate-800 bg-slate-950/60 p-4" key={task.id}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-white">
                            {task.title}
                          </p>
                          <Badge className={STATUS_BADGE_STYLES[task.status]}>
                            {task.status}
                          </Badge>
                          <Badge className={PRIORITY_BADGE_STYLES[task.priority]}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm leading-6 text-slate-400">
                          {task.description || "No description provided."}
                        </p>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            getDueDateTone(task.dueDate),
                          )}
                        >
                          Due: {formatDateLabel(task.dueDate)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          aria-label={`Edit ${task.title}`}
                          className="rounded-xl border border-slate-800 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white"
                          onClick={() => startTaskEdit(task)}
                          type="button"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Delete ${task.title}`}
                          className="rounded-xl border border-rose-500/20 p-2 text-rose-200 transition hover:bg-rose-500/10"
                          onClick={() => void handleTaskDelete(task.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <Select
                        value={task.status}
                        onChange={(event) =>
                          void handleQuickTaskUpdate(task.id, {
                            status: event.target.value as TaskStatus,
                          })
                        }
                      >
                        {TASK_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>

                      <Select
                        value={task.priority}
                        onChange={(event) =>
                          void handleQuickTaskUpdate(task.id, {
                            priority: event.target.value as TaskPriority,
                          })
                        }
                      >
                        {TASK_PRIORITIES.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function PanelState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 px-5 py-8 text-center">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
