import { CreateTodo, UpdateTodo } from "../models";
import { Request, Response } from 'express';
import { ReadTodo } from "../models/todo";
import { createTodo, updateTodo } from "../repository";
import { getTodoById, getTodoByIdIfInTeam, getTodoHistoryByTodoIds, getTodosByTeam, getTodosByUserInTeam, insertTodoUpdateInHistory } from "../repository/todoRepository";
import { config } from "../config";

export const createTodoHandler = async (req: Request, res: Response) => {
    try{
        let todo: CreateTodo = req.body;
        const userId = res.locals.user?.userId;
        todo.created_by = userId;
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
            const currentTodo: ReadTodo | undefined = await getTodoById(Number(todoId));
            if (!currentTodo) {
                res.status(404).json({ error: 'Todo not found' });
            } else{
                const updatedTodo: ReadTodo | undefined = await updateTodo(Number(todoId), todo);
                if (!updatedTodo) {
                    res.status(404).json({ error: 'Todo not updated' });
                } else{
                    await insertTodoUpdateInHistory(currentTodo, updatedTodo, res.locals.user?.userId, res.locals.user?.username);
                    res.status(200).json(updatedTodo);
                }
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

export const getTodoHistoryByTodoIdsHandler = async (req: Request, res: Response) => {
    try{
        const todoIds: number[] = req.body.todoIds;
        if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
            res.status(400).json({ error: 'Todo IDs are required and must be an array' });
        } else if (todoIds.some(id => isNaN(Number(id)))) {
            res.status(400).json({ error: 'All todo IDs must be numbers' });
        } else{
            const todoHistorys = await getTodoHistoryByTodoIds(todoIds);
            res.status(200).json(todoHistorys);
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving todo history:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}