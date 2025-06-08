import express from 'express';
import { createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler } from '../controller';
import { authorize } from '../middleware';
import { getTodoByIdHandler, getTodosByTeamHandler } from '../controller/todoController';

const router = express.Router();

router.post('/todo', authorize('user'), createTodoHandler);
router.patch('/todo/:todoId', authorize('user'), updateTodoHandler);
router.patch('/todo/:todoId', authorize('teamlead'), updateTodoHandler);
router.get('/todos/team/:teamId', authorize('user'), getTodosByUserInTeamHandler);
router.get('/todo/:userId/team/:teamId', authorize('teamlead'), getTodosByUserInTeamHandler);
router.get('/todo/team/:teamId', authorize('user'), getTodosByTeamHandler);

export default router;