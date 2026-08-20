import express from 'express';
import cors from 'cors';
import shopRoutes from './routes/shop.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;