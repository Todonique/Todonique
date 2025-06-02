import { CreateTodo, UpdateTodo } from "../models";
import { Request, Response } from 'express';
import { ReadTodo } from "../models/todo";
import { createTodo, getTodo, updateTodo } from "../repository";

export const createTodoHandler = async (req: Request, res: Response) => {
    try{
        const todo: CreateTodo = req.body;
        if (!todo.title || !todo.description || !todo.assigned_to || !todo.team_id || !todo.created_by) {
            res.status(400).json({ error: 'All fields are required' });
        } else {
            const newTodo: ReadTodo | undefined = await createTodo(todo);
            if (!newTodo) {
                res.status(404).json({ error: 'Todo not created' });
            } else{
                res.status(201).json({ message: 'Todo created successfully', todo: newTodo });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTodoHandler = async (req: Request, res: Response) => {
    try{
        const todo: UpdateTodo = req.body;
        const { todo_id } = req.params;
        if (!todo.status && !todo.assigned_to && !todo.title && !todo.description && !todo_id) {
            res.status(400).json({ error: 'All fields are required' });
        } else if (isNaN(Number(todo_id))) {
            res.status(400).json({ error: 'Todo ID must be a number' });
        } else{
            const updatedTodo: ReadTodo | undefined = await updateTodo(Number(todo_id), todo);
            if (!updatedTodo) {
                res.status(404).json({ error: 'Todo not updated' });
            } else{
                res.status(200).json({ message: 'Todo updated successfully', updatedTodo });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTodoHandler = async (req: Request, res: Response) => {
    try{
        const { todoId } = req.params;
        if (!todoId) {
            res.status(400).json({ error: 'Todo ID is required' });
        } else if (isNaN(Number(todoId))) {
            res.status(400).json({ error: 'Todo ID must be a number' });
        } else{
            const todo: ReadTodo | undefined = await getTodo(Number(todoId));
            if (!todo) {
                res.status(404).json({ error: 'Todo not found' });
            } else{
                res.status(200).json({ message: 'Todo retrieved successfully', todo });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}