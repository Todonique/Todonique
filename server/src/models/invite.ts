import { pool } from '../config/pool';


export type Invite = {
  id: number;
  team_id: number;
  teamName: string;
  invited_user_id: number;
  invited_by: number;
  statusId: number;
  status: string; // Use `statusName` for clarity
  created_at: Date;       // Use `Date` if parsing to Date object
  responded_at: string | null;
};

export class InviteModel {
  static async getInvites(userId: number): Promise<Invite[]> {
    console.log('Fetching invites for user bruuuh:', userId);
    const query = `
      SELECT 
        ti.id, 
        t.team_id, 
        t.name AS teamName,
        ti.invited_user_id, 
        ti.invited_by, 
        ti.status AS statusId, 
        tis.team_invite_status_name AS status,
        ti.created_at, 
        ti.responded_at
      FROM team_invites ti
      INNER JOIN team_invite_status tis ON tis.team_invite_status_id = ti.status
      INNER JOIN teams t ON ti.team_id = t.team_id
        WHERE 
        ti.invited_user_id = $1 AND ti.status = 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async updateInviteStatus(inviteId: number, status: number): Promise<void> {
    console.log(`Updating invite status for invite ID ${inviteId} to status ${status}`);
    const query = `
      UPDATE team_invites 
      SET status = $1, responded_at = CURRENT_DATE
      WHERE id = $2
    `;
    await pool.query(query, [status, inviteId]);
  }

  static async sendTeamInvite(
    teamId: number,
    invitedUserId: number,
    invitedBy: number
  ): Promise<void> {
    const query = `
      INSERT INTO team_invites (team_id, invited_user_id, invited_by, status, created_at)
      VALUES ($1, $2, $3, 1, CURRENT_DATE)
    `;
    await pool.query(query, [teamId, invitedUserId, invitedBy]);
  }

  static async getInviteStatuses(): Promise<any[]> {
    const query = `
      SELECT team_invite_status_id AS id, team_invite_status_name AS statusname 
      FROM team_invite_status
    `;
    const result = await pool.query(query);
    return result.rows; 
  }   
}