import { Router } from 'express';
import userAPI from './user';

const router = Router();

router.use('/', userAPI);

export default router;
