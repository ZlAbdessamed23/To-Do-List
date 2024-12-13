interface BaseTask {
    id: string;
    title: string;
    description: string;
    isDone: boolean;
    type: TaskType;
}

interface DeadlineTask extends BaseTask {
    deadline: Date | string;
}

interface SpeceficTimeTask extends BaseTask {
    specificDate: Date | string;
}

interface RepetetiveTask extends BaseTask {
    remindDate: Date | string;
    remindTime: string;
}

export type TaskType = "basic" | "repetetive" | "with-deadline" | "with-specefic-time"
export type Task = BaseTask | RepetetiveTask | SpeceficTimeTask | DeadlineTask;