import express from 'express';
import { createTeamHandler, updateTeamHandler, deleteTeamHandler, getTeamsForTodoUserHandler, insertTeamMemberHandler, getTeamMembersHandler } from '../controller';
import { authorize } from '../middleware';

const router = express.Router();

router.post('/team',  authorize('teamlead'), createTeamHandler);
router.patch('/team/:teamId', authorize('teamlead'), updateTeamHandler);
router.delete('/team/:teamId', authorize('teamlead'), deleteTeamHandler);
router.get('/teams/:userId', authorize('user'), getTeamsForTodoUserHandler);
router.post('/team/:teamId/member/:userId', authorize('teamlead'), insertTeamMemberHandler);
router.get('/team/:teamId/members',  authorize('user'), getTeamMembersHandler);

export default router;