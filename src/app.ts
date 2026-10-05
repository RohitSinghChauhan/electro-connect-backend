import express from 'express';
import cors from 'cors';
import shopRoutes from './routes/shop.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import adminRoutes from './routes/admin.routes';
import learnRoutes from './routes/learn.routes';
import jobRoutes from './routes/job.routes';
import serviceOrderRoutes from './routes/service-order.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/service-orders', serviceOrderRoutes);

app.use(errorHandler);

export default app;