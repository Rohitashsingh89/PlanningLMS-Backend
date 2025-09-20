import express from 'express';
import {
  createProblem,
  listProblems,
  getProblem,
  updateProblem,
  deleteProblem,
} from '../controller/problem.js';

const router = express.Router();

router.post('/', createProblem);
router.get('/', listProblems);
router.get('/:id', getProblem);
router.patch('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;
