import { Router } from 'express';
import { getTable, saveTable, resetTable, clearTable } from '../controller/tableController.js'; // controllers (plural)

const tableRouter = Router();
tableRouter.get('/', getTable);
tableRouter.put('/', saveTable);
tableRouter.post('/reset', resetTable);
tableRouter.delete('/', clearTable);

export default tableRouter;
