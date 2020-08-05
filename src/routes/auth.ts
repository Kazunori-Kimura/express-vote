import { Router } from 'express';
import { signIn, signUp, refresh, remove } from '../controllers/LoginController';
import authenticate from '../middlewares/authenticate';

const router = Router();

// POST: /signup
router.post('/signup', signUp);
// POST: /signin
router.post('/signin', signIn);
// GET: /refresh
router.get('/refresh', authenticate, refresh);
// DELETE: /user/:id
router.delete('/user/:id', authenticate, remove);

export default router;
