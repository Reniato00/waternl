import { Level } from '../entities/levelModel';
import { damRepository } from '../persistence/damRepository';
import { levelsRepository } from '../persistence/levelRepository';

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
    },
    async fillPercentage(){
        try {
            const cuchilloLLevels = await levelsRepository.findByDamId(1);
            const bocaLevels = await levelsRepository.findByDamId(2);
            const prietoLevels = await levelsRepository.findByDamId(3);

            const summaryMap: Record<string, DamChangeSummary> = {};

            if (cuchilloLLevels.length > 0) {
                console.log('Cuchillo Levels:', cuchilloLLevels);
                const cuchilloChange = calculateDamChange(cuchilloLLevels);
                summaryMap['Cuchillo'] = cuchilloChange;
            }
            if (bocaLevels.length > 0) {
                console.log('Boca Levels:', bocaLevels);
                const bocaChange = calculateDamChange(bocaLevels);
                summaryMap['Boca'] = bocaChange;
            }
            if (prietoLevels.length > 0) {
                console.log('Prieto Levels:', prietoLevels);
                const prietoChange = calculateDamChange(prietoLevels);
                summaryMap['Prieto'] = prietoChange;
            }

            return summaryMap;
        } catch (err: any) {
            console.error('Error en damService.fillPercentage:', err);
            throw new Error('Error al obtener el porcentaje de llenado');
        }
    }

};

type DamChangeSummary = {
    lastestLevel?: number;
    lastestTimestamp?: Date;
    previousLevel?: number;
    previousTimestamp?: Date;
    volumeChange: number;
    daysBetween: number;
};

function calculateDamChange( levels: Level[]): DamChangeSummary {
    if (levels.length < 2) {
        return { volumeChange: 0, daysBetween: 0 };
    }

    const latestLevel = levels[0];
    const previousLevel = levels[1];

    const volumeChange = latestLevel.level - previousLevel.level;
    const daysBetween = Math.ceil((latestLevel.timestamp.getTime() - previousLevel.timestamp.getTime()) / (1000 * 60 * 60 * 24));

    return {
        lastestLevel : latestLevel.level, 
        lastestTimestamp: latestLevel.timestamp,
        previousLevel: previousLevel.level,
        previousTimestamp: previousLevel.timestamp,
        volumeChange, 
        daysBetween 
    };
}