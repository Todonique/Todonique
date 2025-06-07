export type Team = {
    teamId: number;
    name: string;
    teamLeadId: number;
    teamLeadName: string;
    createdAt: Date;
};

export type CreateTeam = Omit<Team, 'teamId' | 'createdAt' | 'teamLeadName' | 'joinedAt'>;
export type UpdateTeam = Omit<Team, 'teamId' | 'createdAt' | 'teamLeadId' | 'teamLeadName' | 'joinedAt'>;
export type ReadTeam = Omit<Team, 'joinedAt'>;

export type TeamMember = {
    teamMemberId: number;
    teamId: number;
    teamName: string;
    teamLeadId: number;
    teamLeadName: string;
    userId: number;
    userName: string;
    joinedAt: Date;
};

export type ReadTeamMember = TeamMember;

