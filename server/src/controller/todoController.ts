import { CreateTodo, UpdateTodo } from "../models";
import { Request, Response } from 'express';
import { ReadTodo } from "../models/todo";

export const createTodoHandler = async (req: Request, res: Response) => {
    try{
        const { title, description }: CreateTodo = req.body;
        if (!title || !description) {
            res.status(400).json({ error: 'All fields are required' });
        } else {
            // create todo
            const newTodo: ReadTodo | undefined = undefined // await create todo
            if (!newTodo) {
                res.status(404).json({ error: 'Todo not created' });
            } else{
                res.status(201).json({ message: 'Todo created successfully', newTodo });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTodoHandler = async (req: Request, res: Response) => {
    try{
        const { status, assignedTo, title, description }: UpdateTodo = req.body;
        const { todoId } = req.params;
        if (!status && !assignedTo && !title && !description && !todoId) {
            res.status(400).json({ error: 'All fields are required' });
        } else{
            // update todo
            const updatedTodo: ReadTodo | undefined = undefined // await update todo
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

export const deleteTodoHandler = async (req: Request, res: Response) => {
    try{
        const { todoId } = req.params;
        if (!todoId) {
            res.status(400).json({ error: 'Todo ID is required' });
        } else{
            // delete todo
            const deletedTodo: ReadTodo | undefined = undefined // await delete todo
            if (!deletedTodo) {
                res.status(404).json({ error: 'Todo not deleted' });
            } else{
                res.status(200).json({ message: 'Todo deleted successfully', deletedTodo });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTodoHandler = async (req: Request, res: Response) => {
    try{
        const { todoId } = req.params;
        if (!todoId) {
            res.status(400).json({ error: 'Todo ID is required' });
        } else{
            // get todo
            const todo: ReadTodo | undefined = undefined // await get todo
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