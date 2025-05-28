import { AppDataSource } from '../persistence/data-source';
import { Level } from '../entities/levelModel';

const levelRepo = AppDataSource.getRepository(Level);

export const levelsRepository = {
    
    async create(damId: number, level: number, timestamp: Date) {
        try{
            const newLevel = levelRepo.create({damId, level, timestamp});
            await levelRepo.save(newLevel);
            return newLevel;
        }catch(err: any){
            console.error('Error al crear el nivel:', err);
            throw new Error('Error al crear el nivel');
        }
    },

    async findAll() {
        try {
            const levels = (await levelRepo.find()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            return levels;
        }catch(err: any) {
            console.error('Error al obtener los niveles:', err);
            throw new Error('Error al obtener los niveles');
        }
    }
};