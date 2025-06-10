import { Request, Response } from 'express';
import { InviteModel } from '../models/invite';

export const getUserInvitesHandler = async (req: Request, res: Response) => {
    try {
        console.log('Fetching invites for user:', res.locals.user);
        const userId = res.locals.user.userId;
        const invites = await InviteModel.getInvites(userId);
        res.status(200).json(invites);
    } catch (error) {
        console.log(res.locals.user)
        console.error('Error fetching invites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateInviteStatusHandler = async (req: Request, res: Response) => {
    try {
        const {id,status} = req.body;
        console.log(req.body)
        await InviteModel.updateInviteStatus(id, status);
        res.status(200).send();
    } catch (error) {
        console.error('Error updating invites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getInviteStatusHandler = async (req: Request, res: Response) => {
    try {   
        const inviteStatuses = await InviteModel.getInviteStatuses();
        res.status(200).json(inviteStatuses);

    } catch (error) {
        console.error('Error fetching invite status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }   
};

export const sendInviteHandler = async (req: Request, res: Response) => {
    try{
        const {teamId, invitedeUserId, senderId } = req.body;
        await InviteModel.sendTeamInvite(teamId,invitedeUserId,senderId);
        res.status(200).send();
    } catch(error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}