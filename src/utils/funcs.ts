import { TaskType, Task } from "../types/types";

export function getStoredTasks(): Task[] {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
};

export function saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

export function deleteAllTasks() {
    localStorage.removeItem("tasks");
};

export function addTask(task: Task): void {
    const tasks = getStoredTasks();
    tasks.push(task);
    saveTasks(tasks);
};

export function getTasks(taskType: TaskType): Task[] {
    const tasks = getStoredTasks();
    return tasks.filter(task => task.type === taskType);
};

export function deleteTasks(taskType: TaskType): void {
    const tasks = getStoredTasks();
    const filteredTasks = tasks.filter(task => task.type !== taskType);
    saveTasks(filteredTasks);
};

export function deleteTaskById(id: string): void {
    const tasks = getStoredTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
};

export function getTaskById(id: string): Task | undefined {
    const tasks = getStoredTasks();
    return tasks.find(task => task.id === id);
};

export function getAllTasks(): Task[] {
    return getStoredTasks();
};

export function changeStatus(taskId: string): void {
    const tasks = getStoredTasks();
    const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isDone: !task.isDone } : task
    );
    saveTasks(updatedTasks);
}

export function updateTask(updatedTask: Task): void {
    const tasks = getStoredTasks();
    const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
    );
    saveTasks(updatedTasks);
}