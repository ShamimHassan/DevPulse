import express from 'express';
import { createIssue, getAllIssues, getSingleIssue } from '../controllers/issues.controller';
import { authenticateToken } from '../../../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createIssue);
router.get('/', getAllIssues);
router.get('/:id', getSingleIssue);

export default router;
