import express from 'express';
import { createTodoHandler, updateTodoHandler, deleteTodoHandler, getTodoHandler } from '../controller';

const router = express.Router();

router.post('/', createTodoHandler);
router.put('/:todoId', updateTodoHandler);
router.delete('/:todoId', deleteTodoHandler);
router.get('/:todoId', getTodoHandler);

export default router;