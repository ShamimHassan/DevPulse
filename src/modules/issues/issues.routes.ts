import express from 'express';
import { createIssue, getAllIssues } from './issues.controller';
import { authenticateToken } from '../../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createIssue);
router.get('/', getAllIssues);

export default router;
