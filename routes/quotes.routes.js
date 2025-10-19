import { Router } from 'express';
import { list, create, random, remove } from '../controller/quotesController.js';

const quotesRouter = Router();
quotesRouter.get('/', list);
quotesRouter.get('/random', random);
quotesRouter.post('/', create);
quotesRouter.delete('/:id', remove);

export default quotesRouter;
