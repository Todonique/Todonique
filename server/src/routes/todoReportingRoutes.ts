import express from 'express';
import { authorize } from '../middleware';
import { getTodoHistoryByTodoIdsHandler } from '../controller';

const router = express.Router();

router.post('/todo/history', authorize(['team_lead']), getTodoHistoryByTodoIdsHandler);

export default router;