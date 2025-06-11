import express from 'express';
import { getRolesHandler } from '../controller/roleController';
const router = express.Router();

router.get('', getRolesHandler);

export default router;