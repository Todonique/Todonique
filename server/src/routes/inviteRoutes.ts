import express from 'express';
import { authorize } from '../middleware';
import { getUserInvitesHandler, updateInviteStatusHandler, getInviteStatusHandler, sendInviteHandler } from '../controller/invitesController';

const router = express.Router();

router.get('', authorize(['user']), getUserInvitesHandler);
router.post('/', authorize(['user']), updateInviteStatusHandler);
router.get('/statuses', getInviteStatusHandler);
router.post('/user-invite', authorize(['team_lead']), sendInviteHandler);

export default router;