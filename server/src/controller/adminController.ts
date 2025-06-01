import { AdminUpdateUser } from "../models";
import { Request, Response } from 'express';

export const grantUserRoleHandler = async (req: Request, res: Response) => {
    try{
        const { role }: AdminUpdateUser = req.body;
        const { userId } = req.params;
        if (!userId || !role) {
            res.status(400).json({ error: 'All fields are required' });
        } else{
            // grant user role
            const updatedUser: AdminUpdateUser | undefined = undefined // await grant user role
            if (!updatedUser) {
                res.status(404).json({ error: 'User not found' });
            } else{
                res.status(200).json({ message: 'User role granted successfully', updatedUser });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}