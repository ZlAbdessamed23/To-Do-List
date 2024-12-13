import { createSignal, Component, Show, Accessor, createEffect } from 'solid-js';
import { IoCloseCircleSharp } from 'solid-icons/io';
import { createForm, requiredValidator } from "solform";
import { BaseTask, DeadlineTask, RepetetiveTask, SpeceficTimeTask, Task } from '../types/types';
import { addTask } from '../utils/funcs';
import toast from 'solid-toast';
import { taskStore } from '../utils/store';
import { v4 as uuidv4 } from 'uuid';


interface AddTaskModalProps {
  isModalOpen: Accessor<boolean>;
  setModalOpen: (isOpen: boolean) => void;
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

const AddTaskModal: Component<AddTaskModalProps> = (props) => {
  const [currentForm, setCurrentForm] = createSignal(0);

  const forms = [
    { component: AddBaseTask, label: "Basic" },
    { component: AddDeadlineTask, label: "Deadline" },
    { component: AddSpeceficTimeTask, label: "Specific Time" },
    { component: AddRepetetiveTask, label: "Repetitive" },
  ];

  const closeModal = () => props.setModalOpen(false);

  function handleSubmit() {
    let formValues: Task = { title: "", description: "", isDone: false, type: "basic", deadline: "", id: "", remindDate: "", remindTime: "", specificDate: "" };
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
    formValues.id = uuidv4();
    addTask(formValues);
    taskStore.refreshTasks;
    setTimeout(() => {
      toast.success("task added successfully", {
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
    if (props.isModalOpen()) {
      switch (currentForm()) {
        case 0: // Base task form
          baseForm.setValue("id", "");
          baseForm.setValue("title", "");
          baseForm.setValue("description", "");
          baseForm.setValue("isDone", false);
          baseForm.setValue("type", "basic");
          break;

        case 1: // Deadline task form
          deadlineForm.setValue("id", "");
          deadlineForm.setValue("title", "");
          deadlineForm.setValue("description", "");
          deadlineForm.setValue("isDone", false);
          deadlineForm.setValue("deadline", "");
          deadlineForm.setValue("type", "with-deadline");
          break;

        case 2: // Specific time task form
          specificTimeForm.setValue("id", "");
          specificTimeForm.setValue("title", "");
          specificTimeForm.setValue("description", "");
          specificTimeForm.setValue("isDone", false);
          specificTimeForm.setValue("specificDate", "");
          specificTimeForm.setValue("type", "with-specefic-time");
          break;

        case 3: // Repetitive task form
          repetitiveForm.setValue("id", "");
          repetitiveForm.setValue("title", "");
          repetitiveForm.setValue("description", "");
          repetitiveForm.setValue("isDone", false);
          repetitiveForm.setValue("remindDate", "");
          repetitiveForm.setValue("remindTime", "");
          repetitiveForm.setValue("type", "repetetive");
          break;
      }
    }
  }, [props.isModalOpen(), currentForm()]);


  return (
    <Show when={props.isModalOpen()}>
      <div class="modal modal-open" onClick={closeModal}>
        <div class="modal-box" onClick={(e) => e.stopPropagation()}>
          <div class='flex items-center justify-between'>
            <h3 class="font-bold text-lg">Add New Task</h3>
            <IoCloseCircleSharp onClick={closeModal} class='size-7 hover:cursor-pointer' />
          </div>
          <div class="mt-4">
            {forms[currentForm()].component({})}
          </div>
          <div class="modal-action h-20">
            <div class="absolute bottom-4 left-[39%] flex justify-center space-x-4 mt-4">
              {forms.map((_, index) => (
                <button
                  class={`size-4 rounded-full ${currentForm() === index ? 'bg-primary' : 'bg-secondary'}`}
                  onClick={() => setCurrentForm(index)}
                >
                </button>
              ))}
            </div>
            <button class='btn btn-primary' onclick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </Show>
  );
};

const AddBaseTask: Component = () => (

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

const AddDeadlineTask: Component = () => (
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

const AddSpeceficTimeTask: Component = () => (
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
      <input type="datetime-local" class="input input-bordered"{...specificTimeForm.register("specificDate")} />
    </div>
  </form>
);

const AddRepetetiveTask: Component = () => (
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

export default AddTaskModal;
