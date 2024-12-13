import { createEffect, onCleanup } from "solid-js";
import ToDosTable from "../components/ToDosTable";
import { taskStore } from "../utils/store";
import toast from "solid-toast";
import { RepetetiveTask, SpeceficTimeTask } from "../types/types";

const ToDoList = () => {
  const notifiedTasks = new Set<string>(); // To avoid duplicate notifications

  createEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      taskStore.tasks.forEach((task) => {
        if (task.type === "repetetive") {
          const repetitiveTask = task as RepetetiveTask;
          const remindDate = new Date(repetitiveTask.remindDate);
          const [hours, minutes] = repetitiveTask.remindTime.split(":").map(Number);

          remindDate.setHours(hours, minutes, 0, 0); // Set time to remindDate

          if (
            remindDate.getTime() <= now.getTime() &&
            !notifiedTasks.has(repetitiveTask.id)
          ) {
            notifiedTasks.add(repetitiveTask.id);
            toast.success(`Reminder: ${repetitiveTask.title} (${repetitiveTask.description})`);
          }
        }

        if (task.type === "with-specefic-time") {
          const specificTimeTask = task as SpeceficTimeTask;
          const specificDate = new Date(specificTimeTask.specificDate);

          if (
            specificDate.getTime() <= now.getTime() &&
            !notifiedTasks.has(specificTimeTask.id)
          ) {
            notifiedTasks.add(specificTimeTask.id);
            toast.success(`Reminder: ${specificTimeTask.title} (${specificTimeTask.description})`);
          }
        }
      });
    }, 60000); // Check every 1 minute

    onCleanup(() => clearInterval(interval)); // Clean up interval
  });

  return (
    <div class="h-screen w-screen pt-10">
      <div class="w-7/12 mx-auto">
        <ToDosTable tasks={taskStore.tasks} />
      </div>
    </div>
  );
};

export default ToDoList;
