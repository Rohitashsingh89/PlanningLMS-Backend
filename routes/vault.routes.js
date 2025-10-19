import { Router } from 'express';
import { list, create, update, remove } from '../controller/vaultController.js';

const vaultRouter = Router();
vaultRouter.get('/', list);
vaultRouter.post('/', create);
vaultRouter.put('/:id', update);
vaultRouter.delete('/:id', remove);

export default vaultRouter;
