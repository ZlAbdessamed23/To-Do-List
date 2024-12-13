import { createStore } from "solid-js/store";
import { Task } from "../types/types";
import { getAllTasks } from "../utils/funcs";

export const [taskStore, setTaskStore] = createStore<{
  tasks: Task[];
  refreshTasks: () => void;
}>({
  tasks: [],
  refreshTasks: () => {}
});

setTaskStore("refreshTasks", () => {
  const todos = getAllTasks();
  setTaskStore("tasks", todos);
});