import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import machineRoutes from './routes/machine.routes.js';
import chipRoutes from './routes/chip.routes.js';
import telSystemRoutes from './routes/telsystem.routes.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Para navegadores antigos
};

// Habilita CORS para todas as rotas
app.use(cors(corsOptions));

// Habilita CORS pré-flight para todas as rotas
app.options('*', cors(corsOptions));
app.use(express.json());

// Simple request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Tempo menor para timeout
      socketTimeoutMS: 45000, 
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

connectDB();

app.use('/api/machines', machineRoutes);
app.use('/api/chips', chipRoutes);
app.use('/api/telsystems', telSystemRoutes);

app.get('/', (req, res) => {
  res.send('Inventory API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
