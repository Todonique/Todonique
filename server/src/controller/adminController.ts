import { Request, Response, RequestHandler } from 'express';
import { getAllUsers, updateUserRole } from '../repository/adminRepository';
import { Request, Response, RequestHandler } from 'express';
import { getAllUsers, updateUserRole } from '../repository/adminRepository';
import { config } from '../config';

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    if (config.nodeEnv === 'development') console.error(error);
    if (config.nodeEnv === 'development') console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRoleHandler: RequestHandler = async (req, res): Promise<void> => {
export const updateUserRoleHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, role: newRole, currentRole } = req.body;

    const validRoles = ['user', 'team_lead', 'admin'];

    if (!userId || !newRole || !currentRole || isNaN(Number(userId)) || !validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid userId, role, or currentRole' }) as unknown as void;
    const { userId, role: newRole, currentRole } = req.body;

    const validRoles = ['user', 'team_lead', 'admin'];

    if (!userId || !newRole || !currentRole || isNaN(Number(userId)) || !validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid userId, role, or currentRole' }) as unknown as void;
    }

    const updated = await updateUserRole(Number(userId), currentRole, newRole);

    const updated = await updateUserRole(Number(userId), currentRole, newRole);

    if (!updated) {
      res.status(400).json({ error: 'Invalid role change or no changes made' });
      res.status(400).json({ error: 'Invalid role change or no changes made' });
      return;
    }

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    if (config.nodeEnv === 'development') console.error(error);
    if (config.nodeEnv === 'development') console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
