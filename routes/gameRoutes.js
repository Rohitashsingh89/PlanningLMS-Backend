import express from 'express';
import { saveGame, loadGame } from '../controller/gameController.js';

const gameRouter = express.Router();

gameRouter.post('/:id', saveGame);
gameRouter.get('/:id', loadGame);

export default gameRouter;
