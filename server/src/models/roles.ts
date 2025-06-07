import { pool } from '../config/pool';


export type Role = {
    id: number;
    role_name: string;
};

export class RoleModel {
    static async getRoles(): Promise<Role[]> {
       const query = 
        `select 
            id, role_name 
            from roles
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async getRegisterableRoles(): Promise<Role[]> {
       const query = 
        `select 
            id, role_name 
            from roles where role_name != 'admin'
        `;
        const result = await pool.query(query);
        return result.rows;
    }
}