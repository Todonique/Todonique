export type TodoUser = {
    user_id: number;
    username: string;
    protected_form: string;
    two_fa_secret: string;
    role: string;
};

export type CreateUser = Omit<TodoUser, 'user_id' | 'role' | 'protected_form' | 'two_fa_secret'> & {
    password: string;
};
export type AdminUpdateUser = Omit<TodoUser, 'user_id' | 'protected_form' | 'two_fa_secret' | 'username'>;
export type ReadUser = Omit<TodoUser, 'protected_form' | 'two_fa_secret'>;
