import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import pool from '../../config/database';
import { successResponse } from '../../utils/response';
import { BadRequestError, ConflictError } from '../../utils/errors';
import { UserRequest, User } from '../../types';

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role = 'contributor' }: UserRequest = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError('Name, email, and password are required');
    }

    if (role && role !== 'contributor' && role !== 'maintainer') {
      throw new BadRequestError('Role must be either contributor or maintainer');
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
      [name, email, hashedPassword, role]
    );

    const user: User = result.rows[0];

    res.status(201).json(successResponse(user, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};
