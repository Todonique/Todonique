import { CreateTeam, ReadTeam, Team, UpdateTeam } from "../models";
import { pool } from "../config";
import { ReadTeamMember } from "../models/team";

export const createTeam = async (team: CreateTeam): Promise<ReadTeam | undefined> => {
    const createdTeam = await pool.query(`
        WITH inserted_team AS (
            INSERT INTO teams (
                name,
                team_lead_id,
                created_at
            )
            VALUES (
                $1, 
                $2, 
                CURRENT_TIMESTAMP
            )
            RETURNING *
        )
        SELECT 
            inserted_team.team_id as "teamId",
            inserted_team.name as "name",
            inserted_team.team_lead_id as "teamLeadId",
            users.username as "teamLeadName",
            inserted_team.created_at as "createdAt"
        FROM inserted_team
        JOIN users ON inserted_team.team_lead_id = users.user_id
        LIMIT 1
    `, [
        team.name,
        team.teamLeadId
    ]);

    return createdTeam.rows.length > 0 ? createdTeam.rows[0] : undefined;
};

export const updateTeam = async (team: UpdateTeam, teamId: number): Promise<ReadTeam | undefined> => {
    const updatedTeam = await pool.query(`
        WITH updated_team AS (
            UPDATE teams
            SET name = $1
            WHERE team_id = $2
            RETURNING *
        )
        SELECT 
            updated_team.team_id as "teamId",
            updated_team.name as "name",
            updated_team.team_lead_id as "teamLeadId",
            users.username as "teamLeadName",
            updated_team.created_at as "createdAt"
        FROM updated_team
        JOIN users ON updated_team.team_lead_id = users.user_id
        LIMIT 1
    `, [
        team.name,
        teamId
    ]);

    return updatedTeam.rows.length > 0 ? updatedTeam.rows[0] : undefined;
};

export const deleteTeam = async (teamId: number): Promise<ReadTeam | undefined> => {
    const deletedTeam = await pool.query(`
        WITH deleted_team AS (
            DELETE FROM teams
            WHERE team_id = $1
            RETURNING *
        )
        SELECT 
            deleted_team.team_id as "teamId",
            deleted_team.name as "name",
            deleted_team.team_lead_id as "teamLeadId",
            users.username as "teamLeadName",
            deleted_team.created_at as "createdAt"
        FROM deleted_team
        JOIN users ON deleted_team.team_lead_id = users.user_id
        LIMIT 1
    `, [teamId]);

    return deletedTeam.rows.length > 0 ? deletedTeam.rows[0] : undefined;
};

export const insertTeamMember = async (teamId: number, userId: number): Promise<ReadTeamMember | undefined> => {
    const teamMember = await pool.query(`
        WITH existing_member AS (
            SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2
        ),
        inserted_member AS (
            INSERT INTO team_members (team_id, user_id, joined_at)
            SELECT $1, $2, CURRENT_TIMESTAMP
            WHERE NOT EXISTS (SELECT 1 FROM existing_member)
            RETURNING *
        ),
        result AS (
            SELECT * FROM inserted_member
            UNION ALL
            SELECT * FROM existing_member
        )
        SELECT 
            result.team_member_id as "teamMemberId",
            result.team_id as "teamId",
            teams.name as "teamName",
            teams.team_lead_id as "teamLeadId",
            users.username as "teamLeadName",
            result.user_id as "userId",
            users.username as "userName",
            result.joined_at as "joinedAt"
        FROM result
        JOIN teams ON result.team_id = teams.team_id
        JOIN users ON result.user_id = users.user_id
        LIMIT 1
    `, [teamId, userId]);

    return teamMember.rows.length > 0 ? teamMember.rows[0] : undefined;
}

export const getTeamMembers = async (teamId: number): Promise<ReadTeamMember[] | undefined> => {
    const teamMembers = await pool.query(`
        SELECT 
            tm.team_member_id as "teamMemberId",
            tm.team_id as "teamId",
            t.name as "teamName",
            t.team_lead_id as "teamLeadId",
            u.username as "teamLeadName",
            tm.user_id as "userId",
            u.username as "userName",
            tm.joined_at as "joinedAt"
        FROM team_members tm
        JOIN teams t ON tm.team_id = t.team_id
        JOIN users u ON tm.user_id = u.user_id
        WHERE tm.team_id = $1
    `, [teamId]);

    return teamMembers.rows.length > 0 ? teamMembers.rows : undefined;
}

export const getTeamsForTodoUser = async (userId: number): Promise<ReadTeam[] | undefined> => {
    const teams = await pool.query(`
        SELECT 
            t.team_id as "teamId",
            t.name as "name",
            t.team_lead_id as "teamLeadId",
            u.username as "teamLeadName",
            t.created_at as "createdAt",
            tm.joined_at as "joinedAt"
        FROM team_members tm
        JOIN teams t ON t.team_id = tm.team_id
        JOIN users u ON tm.user_id = u.user_id
        WHERE tm.user_id = $1
    `, [userId]);

    return teams.rows.length > 0 ? teams.rows : undefined;
};

export const getTeamsForTeamLead = async (userId: number): Promise<ReadTeam[]> => {
    const teams = await pool.query(`
        SELECT 
            team_id as "teamId",
            name,
            team_lead_id as "teamLeadId"
            from teams
		    where team_lead_id = $1
    `, [userId]);
    return teams.rows;
};