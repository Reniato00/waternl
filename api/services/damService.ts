import { damRepository } from '../persistence/damRepository';

export const damService = {
    async getAllDams() {
        try {
            return await damRepository.findAll();
        } catch (err: any) {
            console.error('Error en damService.getAllDams:', err);
            throw new Error('Error al obtener presas');
        }
    },
    async createDam(name:string, location:string, capacity:number, currentLevel:number, constructionDate: Date) {
        try {
            return await damRepository.create(name, location, capacity, currentLevel, constructionDate);
        } catch (err: any) {
            console.error('Error en damService.createDam:', err);
            throw new Error('Error al crear la presa');
        }
    },
    async updateDam(id:number,name:string, location:string, capacity:number, currentLevel:number, constructionDate: Date) {
        try {
            return await damRepository.update(id, name, location, capacity, currentLevel, constructionDate);
        } catch (err: any) {
            console.error('Error en damService.updateDam:', err);
            throw new Error('Error al actualizar la presa');
        }
    }
};