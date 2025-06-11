import express from 'express';
import { authorize } from '../middleware';
import {
  getAllUsersHandler,
  updateUserRoleHandler
} from '../controller/adminController';

const router = express.Router();

router.get('/users', authorize(['admin']), getAllUsersHandler);
router.patch('/user/:id/role', authorize(['admin']), updateUserRoleHandler);

export default router;
