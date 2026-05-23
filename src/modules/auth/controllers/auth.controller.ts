import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../../../config/database';
import { successResponse } from '../../../utils/response';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../../utils/errors';
import { UserRequest, User, LoginRequest, JwtPayload } from '../../../types';

dotenv.config();
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const user: User = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password!);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json(successResponse({
      token,
      user: userWithoutPassword
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};
