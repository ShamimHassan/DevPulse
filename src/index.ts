import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './modules/auth/routes/auth.routes';
import issuesRoutes from './modules/issues/routes/issues.routes';
import { errorHandler } from './middleware/error';
import { NotFoundError } from './utils/errors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);

app.use('*', (req, res, next) => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
