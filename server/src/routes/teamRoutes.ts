import express from 'express';
import { createTeamHandler, updateTeamHandler, deleteTeamHandler, getTeamsForTodoUserHandler, insertTeamMemberHandler, getTeamMembersHandler } from '../controller';
import { authorize } from '../middleware';
import { getTeamsForTeamLeadHandler } from '../controller/teamController';

const router = express.Router();

router.post('/team',  authorize(['team_lead']), createTeamHandler);
router.patch('/team/:teamId', authorize(['team_lead']), updateTeamHandler);
router.delete('/team/:teamId', authorize(['team_lead']), deleteTeamHandler);
router.get('/teams', authorize(['user', 'team_lead']), getTeamsForTodoUserHandler);
router.get('/team/:teamId', authorize(['user', 'team_lead']), getTeamsForTodoUserHandler);
router.get('/team/teamlead', authorize([ 'team_lead']), getTeamsForTeamLeadHandler);
router.post('/team/:teamId/member/:userId', authorize(['team_lead']), insertTeamMemberHandler);
router.get('/team/:teamId/members',  authorize(['user', 'team_lead']), getTeamMembersHandler);

export default router;