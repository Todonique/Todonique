import { pool } from '../config/pool';
import bcrypt from 'bcrypt';

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

export class UserModel {
    private static readonly SALT_ROUNDS = 12;

    static async createUser(userData: CreateUser): Promise<ReadUser> {
        const { username, password } = userData;
        try {
            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            const hash = await bcrypt.hash(password, salt);
            const query = `
                INSERT INTO users (username, password_hash, password_salt, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING user_id, username, created_at
            `;
            
            const values = [username, hash, salt];
            const result = await pool.query(query, values);
            await this.assignUserRole(result.rows[0].user_id, 3); 
            return result.rows[0];
        } catch (error: any) {
            if (error.code === '23505') {
                if (error.constraint === 'users_username_key') {
                    throw new Error('Username already exists');
                }
            }
            throw error;
        }
    }

    static async findById(id: number): Promise<ReadUser | undefined> {
        const query = 'SELECT id, username, role FROM users u INNER JOIN user_roles ur on ur.user_id = u.user_id  WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByUsername(username: string): Promise<ReadUser | undefined> {
        const query = 'SELECT u.user_id as id, username, role_name FROM users u  INNER JOIN user_roles ur on ur.user_id = u.user_id inner join roles on roles.id = ur.role_id WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    }

    static async findByUsernameWithAuth(username: string): Promise<TodoUser | undefined> {
        const query = `SELECT u.user_id as id, username, password_hash as hash, password_salt, role_name as role
            FROM users u 
            INNER JOIN user_roles ur ON ur.user_id = u.user_id 
            INNER JOIN roles r ON ur.role_id = r.id
            WHERE u.username = $1`;
        const result = await pool.query(query, [username]);
        return result.rows[0];
    }

    static async verifyUser(username: string, password: string): Promise<ReadUser | undefined> {
        const user = await this.findByUsernameWithAuth(username);
        if(user){
            const isValidPassword = await bcrypt.compare(password, user.hash)

            if (isValidPassword) {
                return {
                    id: user.id,
                    username: user.username,
                    role: user.role
                };
            } 
        }
    }

    static async updatePassword(userId: number, newPassword: string): Promise<boolean> {
        const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
        const hash = await bcrypt.hash(newPassword, salt);
        const query = `
            UPDATE users 
            SET password_hash = $1, password_salt = $2
            WHERE id = $3
        `;
        const values = [hash, salt, userId];
        const result = await pool.query(query, values);
        return (result.rowCount ?? 0) > 0;
    }

    static async userExists(username: string): Promise<boolean> {
        const query = 'SELECT 1 FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows.length > 0;
    }

    static async getUserRole(userId: number): Promise<string | null> {
        const query = 'SELECT role FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);
        return result.rows[0]?.role || null;
    }

    static async isAdmin(userId: number): Promise<boolean> {
        const role = await this.getUserRole(userId);
        return role === 'admin';
    }

    static async setTempSecret(userId: number, secret: string): Promise<void> {
        const query = 'UPDATE users SET temp_2fa_secret = $1 WHERE user_id = $2';
        await pool.query(query, [secret, userId]);
    }

    static async getTempSecret(userId: number): Promise<string | undefined> {
        const query = 'SELECT temp_2fa_secret FROM users WHERE user_id = $1';
        const result = await pool.query(query, [userId]);
        return result.rows[0].temp_2fa_secret;
    }

    static async clearTempSecret(userId: number): Promise<void> {
        const query = 'UPDATE users SET temp_2fa_secret = NULL WHERE user_id = $1';
        await pool.query(query, [userId]);
    }

    static async activate2FA(userId: number, secret: string): Promise<void> {
        const query = 'UPDATE users SET two_fa_secret = $1 WHERE user_id = $2';
        await pool.query(query, [secret,userId]);
    }

    static async assignUserRole(user_id: number, role_id: number) : Promise<void>{
        const query = `
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
        `;
        await pool.query(query, [user_id, role_id]);
    }


    static async get2FASecret(userId: number): Promise<string | undefined> {
        try {
            const query = `
                SELECT two_fa_secret 
                FROM users 
                WHERE user_id = $1
            `;
            
            const result = await pool.query(query, [userId]);
            
            return result.rows[0].two_fa_secret;    
        } catch (error) {
            console.error('Error checking 2FA status:', error);
        }
    }

    static async disable2FA(userId: number): Promise<void> {
       const query = 'UPDATE users SET two_fa_secret = NULL WHERE user_id = $1';
        await pool.query(query, [userId]);
    }

    static async has2FA(userId: number): Promise<boolean> {
    try {
        const query = `
            SELECT u.two_fa_secret 
            FROM users u 
            WHERE u.user_id = $1
        `;
        
        const result = await pool.query(query, [userId]);
        
        if (result && result.rows.length > 0) {
            const twoFactorSecret = result.rows[0].two_factor_secret;
            return twoFactorSecret !== null && twoFactorSecret !== undefined && twoFactorSecret.trim() !== '';
        }
        
        return false;
    } catch (error) {
        console.error('Error checking 2FA status:', error);
        return false;
    }
}
}

export const userModel = {
    createUser: UserModel.createUser.bind(UserModel),
    findById: UserModel.findById.bind(UserModel),
    findByUsername: UserModel.findByUsername.bind(UserModel),
    findByUsernameWithAuth: UserModel.findByUsernameWithAuth.bind(UserModel),
    verifyUser: UserModel.verifyUser.bind(UserModel),
    updatePassword: UserModel.updatePassword.bind(UserModel),
    userExists: UserModel.userExists.bind(UserModel),
    getUserRole: UserModel.getUserRole.bind(UserModel),
    isAdmin: UserModel.isAdmin.bind(UserModel)
};

