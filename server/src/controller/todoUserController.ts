import { AdminUpdateUser, ReadUser } from "../models";
import { Request, Response } from 'express';
import { UserModel } from "../models/user";

export const getTodoUserHandler = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
        } else{
            // get todo user
            const todoUser: ReadUser | undefined = undefined // await get todo user
            if (!todoUser) {
                res.status(404).json({ error: 'Todo user not found' });
            } else{
                res.status(200).json({ message: 'Todo user retrieved successfully', todoUser });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const findUsersBySearchHandler = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText;
        const users = await UserModel.findUsersBySearch(searchText);
        res.status(200).json(users);
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}