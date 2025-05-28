import { AppDataSource } from '../persistence/data-source';
import { Dam } from '../entities/damModel';

const damRepo = AppDataSource.getRepository(Dam);

export const damRepository = {
    
    async create(name:string, location:string, capacity:number, currentLevel:number, constructionDate: Date) {
        try {
            const newDam = damRepo.create({ name, location, capacity,currentLevel, constructionDate });
            await damRepo.save(newDam);
            return newDam;
        } catch (err: any) {
            console.error('Error al crear la presa:', err);
            throw new Error('Error al crear la presa');
        }
    },

    async findAll() {
        try {
            const dams = await damRepo.find();
            return dams;
        } catch (err: any) {
            console.error('Error al obtener las presas:', err);
            throw new Error('Error al obtener las presas');
        }
    },

    async update(id:number,name:string, location:string, capacity:number, currentLevel:number, constructionDate: Date) {
        try {
            const dam = await damRepo.findOneBy({ id: id });
            dam.name = name;
            dam.location = location;
            dam.capacity = capacity;
            dam.currentLevel = currentLevel;
            dam.constructionDate = constructionDate;
            await damRepo.save(dam);
            return dam;
        }catch (err: any) {
            console.error('Error al actualizar la presa:', err);
            throw new Error('Error al actualizar la presa');
        }
    },

    async patchLevel(damId:number, currentLevelPercentage:number, timestamp: Date) {
        try{
            const dam = await damRepo.findOneBy({ id: damId });
            if (!dam) {
                throw new Error('Presa no encontrada');
            }
            dam.currentLevel = (dam.capacity * currentLevelPercentage);
            dam.lastUpdate = timestamp;
            const savedDam = await damRepo.save(dam);
            console.log('Presa actualizada:', savedDam);
            return dam;
        }catch (err: any) {
            console.error('Error al actualizar el nivel de la presa:', err);
            throw new Error('Error al actualizar el nivel de la presa');
        }
    },

    async findById(id: number) {
        try {
            const dam = await damRepo.findOneBy({ id: id });
            if (!dam) {
                throw new Error('Presa no encontrada');
            }
            return dam;
        } catch (err: any) {
            console.error('Error al obtener la presa por ID:', err);
            throw new Error('Error al obtener la presa por ID');
        }
    }


};