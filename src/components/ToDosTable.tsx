import { createSignal, For, createEffect, Component } from 'solid-js';
import { Task } from '../types/types';
import AddTaskModal from './AddTaskModal';
import { IoEllipsisVertical, IoTrash, IoPencil, IoEye } from 'solid-icons/io';
import { useNavigate } from '@solidjs/router';
import { deleteTaskById } from '../utils/funcs';

interface TaskTableProps {
  tasks: Task[];
};

const ToDosTable: Component<TaskTableProps> = (props) => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [filteredTasks, setFilteredTasks] = createSignal<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = createSignal<Task[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = createSignal<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = createSignal({ top: 0, left: 0 });

  createEffect(() => {
    setFilteredTasks(
      props.tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery().toLowerCase())
      )
    );
  }, [props.tasks]);

  const handleSelect = (task: Task) => {
    setSelectedTasks((prevSelected) => {
      const isSelected = prevSelected.some((selectedTask) => selectedTask.id === task.id);
      return isSelected ? prevSelected.filter((selectedTask) => selectedTask.id !== task.id) : [...prevSelected, task];
    });
  };

  const toggleDropdown = (id: string, event: MouseEvent) => {
    const { top, left, height } = (event.target as HTMLElement).getBoundingClientRect();
    setDropdownPosition({ top: top + height, left });
    setDropdownOpenId((prevState) => (prevState === id ? null : id));
  };

  return (
    <div class='w-full'>
      <AddTaskModal isModalOpen={isOpen} setModalOpen={setOpen} />
      <div class='w-full flex items-center justify-between mb-4'>
        <input class='input border border-secondary-content w-4/12' type="text" placeholder="Search tasks" value={searchQuery()} onInput={(e) => setSearchQuery(e.currentTarget.value)} />
        <button class='btn btn-primary' onClick={() => setOpen(true)}>Add New Task</button>
      </div>
      <div class='h-[30rem] overflow-y-auto w-[99%] overflow-x-hidden table-wrapper'>
        <table class='w-full rounded-lg p-4'>
          <thead class='h-16 bg-accent-content'>
            <tr class='grid-cols-6 items-center text-start'>
              <th class='text-start px-4'>
                <p class='w-16 overflow-hidden text-ellipsis'>Select</p>
              </th>
              <th class='text-start px-4'>
                <p class='w-32 overflow-hidden text-ellipsis'>Title</p>
              </th>
              <th class='text-start px-4'>
                <p class='w-48 overflow-hidden text-ellipsis'>Description</p>
              </th>
              <th class='text-start px-4'>
                <p class='w-16 overflow-hidden text-ellipsis'>Is Done</p>
              </th>
              <th class='text-start px-4'>
                <p class='w-24 overflow-hidden text-ellipsis'>Type</p>
              </th>
              <th class='text-start px-4'>
                <p class='w-16 overflow-hidden text-ellipsis'>Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={filteredTasks()}>
              {(task, index) => (
                <tr class={`h-12 ${index() % 2 === 0 ? "bg-transparent" : "bg-accent-content"} ${selectedTasks().some((selectedTask) => selectedTask.id === task.id) ? 'opacity-60' : ''}`}>
                  <td class='px-4'>
                    <p class='w-16 overflow-hidden text-ellipsis'>
                      <input class='checkbox size-5 rounded-md checkbox-secondary' type="checkbox" checked={selectedTasks().some((selectedTask) => selectedTask.id === task.id)} onChange={() => handleSelect(task)} />
                    </p>
                  </td>
                  <td class='px-4'>
                    <p class='w-32 overflow-hidden text-ellipsis'>{task.title}</p>
                  </td>
                  <td class='px-4'>
                    <p class='w-48 overflow-hidden text-ellipsis'>{task.description}</p>
                  </td>
                  <td class='px-4'>
                    <p class='w-16 overflow-hidden text-ellipsis'>{task.isDone ? 'Yes' : 'No'}</p>
                  </td>
                  <td class='px-4'>
                    <p class='w-24 overflow-hidden text-ellipsis'>{task.type}</p>
                  </td>
                  <td class='relative px-4'>
                    <div class='dropdown relative'>
                      <button class='btn btn-ghost btn-sm' onClick={(e) => toggleDropdown(task.id, e)}>
                        <IoEllipsisVertical />
                      </button>
                      <div class={` dropdown-menu ${dropdownOpenId() === task.id ? 'block' : 'hidden'} fixed z-10`} style={{ top: `${dropdownPosition().top}px`, left: `${dropdownPosition().left}px` }}>
                        <ul class='menu p-2 shadow rounded-box bg-accent-content'>
                          <li>
                            <button class='flex items-center gap-2 bg-warning' onclick={() => {
                              deleteTaskById(task?.id as string);
                              navigate("/todos");
                            }}>
                              <IoTrash class='mr-2' /> Delete
                            </button>
                          </li>
                          <li>
                            <button class='flex items-center gap-2'>
                              <IoPencil class='mr-2' /> Update
                            </button>
                          </li>
                          <li>
                            <button class='flex items-center gap-2' onclick={() => navigate(`/todos/display?id=${task.id}&type=${task.type}`)}>
                              <IoEye class='mr-2' /> Display
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToDosTable;
