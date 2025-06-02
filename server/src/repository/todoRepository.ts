import { CreateTodo, ReadTodo, UpdateTodo } from "../models";
import { pool } from "../config";

export async function createTodo(todo: CreateTodo): Promise<ReadTodo | undefined> {
    const todoSelection = await pool.query<ReadTodo>(`
        WITH inserted_todo AS (
            INSERT INTO todos (
                title, 
                description, 
                todo_status_id, 
                created_at, 
                assigned_to, 
                created_by,
                team_id
            )
            VALUES (
                $1,
                $2,
                (SELECT todo_status_id FROM todo_status WHERE todo_status_name = 'in_progress'),
                CURRENT_TIMESTAMP,
                $3,
                $4,
                $5
            )
            RETURNING *
        )
        SELECT 
            inserted_todo.todo_id,
            inserted_todo.title,
            inserted_todo.description,
            todo_status.todo_status_name AS status,
            inserted_todo.created_at,
            inserted_todo.assigned_to,
            users.username AS assigned_name,
            inserted_todo.created_by,
            creator.username AS created_by_name,
            inserted_todo.team_id,
            teams.team_name
        FROM inserted_todo
        JOIN todo_status ON inserted_todo.todo_status_id = todo_status.todo_status_id
        JOIN users ON inserted_todo.assigned_to = users.user_id
        JOIN users AS creator ON inserted_todo.created_by = creator.user_id
        JOIN teams ON inserted_todo.team_id = teams.team_id
        LIMIT 1
    `,
        [
            todo.title,
            todo.description,
            todo.assigned_to,
            todo.created_by,
            todo.team_id
        ]
    );
    return todoSelection.rows.length > 0 ? todoSelection.rows[0] : undefined;
}

export async function getTodo(todoId: number): Promise<ReadTodo | undefined> {
    const todoSelection = await pool.query<ReadTodo>(`
        SELECT
            todo.todo_id,
            todo.title,
            todo.description,
            todo_status.todo_status_name AS status,
            todo.created_at,
            todo.assigned_to,
            users.username AS assigned_name,
            todo.created_by,
            creator.username AS created_by_name,
            todo.team_id,
            teams.team_name
        FROM todos
        JOIN todo_status ON todos.todo_status_id = todo_status.todo_status_id
        JOIN users ON todos.assigned_to = users.user_id
        JOIN users AS creator ON todos.created_by = creator.user_id
        JOIN teams ON todos.team_id = teams.team_id
        WHERE todos.todo_id = $1
        LIMIT 1
    `,
        [todoId]
    );
    return todoSelection.rows.length > 0 ? todoSelection.rows[0] : undefined;
}

export async function updateTodo(todoId: number, todo: UpdateTodo): Promise<ReadTodo | undefined> {
    const todoSelection = await pool.query<ReadTodo>(`
        WITH updated_todo AS (
            UPDATE todos
            SET
                title = $1,
                description = $2,
                todo_status_id = (SELECT todo_status_id FROM todo_status WHERE todo_status_name = $3),
                assigned_to = $4,
            WHERE todo_id = $5
            RETURNING *
        )
        SELECT
            updated_todo.todo_id,
            updated_todo.title,
            updated_todo.description,
            todo_status.todo_status_name AS status,
            updated_todo.created_at,
            updated_todo.assigned_to,
            users.username AS assigned_name,
            updated_todo.created_by,
            creator.username AS created_by_name,
            updated_todo.team_id,
            teams.team_name
        FROM updated_todo
        JOIN todo_status ON updated_todo.todo_status_id = todo_status.todo_status_id
        JOIN users ON updated_todo.assigned_to = users.user_id
        JOIN users AS creator ON updated_todo.created_by = creator.user_id
        JOIN teams ON updated_todo.team_id = teams.team_id
        WHERE updated_todo.todo_id = $5
        LIMIT 1
    `,[
            todo.title,
            todo.description,
            todo.status,
            todo.assigned_to,
            todoId
        ]
    );
    return todoSelection.rows.length > 0 ? todoSelection.rows[0] : undefined;
}


