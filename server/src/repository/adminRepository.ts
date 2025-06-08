import { pool } from '../config';

export async function getAllUsers() {
  const result = await pool.query(`
    SELECT user_id, username, email, role FROM users ORDER BY user_id
  `);
  return result.rows;
}

export async function getAllTeams() {
  const result = await pool.query(`
    SELECT team_id, name, description, created_at FROM teams ORDER BY created_at DESC
  `);
  return result.rows;
}

export async function approveTeamLead(userId: number, teamId: number): Promise<boolean> {
  const result = await pool.query(`
    UPDATE team_members
    SET role = 'team_lead'
    WHERE user_id = $1 AND team_id = $2 AND role != 'team_lead'
  `, [userId, teamId]);

  return result.rowCount != null && result.rowCount > 0;
}

export async function updateUserRole(userId: number, role: 'user' | 'admin'): Promise<boolean> {
  const result = await pool.query(
    `UPDATE users SET role = $1 WHERE user_id = $2 AND role != $1`,
    [role, userId]
  );
  return result.rowCount != null && result.rowCount > 0;
}