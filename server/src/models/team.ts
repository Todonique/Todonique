import { TodoUser } from ".";

export type Team = {
    id: number;
    name: string;
    description: string;
    owner: number;
};

export type TeamMember = Omit<TodoUser, 'hash' | 'salt'>;

export type CreateTeam = Omit<Team, 'id' | 'owner'>;
export type UpdateTeam = Omit<Team, 'id' | 'owner'>;
export type DeleteTeam = Omit<Team, 'id' | 'owner'>;
export type ReadTeam = Omit<Team, 'owner'>;
