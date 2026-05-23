import express from 'express';
import { createIssue, getAllIssues, getSingleIssue, updateIssue, deleteIssue } from '../controllers/issues.controller';
import { authenticateToken, requireMaintainer } from '../../../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createIssue);
router.get('/', getAllIssues);
router.get('/:id', getSingleIssue);
router.patch('/:id', authenticateToken, updateIssue);
router.delete('/:id', authenticateToken, requireMaintainer, deleteIssue);

export default router;
