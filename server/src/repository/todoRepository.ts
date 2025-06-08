import { CreateTodo, ReadTodo, TodoHistory, UpdateTodo } from "../models";
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
            teams.name AS team_name
        FROM inserted_todo
        JOIN todo_status ON inserted_todo.todo_status_id = todo_status.todo_status_id
        LEFT JOIN users ON inserted_todo.assigned_to = users.user_id
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

export async function updateTodo(todoId: number, todo: UpdateTodo): Promise<ReadTodo | undefined> {
    const todoSelection = await pool.query<ReadTodo>(`
        WITH updated_todo AS (
            UPDATE todos
            SET
                title = $1,
                description = $2,
                todo_status_id = (SELECT todo_status_id FROM todo_status WHERE todo_status_name = $3),
                assigned_to = $4
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
            teams.name AS team_name
        FROM updated_todo
        JOIN todo_status ON updated_todo.todo_status_id = todo_status.todo_status_id
        LEFT JOIN users ON updated_todo.assigned_to = users.user_id
        JOIN users AS creator ON updated_todo.created_by = creator.user_id
        JOIN teams ON updated_todo.team_id = teams.team_id
        LIMIT 1
    `, [
        todo.title,
        todo.description,
        todo.status,
        todo.assigned_to,
        todoId
    ]);

    return todoSelection.rows.length > 0 ? todoSelection.rows[0] : undefined;
}

export async function getTodosByUserInTeam(userId: number, teamId: number): Promise<ReadTodo[]> {
    const todoSelection = await pool.query<ReadTodo>(`
        SELECT
            todos.todo_id,
            todos.title,
            todos.description,
            todo_status.todo_status_name AS status,
            todos.created_at,
            todos.assigned_to,
            users.username AS assigned_name,
            todos.created_by,
            creator.username AS created_by_name,
            todos.team_id,
            teams.name AS team_name
        FROM todos
        JOIN todo_status ON todos.todo_status_id = todo_status.todo_status_id
        LEFT JOIN users ON todos.assigned_to = users.user_id
        JOIN users AS creator ON todos.created_by = creator.user_id
        JOIN teams ON todos.team_id = teams.team_id
        WHERE todos.assigned_to = $1 AND todos.team_id = $2
    `, [userId, teamId]);

    return todoSelection.rows;
}

export async function getTodosByTeam(teamId: number, userId: number): Promise<ReadTodo[]> {
    const todoSelection = await pool.query<ReadTodo>(`
        SELECT
            todos.todo_id,
            todos.title,
            todos.description,
            todo_status.todo_status_name AS status,
            todos.created_at,
            todos.assigned_to,
            users.username AS assigned_name,
            todos.created_by,
            creator.username AS created_by_name,
            todos.team_id,
            teams.name AS team_name
        FROM todos
        JOIN todo_status ON todos.todo_status_id = todo_status.todo_status_id
        LEFT JOIN users ON todos.assigned_to = users.user_id
        JOIN users AS creator ON todos.created_by = creator.user_id
        JOIN teams ON todos.team_id = teams.team_id
        JOIN team_members ON teams.team_id = team_members.team_id
        WHERE todos.team_id = $1 AND team_members.user_id = $2
    `, [teamId, userId]);

    return todoSelection.rows;
}

export async function getTodoByIdIfInTeam(todoId: number, userId: number): Promise<ReadTodo> {
    const result = await pool.query<ReadTodo>(`
        SELECT
            todos.todo_id,
            todos.title,
            todos.description,
            todo_status.todo_status_name AS status,
            todos.created_at,
            todos.assigned_to,
            users.username AS assigned_name,
            todos.created_by,
            creator.username AS created_by_name,
            todos.team_id,
            teams.name AS team_name
        FROM todos
        JOIN todo_status ON todos.todo_status_id = todo_status.todo_status_id
        LEFT JOIN users ON todos.assigned_to = users.user_id
        JOIN users AS creator ON todos.created_by = creator.user_id
        JOIN teams ON todos.team_id = teams.team_id
        JOIN team_members ON teams.team_id = team_members.team_id
        WHERE todos.todo_id = $1 AND team_members.user_id = $2
        LIMIT 1
    `, [todoId, userId]);

    return result.rows[0];
}

export async function getTodoById(todoId: number): Promise<ReadTodo | undefined> {
    const result = await pool.query<ReadTodo>(`
        SELECT
            todos.todo_id,
            todos.title,
            todos.description,
            todo_status.todo_status_name AS status,
            todos.created_at,
            todos.assigned_to,
            users.username AS assigned_name,
            todos.created_by,
            creator.username AS created_by_name,
            todos.team_id,
            teams.name AS team_name
        FROM todos
        JOIN todo_status ON todos.todo_status_id = todo_status.todo_status_id
        LEFT JOIN users ON todos.assigned_to = users.user_id
        JOIN users AS creator ON todos.created_by = creator.user_id
        JOIN teams ON todos.team_id = teams.team_id
        WHERE todos.todo_id = $1
        LIMIT 1
    `, [todoId]);

    return result.rows.length > 0 ? result.rows[0] : undefined;
}

export async function insertTodoUpdateInHistory(oldTodo: ReadTodo, newTodo: ReadTodo, updatedById: number, updatedByName: string): Promise<void> {
    await pool.query(`
        INSERT INTO todo_history (
            todo_id,
            updated_by,
            updated_by_name,
            updated_at,
            old_title,
            new_title,
            old_description,
            new_description,
            old_assigned_to,
            old_assigned_name,
            new_assigned_to,
            new_assigned_name,
            old_status,
            new_status
        )
        VALUES (
            $1, 
            $2, 
            $3, 
            CURRENT_TIMESTAMP, 
            $4, 
            $5, 
            $6, 
            $7, 
            $8, 
            $9, 
            $10, 
            $11, 
            $12, 
            $13, 
            $14
        )
    `, [
        oldTodo.todo_id,
        updatedById,
        updatedByName,
        oldTodo.title,
        newTodo.title,
        oldTodo.description,
        newTodo.description,
        oldTodo.assigned_to,
        oldTodo.assigned_name,
        newTodo.assigned_to,
        newTodo.assigned_name,
        oldTodo.status,
        newTodo.status
    ]);
}

export async function getTodoHistoryByTodoIds(todoIds: number[]): Promise<TodoHistory[]> {
    const result = await pool.query<TodoHistory>(`
        SELECT 
            todo_history_id,
            todo_id,
            updated_by,
            updated_by_name,
            updated_at,
            old_title,
            new_title,
            old_description,
            new_description,
            old_assigned_to,
            old_assigned_name,
            new_assigned_to,
            new_assigned_name,
            old_status,
            new_status
        FROM todo_history
        WHERE todo_id = ANY($1)
        ORDER BY updated_at DESC
    `, [todoIds]);

    return result.rows;
}