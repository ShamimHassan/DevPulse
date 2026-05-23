import { Request, Response, NextFunction } from 'express';
import pool from '../../config/database';
import { successResponse } from '../../utils/response';
import { BadRequestError } from '../../utils/errors';
import { CreateIssueRequest, Issue } from '../../types';

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, type }: CreateIssueRequest = req.body;
    const reporterId = req.user?.id;

    if (!title || !description || !type) {
      throw new BadRequestError('Title, description, and type are required');
    }

    if (title.length > 150) {
      throw new BadRequestError('Title must be 150 characters or less');
    }

    if (description.length < 20) {
      throw new BadRequestError('Description must be at least 20 characters');
    }

    if (type !== 'bug' && type !== 'feature_request') {
      throw new BadRequestError('Type must be either bug or feature_request');
    }

    const result = await pool.query(
      'INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, type, reporterId]
    );

    const issue: Issue = result.rows[0];

    res.status(201).json(successResponse(issue, 'Issue created successfully'));
  } catch (error) {
    next(error);
  }
};
