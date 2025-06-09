import { Request, Response } from 'express';
import { CreateTeam, ReadTeam, UpdateTeam } from '../models';
import { createTeam, updateTeam, insertTeamMember, deleteTeam, getTeamMembers, getTeamsForTodoUser } from '../repository';
import { ReadTeamMember } from '../models/team';
import { config } from '../config';

export const createTeamHandler = async (req: Request, res: Response) => {
    try{
        const team: CreateTeam = req.body;
        team.teamLeadId = res.locals.user?.userId;

        if(!team) {
            res.status(400).json({ error: 'Team data is required' });
        } else if (!team.name || !team.teamLeadId) {
            res.status(400).json({ error: 'All fields are required' });
        } else{
            const newTeam: ReadTeam | undefined = await createTeam(team);
            if (!newTeam) {
                res.status(404).json({ error: 'Team not created' });
            } else{
                const teamMember: ReadTeamMember | undefined = await insertTeamMember(newTeam.teamId, newTeam.teamLeadId);
                if (!teamMember) {
                    res.status(404).json({ error: 'Team member not created' });
                } else {
                    res.status(200).json({ newTeam, teamMember });
                }
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error creating team:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const insertTeamMemberHandler = async (req: Request, res: Response) => {
    try{
        const { teamId, userId } = req.params;

        if (!teamId || !userId) {
            res.status(400).json({ error: 'teamId and userId are required' });
        } else {
            const teamMember: ReadTeamMember | undefined = await insertTeamMember(parseInt(teamId), parseInt(userId));
            if (!teamMember) {
                res.status(404).json({ error: 'Team member not created' });
            } else {
                res.status(200).json(teamMember);
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error inserting team member:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateTeamHandler = async (req: Request, res: Response) => {
    try{
        const team: UpdateTeam = req.body;
        const { teamId } = req.params;

        if (!team || !teamId) {
            res.status(400).json({ error: 'Team data and teamId are required' });
        } else if (!team.name) {
            res.status(400).json({ error: 'Team name is required' });
        } else {
            const updatedTeam: ReadTeam | undefined = await updateTeam(team, parseInt(teamId));
            if (!updatedTeam) {
                res.status(404).json({ error: 'Team not found or not updated' });
            } else {
                res.status(200).json(updatedTeam);
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error updating team:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteTeamHandler = async (req: Request, res: Response) => {
    try{
        const { teamId } = req.params;
        if (!teamId) {
            res.status(400).json({ error: 'teamId is required' });
        } else {
            const deletedTeam: ReadTeam | undefined = await deleteTeam(parseInt(teamId));
            if (!deletedTeam) {
                res.status(404).json({ error: 'Team not found or not deleted' });
            } else {
                res.status(200).json(deletedTeam);
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error deleting team:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTeamMembersHandler = async (req: Request, res: Response) => {
    try{
        const { teamId } = req.params;

        if (!teamId) {
            res.status(400).json({ error: 'teamId is required' });
        } else {
            // retrieve team members from db
            const teamMembers: ReadTeamMember[] | undefined = await getTeamMembers(parseInt(teamId));
            if (!teamMembers || teamMembers.length === 0) {
                res.status(404).json({ error: 'No team members found' });
            } else {
                res.status(200).json(teamMembers);
            }
        }
    } catch (error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving team members:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTeamsForTodoUserHandler = async (req: Request, res: Response) => {
    try{
        const userId = req.params.userId || res.locals.user?.userId;

        if(!userId){
            res.status(400).json({error: "Missing userId"});
        } else{
            // retrieve team for this user from db
            const teams: ReadTeam[] | undefined = await getTeamsForTodoUser(parseInt(userId));
            if(!teams || teams.length === 0){
                res.status(404).json({error: "No teams found for this user"});
            } else{
                res.status(200).json(teams);
            }
        }
    } catch(error) {
        if(config.nodeEnv === 'development') {
            console.error('Error retrieving teams for user:', error);
        } else{
            // don't log sensitive information in production
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}