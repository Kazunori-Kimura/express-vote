import { Router } from 'express';
import { list, create, remove, vote } from '../controllers/QuestionController';
import authenticate from '../middlewares/authenticate';

const router = Router();

// GET: /question
router.get('/question', list);
// POST: /question
router.post('/question', authenticate, create);
// DELETE: /question/:id
router.delete('/question/:id', authenticate, remove);
// POST: /question/:questionId/choice/:choiceId/vote
router.post('/question/:questionId/choice/:choiceId/vote', authenticate, vote);

export default router;
