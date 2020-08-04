import { Router } from 'express';
import { signIn, signUp, refresh } from '../controllers/LoginController';
import authenticate from '../middlewares/authenticate';

const router = Router();

// POST: /signup
router.post('/signup', signUp);
// POST: /signin
router.post('/signin', signIn);
// GET: /refresh
router.get('/refresh', authenticate, refresh);

export default router;
