import express from 'express';
import { createTodoHandler, updateTodoHandler, getTodosByUserInTeamHandler } from '../controller';

const router = express.Router();

router.post('/', createTodoHandler);
router.put('/:todoId', updateTodoHandler);
router.get('/user/:userId/team/:teamId', getTodosByUserInTeamHandler);

export default router;