import { Request, Response } from 'express';
import { CreateTeam, ReadTeam, UpdateTeam } from '../models';

export const createTeamHandler = async (req: Request, res: Response) => {
    try{
        const { name, description }: CreateTeam = req.body;

        if (!name || !description) {
            res.status(400).json({ error: 'All fields are required' });
        } else{
            // create team
            const newTeam: ReadTeam | undefined = undefined // await create team
            if (!newTeam) {
                res.status(404).json({ error: 'Team not created' });
            } else{
                res.status(201).json({ message: 'Team created successfully', newTeam });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateTeamHandler = async (req: Request, res: Response) => {
    try{
        const { name, description }: UpdateTeam = req.body;
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteTeamHandler = async (req: Request, res: Response) => {
    try{
        const { teamId } = req.params;
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }