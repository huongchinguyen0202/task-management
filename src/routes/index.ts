import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

// Mount v1 routes directly at root (remove /v1 prefix)
router.use('/', v1Routes);

export default router;
