import express from 'express';
import { createIssue } from './issues.controller';
import { authenticateToken } from '../../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createIssue);

export default router;
