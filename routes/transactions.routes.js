import { Router } from 'express';
import { list, create, remove } from '../controller/transactionsController.js';

const transactionsRouter = Router();
transactionsRouter.get('/', list);
transactionsRouter.post('/', create);
transactionsRouter.delete('/:id', remove);

export default transactionsRouter;
