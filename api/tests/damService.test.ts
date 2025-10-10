// api/tests/damService.test.ts

// 1️⃣ Mocks de los repositorios
const mockDamRepo = {
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockLevelsRepo = {
  findByDamId: jest.fn(),
};

// 2️⃣ Mock antes de importar el servicio
jest.mock('../persistence/damRepository', () => ({
  damRepository: mockDamRepo,
}));

jest.mock('../persistence/levelRepository', () => ({
  levelsRepository: mockLevelsRepo,
}));

// 3️⃣ Imports después de los mocks
import { damService } from '../services/damService';
import { Level } from '../entities/levelModel';

describe('damService', () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDams', () => {
    it('should return all dams', async () => {
      const dams = [{ id: 1, name: 'Cuchillo' }];
      mockDamRepo.findAll.mockResolvedValue(dams);

      const result = await damService.getAllDams();
      expect(mockDamRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(dams);
    });

    it('should throw error if findAll fails', async () => {
      mockDamRepo.findAll.mockRejectedValue(new Error('fail'));

      await expect(damService.getAllDams()).rejects.toThrow('Error al obtener presas');
    });
  });

  describe('createDam', () => {
    it('should create a dam', async () => {
      const damData = { name: 'Boca', location: 'NL', capacity: 100, currentLevel: 50, constructionDate: new Date() };
      const createdDam = { id: 1, ...damData };
      mockDamRepo.create.mockResolvedValue(createdDam);

      const result = await damService.createDam(
        damData.name,
        damData.location,
        damData.capacity,
        damData.currentLevel,
        damData.constructionDate
      );

      expect(mockDamRepo.create).toHaveBeenCalledWith(
        damData.name,
        damData.location,
        damData.capacity,
        damData.currentLevel,
        damData.constructionDate
      );
      expect(result).toEqual(createdDam);
    });

    it('should throw error if create fails', async () => {
      mockDamRepo.create.mockRejectedValue(new Error('fail'));
      await expect(damService.createDam('Boca', 'NL', 100, 50, new Date()))
        .rejects.toThrow('Error al crear la presa');
    });
  });

  describe('updateDam', () => {
    it('should update a dam', async () => {
      const updatedDam = { id: 1, name: 'Cerro Prieto' };
      mockDamRepo.update.mockResolvedValue(updatedDam);

      const result = await damService.updateDam(1, 'Cerro Prieto', 'NL', 200, 150, new Date());

      expect(mockDamRepo.update).toHaveBeenCalledWith(1, 'Cerro Prieto', 'NL', 200, 150, expect.any(Date));
      expect(result).toEqual(updatedDam);
    });

    it('should throw error if update fails', async () => {
      mockDamRepo.update.mockRejectedValue(new Error('fail'));
      await expect(damService.updateDam(1, 'Cerro Prieto', 'NL', 200, 150, new Date()))
        .rejects.toThrow('Error al actualizar la presa');
    });
  });

  describe('fillPercentage', () => {
    it('should calculate dam changes correctly', async () => {
      const now = new Date();
      const previous = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const levels: Level[] = [
        { damId: 1, level: 80, timestamp: now } as Level,
        { damId: 1, level: 50, timestamp: previous } as Level,
      ];

      mockLevelsRepo.findByDamId.mockResolvedValueOnce(levels)
                              .mockResolvedValueOnce(levels)
                              .mockResolvedValueOnce(levels);

      const result = await damService.fillPercentage();

      expect(mockLevelsRepo.findByDamId).toHaveBeenCalledTimes(3);
      expect(result['Cuchillo'].volumeChange).toBe(30);
      expect(result['Boca'].volumeChange).toBe(30);
      expect(result['Prieto'].volumeChange).toBe(30);
      expect(result['Cuchillo'].daysBetween).toBe(1);
    });

    it('should handle empty levels', async () => {
      mockLevelsRepo.findByDamId.mockResolvedValue([]);
      const result = await damService.fillPercentage();

      expect(result).toEqual({});
    });

    it('should throw error if levelsRepository fails', async () => {
      mockLevelsRepo.findByDamId.mockRejectedValue(new Error('fail'));
      await expect(damService.fillPercentage()).rejects.toThrow('Error al obtener el porcentaje de llenado');
    });
  });
});
