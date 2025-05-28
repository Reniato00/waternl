// api/persistence/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Dam } from '../entities/damModel'; // ajusta si tienes otro path
import { Level } from '../entities/levelModel'; // ajusta si tienes otro path

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true, // 👈 esto crea las tablas automáticamente
  logging: true,
  entities: [Dam, Level], // 👈 asegúrate que tu entidad Dam esté aquí
});
