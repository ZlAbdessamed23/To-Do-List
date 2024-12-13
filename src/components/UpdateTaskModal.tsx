import { createSignal, Component, Show, Accessor, createEffect } from 'solid-js';
import { IoCloseCircleSharp } from 'solid-icons/io';
import { createForm, requiredValidator } from "solform";
import { BaseTask, DeadlineTask, RepetetiveTask, SpeceficTimeTask, Task, TaskType } from '../types/types';
import { updateTask } from '../utils/funcs';
import toast from 'solid-toast';
import { taskStore } from '../utils/store';

interface UpdateTaskModalProps {
    isModalOpen: Accessor<boolean>;
    setModalOpen: (isOpen: boolean) => void;
    task: Task;
};

const baseForm = createForm<BaseTask>({
    validators: {
        title: requiredValidator("Title is required"),
        description: requiredValidator("Description is required"),
    },
    initialValues: {
        id: "",
        title: "",
        description: "",
        isDone: false,
        type: "basic"
    },
});

const deadlineForm = createForm<DeadlineTask>({
    validators: {
        deadline: requiredValidator("Deadline is required"),
    },
    initialValues: {
        id: "",
        title: "",
        description: "",
        isDone: false,
        deadline: "",
        type: "with-deadline"
    },
});

const specificTimeForm = createForm<SpeceficTimeTask>({
    validators: {
        specificDate: requiredValidator("Specific Date is required"),
    },
    initialValues: {
        id: "",
        title: "",
        description: "",
        isDone: false,
        specificDate: "",
        type: "with-specefic-time"
    },
});

const repetitiveForm = createForm<RepetetiveTask>({
    validators: {
        remindDate: requiredValidator("Remind Date is required"),
        remindTime: requiredValidator("Remind Time is required"),
    },
    initialValues: {
        id: "",
        title: "",
        description: "",
        isDone: false,
        remindDate: "",
        remindTime: "",
        type: "repetetive"
    },
});

const UpdateTaskModal: Component<UpdateTaskModalProps> = (props) => {
    const task = () => props.task;

    const getFormIndexByType = (type: TaskType) => {
        switch (type) {
            case "basic": return 0;
            case "with-deadline": return 1;
            case "with-specefic-time": return 2;
            case "repetetive": return 3;
        };
    };

    const [currentForm, setCurrentForm] = createSignal(0);

    const forms = [
        { component: UpdateBaseTask, label: "Basic" },
        { component: UpdateDeadlineTask, label: "Deadline" },
        { component: UpdateSpeceficTimeTask, label: "Specific Time" },
        { component: UpdateRepetetiveTask, label: "Repetitive" },
    ];

    const closeModal = () => props.setModalOpen(false);

    function handleSubmit() {
        let formValues: Task = { ...props.task };
        switch (currentForm()) {
            case 0:
                formValues = baseForm.getAllValues();
                formValues.type = "basic";
                break;
            case 1:
                formValues = deadlineForm.getAllValues();
                formValues.type = "with-deadline";
                break;
            case 2:
                formValues = specificTimeForm.getAllValues();
                formValues.type = "with-specefic-time";
                break;
            case 3:
                formValues = repetitiveForm.getAllValues();
                formValues.type = "repetetive";
                break;
        };

        updateTask(formValues);
        taskStore.refreshTasks;
        setTimeout(() => {
            toast.success("Task updated successfully", {
                position: "top-center",
                iconTheme: {
                    primary: "oklch(var(--su))",
                    secondary: "oklch(var(--ac))"
                },
                style: {
                    "background-color": "oklch(var(--ac))",
                    color: "oklch(var(--sc))"
                }
            });
        }, 100);
        setTimeout(() => {
            props.setModalOpen(false);
        }, 200);
        window.location.reload();
    };

    createEffect(() => {
        if (task()) {
            setCurrentForm(getFormIndexByType(task().type));
        }
    });

    createEffect(() => {
        if (props.isModalOpen() && task() && task().type) {
            const currentTask = task();
            try {
                switch (currentTask.type) {
                    case "basic":
                        const baseTask = currentTask as BaseTask;
                        baseForm.setValue("id", baseTask.id);
                        baseForm.setValue("title", baseTask.title);
                        baseForm.setValue("description", baseTask.description);
                        baseForm.setValue("isDone", baseTask.isDone);
                        baseForm.setValue("type", baseTask.type);
                        break;
                                 
                    case "with-deadline": {
                        const deadlineTask = currentTask as DeadlineTask;
                        deadlineForm.setValue("id", deadlineTask.id);
                        deadlineForm.setValue("title", deadlineTask.title);
                        deadlineForm.setValue("description", deadlineTask.description);
                        deadlineForm.setValue("isDone", deadlineTask.isDone);
                        deadlineForm.setValue("deadline", deadlineTask.deadline);
                        deadlineForm.setValue("type", deadlineTask.type);
                        break;
                    }

                    case "with-specefic-time": {
                        const specificTask = currentTask as SpeceficTimeTask;
                        specificTimeForm.setValue("id", specificTask.id);
                        specificTimeForm.setValue("title", specificTask.title);
                        specificTimeForm.setValue("description", specificTask.description);
                        specificTimeForm.setValue("isDone", specificTask.isDone);
                        specificTimeForm.setValue("specificDate", specificTask.specificDate);
                        specificTimeForm.setValue("type", specificTask.type);
                        break;
                    }

                    case "repetetive": {
                        const repetitiveTask = currentTask as RepetetiveTask;
                        repetitiveForm.setValue("id", repetitiveTask.id);
                        repetitiveForm.setValue("title", repetitiveTask.title);
                        repetitiveForm.setValue("description", repetitiveTask.description);
                        repetitiveForm.setValue("isDone", repetitiveTask.isDone);
                        repetitiveForm.setValue("remindDate", repetitiveTask.remindDate);
                        repetitiveForm.setValue("remindTime", repetitiveTask.remindTime);
                        repetitiveForm.setValue("type", repetitiveTask.type);
                        break;
                    }
                }
            } catch (error) {
                console.error("Error setting form values:", error);
            };
        };
    }, [props.isModalOpen(), props.task]);

    return (
        <Show when={props.isModalOpen()}>
            <div class="modal modal-open" onClick={closeModal}>
                <div class="modal-box" onClick={(e) => e.stopPropagation()}>
                    <div class='flex items-center justify-between'>
                        <h3 class="font-bold text-lg">Update Task</h3>
                        <IoCloseCircleSharp onClick={closeModal} class='size-7 hover:cursor-pointer' />
                    </div>
                    <div class="mt-4">
                        {forms[currentForm()].component({})}
                    </div>
                    <div class="modal-action">
                        <button class='btn btn-primary' onClick={handleSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </Show>
    );
};

const UpdateBaseTask: Component = () => (
    <form>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Title</span>
            </label>
            <input type="text" class="input input-bordered" {...baseForm.register("title")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Description</span>
            </label>
            <input type="text" class="input input-bordered" {...baseForm.register("description")} />
        </div>
    </form>
);

const UpdateDeadlineTask: Component = () => (
    <form>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Title</span>
            </label>
            <input type="text" class="input input-bordered" {...deadlineForm.register("title")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Description</span>
            </label>
            <input type="text" class="input input-bordered" {...deadlineForm.register("description")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Deadline</span>
            </label>
            <input type="datetime-local" class="input input-bordered" {...deadlineForm.register("deadline")} />
        </div>
    </form>
);

const UpdateSpeceficTimeTask: Component = () => (
    <form>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Title</span>
            </label>
            <input type="text" class="input input-bordered" {...specificTimeForm.register("title")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Description</span>
            </label>
            <input type="text" class="input input-bordered" {...specificTimeForm.register("description")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Specific Date</span>
            </label>
            <input type="datetime-local" class="input input-bordered" {...specificTimeForm.register("specificDate")} />
        </div>
    </form>
);

const UpdateRepetetiveTask: Component = () => (
    <form>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Title</span>
            </label>
            <input type="text" class="input input-bordered" {...repetitiveForm.register("title")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Description</span>
            </label>
            <input type="text" class="input input-bordered" {...repetitiveForm.register("description")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Remind Date</span>
            </label>
            <input type="date" class="input input-bordered" {...repetitiveForm.register("remindDate")} />
        </div>
        <div class="form-control mb-2">
            <label class="label">
                <span class="label-text">Remind Time</span>
            </label>
            <input type="time" class="input input-bordered" {...repetitiveForm.register("remindTime")} />
        </div>
    </form>
);

export default UpdateTaskModal;