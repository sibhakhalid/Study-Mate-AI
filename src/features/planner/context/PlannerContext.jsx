import { createContext, useCallback, useEffect, useState } from "react";
import * as plannerService from "../services/plannerService";
import { useAuth } from "../../auth/context/useAuth";

export const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskResult, goalResult] = await Promise.all([
        plannerService.getTasks(),
        plannerService.getGoals(),
      ]);
      setTasks(taskResult);
      setGoals(goalResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // See NotesContext for why this waits for auth — same global-mount concern.
  useEffect(() => {
    if (initializing) return;
    if (firebaseUser) {
      load();
    } else {
      setTasks([]);
      setGoals([]);
      setLoading(false);
    }
  }, [firebaseUser, initializing, load]);

  const addTask = useCallback(async (data) => {
    const task = await plannerService.createTask(data);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const editTask = useCallback(async (id, updates) => {
    const updated = await plannerService.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await plannerService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback(async (id) => {
    const updated = await plannerService.toggleTaskComplete(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const addGoal = useCallback(async (data) => {
    const goal = await plannerService.createGoal(data);
    setGoals((prev) => [...prev, goal]);
    return goal;
  }, []);

  const removeGoal = useCallback(async (id) => {
    await plannerService.deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return (
    <PlannerContext.Provider
      value={{
        tasks,
        goals,
        loading,
        error,
        reload: load,
        addTask,
        editTask,
        removeTask,
        toggleComplete,
        addGoal,
        removeGoal,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}
