export type TodoHistory ={
    todo_history_id: number;
    todo_id: number;
    updated_by: number;
    updated_by_name: string;
    updated_at: Date;
    old_title: string;
    new_title: string;
    old_description: string;
    new_description: string;
    old_assigned_to: number;
    old_assigned_name: string;
    new_assigned_to: number;
    new_assigned_name: string;
    old_status: string;
    new_status: string;
}