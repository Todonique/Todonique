import express from 'express';
import { createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler } from '../controller';
import { authorize } from '../middleware';
import { getTodoByIdHandler, getTodosByTeamHandler } from '../controller/todoController';

const router = express.Router();

router.post('/todo', authorize(['user', 'team_lead']), createTodoHandler);
router.patch('/todo/:todoId', authorize(['user', 'team_lead']), updateTodoHandler);
router.get('/todos/team/:teamId', authorize(['user']), getTodosByUserInTeamHandler);
router.get('/todo/:userId/team/:teamId', authorize(['team_lead']), getTodosByUserInTeamHandler);
router.get('/todo/team/:teamId', authorize(['user', 'team_lead']), getTodosByTeamHandler);
router.get('/todo/:todoId', authorize(['user', 'team_lead']), getTodoByIdHandler);

export default router;