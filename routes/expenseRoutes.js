import express from 'express';
import { body, param } from 'express-validator';
import { createExpense, deleteExpense, listExpenses, updateExpense } from '../controller/expenseController.js';

const expenseRoutes = express.Router();

expenseRoutes.post(
  '/:groupId',
  param('groupId').isMongoId(),
  body('title').isString().trim().isLength({ min: 1 }),
  body('amount').isFloat({ gt: 0 }),
  body('paidBy').isString().trim().isLength({ min: 1 }),
  body('participants').isArray({ min: 1 }),
  createExpense
);

expenseRoutes.get(
  '/:groupId',
  param('groupId').isMongoId(),
  listExpenses
);

expenseRoutes.patch(
  '/:groupId/:expenseId',
  param('groupId').isMongoId(),
  param('expenseId').isMongoId(),
  updateExpense
);

expenseRoutes.delete(
  '/:groupId/:expenseId',
  param('groupId').isMongoId(),
  param('expenseId').isMongoId(),
  deleteExpense
);

export default expenseRoutes;
