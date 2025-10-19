import { Router } from 'express';
import { list, create, update, remove } from '../controller/logController.js';

const logsRouter = Router();
logsRouter.get('/', list);
logsRouter.post('/', create);
logsRouter.put('/:id', update);
logsRouter.delete('/:id', remove);

export default logsRouter;
