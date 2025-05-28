import { levelsRepository } from '../persistence/levelRepository';
import { damRepository } from '../persistence/damRepository';

export const levelService = {
    async createLevel(damId: number, level: number, timestamp: Date) {
        try {
            const dam = await damRepository.findById(damId);

            if(dam === null) {
                throw new Error('Presa no encontrada');
            }

            const newLevel = await levelsRepository.create(damId, level, timestamp);
            console.log('antes de cuatializar');
            if(timestamp > dam.lastUpdate){
                await damRepository.patchLevel(damId, level, timestamp);
            }
            console.log('Presa actualizada con nuevo nivel');
            
            return newLevel;
        } catch (error: any) {
            console.error('Error al crear el nivel:', error);
            throw new Error('Error al crear el nivel');
        }
    },

    async getAll(){
        try {
            const levels = await levelsRepository.findAll();
            return levels;
        } catch (error: any) {
            console.error('Error al obtener todos los niveles:', error);
            throw new Error('Error al obtener todos los niveles');
        }
    }
}
