import { Router } from 'express';
import { exportAll, importAll } from '../controller/backupController.js';

const backupRouter = Router();
backupRouter.get('/export', exportAll);
backupRouter.post('/import', importAll);

export default backupRouter;
