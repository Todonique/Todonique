export type TodoStatus = 'pending' | 'completed' | 'in_progress' | 'blocked';

export type Todo = {
    todo_id: number;
    title: string;
    description: string;
    status: TodoStatus;
    created_at: Date;
    assigned_to: number;
    assigned_name: string;
    created_by: number;
    created_by_name: string;
    team_id: number;
    team_name: string;
}

export type CreateTodo = Omit<Todo, 'todo_id' | 'created_at' | 'assigned_name' | 'created_by_name' | 'team_name' | 'status'>;
export type UpdateTodo = Omit<Todo, 'todo_id' | 'created_at' | 'assigned_name' | 'created_by' |'created_by_name' | 'team_id' | 'team_name'>;
export type ReadTodo = Todo;
