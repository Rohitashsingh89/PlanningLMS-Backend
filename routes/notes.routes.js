import { Router } from 'express';
import { list, create, update, remove } from '../controller/notesController.js';

const notesRouter = Router();
notesRouter.get('/', list);
notesRouter.post('/', create);
notesRouter.put('/:id', update);
notesRouter.delete('/:id', remove);

export default notesRouter;
