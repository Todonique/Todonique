import { CreateTodo, UpdateTodo } from "../models";
import { Request, Response } from 'express';
import { ReadTodo } from "../models/todo";
import { createTodo, updateTodo } from "../repository";
import { getTodoByIdIfInTeam, getTodosByTeam, getTodosByUserInTeam } from "../repository/todoRepository";
import { config } from "../config";

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
                res.status(201).json(newTodo);
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving teams for user:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTodoHandler = async (req: Request, res: Response) => {
    try{
        const todo: UpdateTodo = req.body;
        const todoId = req.params.todoId;
        if (!todo.status || !todo.assigned_to || !todo.title || !todo.description || !todoId) {
            res.status(400).json({ error: 'All fields are required' });
        } else if (isNaN(Number(todoId))) {
            res.status(400).json({ error: 'Todo ID must be a number' });
        } else{
            const updatedTodo: ReadTodo | undefined = await updateTodo(Number(todoId), todo);
            if (!updatedTodo) {
                res.status(404).json({ error: 'Todo not updated' });
            } else{
                res.status(200).json(updatedTodo);
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving teams for user:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTodosByUserInTeamHandler = async (req: Request, res: Response) => {
    try{
        const userId = req.params.userId || res.locals.user?.userId;
        const teamId = req.params.teamId;
        if (!userId || !teamId) {
            res.status(400).json({ error: 'All fields are required' });
        } else if (isNaN(Number(userId)) || isNaN(Number(teamId))) {
            res.status(400).json({ error: 'User ID and team ID must be numbers' });
        } else{
            const todos: ReadTodo[] = await getTodosByUserInTeam(Number(userId), Number(teamId));
            res.status(200).json(todos);
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving teams for user:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTodosByTeamHandler = async (req: Request, res: Response) => {
    try{
        const userId = req.params.userId || res.locals.user?.userId;
        const teamId = req.params.teamId;
        if (!userId || !teamId) {
            res.status(400).json({ error: 'All fields are required' });
        } else if (isNaN(Number(userId)) || isNaN(Number(teamId))) {
            res.status(400).json({ error: 'User ID and team ID must be numbers' });
        } else{
            const todos: ReadTodo[] = await getTodosByTeam(Number(teamId), Number(userId));
            res.status(200).json(todos);
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving teams for user:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTodoByIdHandler = async (req: Request, res: Response) => {
    try{
        const userId = req.params.userId || res.locals.user?.userId;
        const todoId = req.params.todoId;
        if (!userId || !todoId) {
            res.status(400).json({ error: 'All fields are required' });
        } else if (isNaN(Number(userId)) || isNaN(Number(todoId))) {
            res.status(400).json({ error: 'User ID and todo ID must be numbers' });
        } else{
            const todo: ReadTodo = await getTodoByIdIfInTeam(Number(todoId), Number(userId));
            res.status(200).json(todo);
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving teams for user:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}
