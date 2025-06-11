import express from 'express';
import { authorize } from '../middleware';
import { findUsersBySearchHandler } from '../controller/todoUserController';

const router = express.Router();

router.get('/:searchText', authorize(['team_lead']), findUsersBySearchHandler);

export default router;