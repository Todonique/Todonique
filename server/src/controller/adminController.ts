import { Request, Response, RequestHandler } from 'express';
import { getAllUsers, updateUserRole } from '../repository/adminRepository';
import { config } from '../config';
<<<<<<< HEAD
=======
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getAllUsers, getAllTeams, approveTeamLead, updateUserRole ,resetPassword} from '../repository/adminRepository';
>>>>>>> a7a2229 (Fixed reset passwod fully working)

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    if (config.nodeEnv === 'development') console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRoleHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, role: newRole, currentRole } = req.body;

    const validRoles = ['user', 'team_lead', 'admin'];

    if (!userId || !newRole || !currentRole || isNaN(Number(userId)) || !validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid userId, role, or currentRole' }) as unknown as void;
    }

    const updated = await updateUserRole(Number(userId), currentRole, newRole);

    if (!updated) {
      res.status(400).json({ error: 'Invalid role change or no changes made' });
      return;
    }

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    if (config.nodeEnv === 'development') console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_name, new_password } = req.body;

    if (!user_name || !new_password) {
      res.status(400).json({ error: 'Username and new password are required' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');

    const hashedPassword = await bcrypt.hash(new_password + salt, 12);

    const updated = await resetPassword(user_name, hashedPassword, salt);

    if (!updated) {
      res.status(404).json({ error: 'User not found or password not updated' });
      return;
    }

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    if (config.nodeEnv === 'development') {
      console.error('Error resetting password:', error);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};