import { Request, Response } from 'express';
import { config } from '../config';
import { getAllUsers, getAllTeams, approveTeamLead, updateUserRole } from '../repository/adminRepository';

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    if (config.nodeEnv === 'development') {
      console.error('Error fetching users:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllTeamsHandler = async (_req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    if (config.nodeEnv === 'development') {
      console.error('Error fetching teams:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approveTeamLeadHandler = async (req: Request, res: Response) => {
  try {
    const { userId, teamId } = req.body;
    if (!userId || !teamId || isNaN(Number(userId)) || isNaN(Number(teamId))) {
      res.status(400).json({ error: 'Valid userId and teamId are required' });
      return;
    }

    const success = await approveTeamLead(Number(userId), Number(teamId));
    if (!success) {
      res.status(404).json({ error: 'User or team not found or already team lead' });
      return;
    }

    res.status(200).json({ message: 'Team lead approved successfully' });
  } catch (error) {
    if (config.nodeEnv === 'development') {
      console.error('Error approving team lead:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRoleHandler = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role || isNaN(Number(userId))) {
      res.status(400).json({ error: 'Valid userId and role are required' });
      return;
    }

    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const updated = await updateUserRole(Number(userId), role);
    if (!updated) {
      res.status(404).json({ error: 'User not found or role unchanged' });
      return;
    }

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    if (config.nodeEnv === 'development') {
      console.error('Error updating user role:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
