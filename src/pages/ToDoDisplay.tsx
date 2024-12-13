import { useNavigate, useSearchParams } from "@solidjs/router";
import { changeStatus, deleteTaskById, getTaskById } from "../utils/funcs";
import { Task, TaskType, RepetetiveTask, DeadlineTask, SpeceficTimeTask } from "../types/types";
import UpdateTaskModal from "../components/UpdateTaskModal";
import { createSignal } from "solid-js";

const ToDoDisplay = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.id;
    const taskType = searchParams.type as TaskType;
    const [isOpen, setIsOpen] = createSignal(false);
    const task = taskId ? getTaskById(taskId as string) : undefined;

    const isDeadlineTask = (task: Task): task is DeadlineTask => task.type === "with-deadline";
    const isSpecificTimeTask = (task: Task): task is SpeceficTimeTask => task.type === "with-specefic-time";
    const isRepetetiveTask = (task: Task): task is RepetetiveTask => task.type === "repetetive";

    function handleDelete() {
        deleteTaskById(task?.id as string);
        navigate("/todos");
    };

    function handleChangeStatus() {
        changeStatus(task?.id as string);
        window.location.reload();
    };

    function handleUpdate() {
        setIsOpen(true);
    };

    if (!task || task.type !== taskType) {
        return (
            <div class="h-screen flex items-center justify-center">
                <div class="alert alert-error shadow-lg">
                    <div>
                        <span>No task found with the given ID and type.</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div class="h-screen w-screen pt-10">
            <div class="w-7/12 mx-auto p-6 shadow-lg rounded-lg bg-neutral">
                <h1 class="text-3xl font-bold text-primary mb-4">Task Details</h1>

                <div class="pl-4">
                    <div class="mb-4 flex items-center gap-4">
                        <h2 class="text-xl font-semibold text-secondary-content">Title:</h2>
                        <p class="text-lg font-medium">{task.title}</p>
                    </div>

                    <div class="mb-4 flex items-center gap-4">
                        <h2 class="text-xl font-semibold text-secondary-content">Description:</h2>
                        <p class="text-lg font-medium">{task.description}</p>
                    </div>

                    <div class="mb-4 flex items-center gap-4">
                        <h2 class="text-xl font-semibold text-secondary-content">Status:</h2>
                        <p class="text-lg font-medium">
                            {task.isDone ? (
                                <span class="badge badge-success">Completed</span>
                            ) : (
                                <span class="badge badge-warning">Pending</span>
                            )}
                        </p>
                    </div>

                    <div class="mb-4 flex items-center gap-4">
                        <h2 class="text-xl font-semibold text-secondary-content">Type:</h2>
                        <p class="text-lg font-medium">{task.type}</p>
                    </div>

                    {isDeadlineTask(task) && (
                        <div class="mb-4 flex items-center gap-4">
                            <h2 class="text-xl font-semibold text-secondary-content">Deadline:</h2>
                            <p class="text-lg font-medium">{new Date(task.deadline).toLocaleString()}</p>
                        </div>
                    )}

                    {isSpecificTimeTask(task) && (
                        <div class="mb-4 flex items-center gap-4">
                            <h2 class="text-xl font-semibold text-secondary-content">Specific Date:</h2>
                            <p class="text-lg font-medium">{new Date(task.specificDate).toLocaleString()}</p>
                        </div>
                    )}

                    {isRepetetiveTask(task) && (
                        <>
                            <div class="mb-4 flex items-center gap-4">
                                <h2 class="text-xl font-semibold text-secondary-content">Reminder Date:</h2>
                                <p class="text-lg font-medium">{new Date(task.remindDate).toLocaleString()}</p>
                            </div>
                            <div class="mb-4 flex items-center gap-4">
                                <h2 class="text-xl font-semibold text-secondary-content">Reminder Time:</h2>
                                <p class="text-lg font-medium">{task.remindTime}</p>
                            </div>
                        </>
                    )}
                </div>

                <div class="mt-6 flex gap-4 justify-end">
                    <button class="btn btn-error" onclick={handleDelete}>Delete</button>
                    <button class="btn bg-secondary-content text-black hover:btn-info" onclick={handleChangeStatus}>Change Status</button>
                    <button class="btn btn-secondary" onclick={handleUpdate}>Update</button>
                    <UpdateTaskModal isModalOpen={isOpen} setModalOpen={setIsOpen} task={task} />
                </div>
            </div>
        </div>
    );
};

export default ToDoDisplay;
