export type TodoUser = {
    id: number;
    hash: string;
    salt: string;
    username: string;
    role: string;
};

export type CreateUser = Omit<TodoUser, 'id' | 'role' | 'hash' | 'salt'> & {
    password: string;
};
export type AdminUpdateUser = Omit<TodoUser, 'id' | 'hash' | 'salt'>;
export type UpdateUser = Omit<AdminUpdateUser, 'role'>;
export type ReadUser = Omit<TodoUser, 'hash' | 'salt'>;
