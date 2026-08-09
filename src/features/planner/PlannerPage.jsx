import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { usePlanner } from "./hooks/usePlanner";
import PlannerToolbar from "./components/PlannerToolbar";
import DayView from "./components/DayView";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import TaskFormModal from "./components/TaskFormModal";
import UpcomingDeadlines from "./components/UpcomingDeadlines";
import StudyGoalsPanel from "./components/StudyGoalsPanel";
import ProgressSummary from "./components/ProgressSummary";
import { PlannerLoadingState, PlannerErrorState, PlannerEmptyState } from "./components/PlannerStates";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { dateKey, getWeekDays, getMonthGrid } from "./utils/dateHelpers";

export default function PlannerPage() {
  const {
    tasks,
    goals,
    loading,
    error,
    reload,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    addGoal,
    removeGoal,
  } = usePlanner();

  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [taskError, setTaskError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [toggleError, setToggleError] = useState(null);

  const tasksByDate = useMemo(() => {
    const map = {};
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    }
    return map;
  }, [tasks]);

  const dayTasks = tasksByDate[dateKey(selectedDate)] ?? [];
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const monthGrid = useMemo(() => getMonthGrid(selectedDate), [selectedDate]);

  function handleNavigate(direction) {
    if (view === "day") {
      setSelectedDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + direction);
        return d;
      });
    } else if (view === "week") {
      setSelectedDate((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + direction * 7);
        return d;
      });
    } else {
      setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    }
  }

  function handleSelectDay(date) {
    setSelectedDate(date);
    setView("day"); // drill down into the day, standard calendar-app behavior
  }

  function openNewTaskModal() {
    setEditingTask(null);
    setTaskError(null);
    setTaskModalOpen(true);
  }

  function openEditTaskModal(task) {
    setEditingTask(task);
    setTaskError(null);
    setTaskModalOpen(true);
  }

  async function handleSaveTask(formData) {
    setSaving(true);
    setTaskError(null);
    try {
      if (editingTask) {
        await editTask(editingTask.id, formData);
      } else {
        await addTask(formData);
      }
      setTaskModalOpen(false);
    } catch (err) {
      // Without this, a failed save left the modal open with the
      // spinner just stopped — no explanation, indistinguishable from
      // the Save button silently doing nothing.
      setTaskError(err.message || "Couldn't save this task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleteError(null);
    try {
      await removeTask(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      // Same principle: keep the confirmation modal open and explain
      // what happened, rather than an unhandled rejection that leaves
      // the Delete button looking unresponsive.
      setDeleteError(err.message || "Couldn't delete this task. Please try again.");
    }
  }

  function openDeleteConfirm(task) {
    setDeleteError(null);
    setDeleteTarget(task);
  }

  async function handleToggleComplete(taskId) {
    setToggleError(null);
    try {
      await toggleComplete(taskId);
    } catch (err) {
      setToggleError(err.message || "Couldn't update that task. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-medium text-ink">Study Planner</h1>
        <PlannerLoadingState />
      </div>
    );
  }

  if (error) {
    return <PlannerErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-medium text-ink">Study Planner</h1>

      {toggleError && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {toggleError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <PlannerToolbar
            view={view}
            onViewChange={setView}
            selectedDate={selectedDate}
            onNavigate={handleNavigate}
            onToday={() => setSelectedDate(new Date())}
            onNewTask={openNewTaskModal}
          />

          {tasks.length === 0 ? (
            <PlannerEmptyState onNewTask={openNewTaskModal} />
          ) : (
            <>
              {view === "day" && (
                <DayView
                  tasks={dayTasks}
                  onToggleComplete={handleToggleComplete}
                  onEdit={openEditTaskModal}
                  onDelete={openDeleteConfirm}
                />
              )}
              {view === "week" && (
                <WeekView
                  weekDays={weekDays}
                  tasksByDate={tasksByDate}
                  onSelectDay={handleSelectDay}
                  onToggleComplete={handleToggleComplete}
                  onEdit={openEditTaskModal}
                  onDelete={openDeleteConfirm}
                />
              )}
              {view === "month" && (
                <MonthView
                  monthGrid={monthGrid}
                  currentMonth={selectedDate}
                  tasksByDate={tasksByDate}
                  selectedDate={selectedDate}
                  onSelectDay={handleSelectDay}
                />
              )}
            </>
          )}
        </div>

        <div className="space-y-5">
          <ProgressSummary tasks={tasks} />
          <UpcomingDeadlines tasks={tasks} />
          <StudyGoalsPanel goals={goals} onAddGoal={addGoal} onRemoveGoal={removeGoal} />
        </div>
      </div>

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        saving={saving}
        error={taskError}
      />

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <Modal.Header onClose={() => setDeleteTarget(null)}>Delete this task?</Modal.Header>
        <Modal.Body className="space-y-3">
          <p>This action can't be undone.</p>
          {deleteError && (
            <div
              role="alert"
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
            >
              <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
              {deleteError}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
