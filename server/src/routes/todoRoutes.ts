import express from 'express';
import { createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler } from '../controller';
import { authorize } from '../middleware';

const router = express.Router();

router.post('/todo', authorize('user'), createTodoHandler);
router.patch('/todo/:todoId', authorize('user'), updateTodoHandler);
router.get('/todo/:userId/team/:teamId', authorize('user'), getTodosByUserInTeamHandler);

export default router;