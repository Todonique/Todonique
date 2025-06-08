import { Request, Response } from 'express';
import { RoleModel } from '../models/roles';

export const getRolesHandler = async (req: Request, res: Response) => {
    try{
        const forRegister = req.query.forRegister === 'true';
   
        if(forRegister) {
            const registerableRoles = await RoleModel.getRegisterableRoles();
            res.status(200).json(registerableRoles);
        } else {
            const teamMembers = await RoleModel.getRoles();
            res.status(200).json(teamMembers); 
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
