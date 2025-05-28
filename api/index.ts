// api/index.ts
import express from 'express';
import { AppDataSource } from './persistence/data-source'; // ⬅️ importa el DataSource
import damsRoutes from './controllers/damsController';
import healthRoutes from './controllers/healthController';
import levelRoutes from './controllers/levelController';

import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
dotenv.config();

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos inicializada correctamente');

    const app = express();
    app.use(express.json());

    // Rutas
    app.use('/health', healthRoutes);
    app.use('/dams', damsRoutes);
    app.use('/level', levelRoutes);

    // Middleware global de errores
    app.use(errorHandler);

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo inicializar la base de datos:', error);
  }
};

startServer();