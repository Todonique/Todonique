import { pool } from '../config';

export async function getAllUsers() {
  const result = await pool.query(`
    SELECT user_id, username, email, role FROM users ORDER BY user_id
  `);
  return result.rows;
}

export async function updateUserRole(userId: number, currentRole: string, newRole: string): Promise<boolean> {
  if (currentRole === newRole) return false;

  if (currentRole === 'admin' && newRole === 'user') return false;

  const result = await pool.query(`
    UPDATE users SET role = $1
    WHERE user_id = $2 AND role = $3
  `, [newRole, userId, currentRole]);

  return !!result?.rowCount;
}
