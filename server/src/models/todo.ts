export type TodoStatus = 'pending' | 'completed' | 'in_progress';

export type Todo = {
    id: number;
    title: string;
    description: string;
    status: TodoStatus;
    createdAt: Date;
    updatedAt: Date;
    assignedTo: number;
}

export type CreateTodo = Omit<Todo, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'assignedTo'>;
export type UpdateTodo = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
export type ReadTodo = Omit<Todo, 'assignedTo'>;
