import { Request, Response, NextFunction } from 'express';
import pool from '../../../config/database';
import { successResponse } from '../../../utils/response';
import { BadRequestError, NotFoundError, ForbiddenError, ConflictError } from '../../../utils/errors';
import { CreateIssueRequest, UpdateIssueRequest, Issue, IssueWithReporter, User } from '../../../types';

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

export const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort = 'newest', type, status } = req.query;

    let query = 'SELECT * FROM issues';
    const params: any[] = [];
    let paramCount = 0;

    const conditions: string[] = [];

    if (type) {
      paramCount++;
      conditions.push(`type = $${paramCount}`);
      params.push(type);
    }

    if (status) {
      paramCount++;
      conditions.push(`status = $${paramCount}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'oldest') {
      query += ' ORDER BY created_at ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);
    const issues: Issue[] = result.rows;

    if (issues.length === 0) {
      return res.status(200).json(successResponse([]));
    }

    const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];
    const reportersResult = await pool.query(
      'SELECT id, name, role FROM users WHERE id = ANY($1)',
      [reporterIds]
    );
    const reportersMap = new Map<number, Pick<User, 'id' | 'name' | 'role'>>();
    reportersResult.rows.forEach((reporter: any) => {
      reportersMap.set(reporter.id, reporter);
    });

    const issuesWithReporters: IssueWithReporter[] = issues.map(issue => {
      const { reporter_id, ...issueWithoutReporterId } = issue;
      return {
        ...issueWithoutReporterId,
        reporter: reportersMap.get(reporter_id) || { id: reporter_id, name: 'Unknown', role: 'contributor' }
      };
    });

    res.status(200).json(successResponse(issuesWithReporters));
  } catch (error) {
    next(error);
  }
};

export const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
    if (issueResult.rows.length === 0) {
      throw new NotFoundError('Issue not found');
    }

    const issue: Issue = issueResult.rows[0];

    const reporterResult = await pool.query(
      'SELECT id, name, role FROM users WHERE id = $1',
      [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0] || { id: issue.reporter_id, name: 'Unknown', role: 'contributor' };

    const { reporter_id, ...issueWithoutReporterId } = issue;
    const issueWithReporter: IssueWithReporter = {
      ...issueWithoutReporterId,
      reporter
    };

    res.status(200).json(successResponse(issueWithReporter));
  } catch (error) {
    next(error);
  }
};

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, type }: UpdateIssueRequest = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
    if (issueResult.rows.length === 0) {
      throw new NotFoundError('Issue not found');
    }

    const issue: Issue = issueResult.rows[0];

    if (userRole !== 'maintainer') {
      if (issue.reporter_id !== userId) {
        throw new ForbiddenError('You can only update your own issues');
      }
      if (issue.status !== 'open') {
        throw new ConflictError('You can only update open issues');
      }
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 0;

    if (title !== undefined) {
      if (title.length > 150) {
        throw new BadRequestError('Title must be 150 characters or less');
      }
      paramCount++;
      updates.push(`title = $${paramCount}`);
      params.push(title);
    }

    if (description !== undefined) {
      if (description.length < 20) {
        throw new BadRequestError('Description must be at least 20 characters');
      }
      paramCount++;
      updates.push(`description = $${paramCount}`);
      params.push(description);
    }

    if (type !== undefined) {
      if (type !== 'bug' && type !== 'feature_request') {
        throw new BadRequestError('Type must be either bug or feature_request');
      }
      paramCount++;
      updates.push(`type = $${paramCount}`);
      params.push(type);
    }

    if (updates.length === 0) {
      throw new BadRequestError('No valid fields to update');
    }

    paramCount++;
    params.push(id);
    const query = `UPDATE issues SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, params);
    const updatedIssue: Issue = result.rows[0];

    res.status(200).json(successResponse(updatedIssue, 'Issue updated successfully'));
  } catch (error) {
    next(error);
  }
};
