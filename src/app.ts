import express from 'express';
import cors from 'cors';
import shopRoutes from './routes/shop.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());


// For Testing (development)
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running!"
    })
});

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);

app.use(errorHandler);

export default app;