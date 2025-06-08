import express from 'express';
import { authorize } from '../middleware';
import {
  getAllUsersHandler,
  getAllTeamsHandler,
  approveTeamLeadHandler,
  updateUserRoleHandler
} from '../controller/adminController';

const router = express.Router();

router.get('/users', authorize('admin'), getAllUsersHandler);
router.get('/teams', authorize('admin'), getAllTeamsHandler);
router.post('/approve-lead', authorize('admin'), approveTeamLeadHandler);
router.post('/update-role', authorize('admin'), updateUserRoleHandler);

export default router;