import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productsRouter from './routes/products.js';
import suppliersRouter from './routes/suppliers.js';
import salesRouter from './routes/sales.js';
import usersRouter from './routes/users.js';
import { setupSwagger } from './swagger.js';
dotenv.config();
const app = express();

// Global error handlers so crashes are logged to stdout/stderr for Render
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  // give a short delay to ensure the log is flushed
  setTimeout(() => process.exit(1), 100);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason && reason.stack ? reason.stack : reason);
  setTimeout(() => process.exit(1), 100);
});

// Attempt DB connect but don't block server start indefinitely — allows logs to surface
connectDB({ maxRetries: 6, baseDelay: 2000 }).catch((err) => {
  console.error('connectDB failed (will keep server running):', err && err.message ? err.message : err);
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/products', productsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/sales', salesRouter);
app.use('/api/users', usersRouter);
setupSwagger(app);
app.get('/', (req, res) => {
  res.send('Pharmaceutical Inventory Management System API');
});
const PORT = process.env.PORT || 4321;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
