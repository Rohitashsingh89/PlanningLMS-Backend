import { Router } from 'express';
import { list, create, update, remove } from '../controller/tasksController.js';

const tasksRouter = Router();
tasksRouter.get('/', list);
tasksRouter.post('/', create);
tasksRouter.put('/:id', update);
tasksRouter.delete('/:id', remove);

export default tasksRouter;
