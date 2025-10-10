// api/tests/levelRepository.test.ts


// Mock del repositorio
const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

// Mock del DataSource antes de importar el repository
jest.mock('../persistence/data-source', () => ({
  AppDataSource: {
    getRepository: () => mockRepo,
  },
}));

import { levelsRepository } from '../persistence/levelRepository';
import { Level } from '../entities/levelModel';

describe('levelsRepository', () => {
    let consoleErrorSpy: jest.SpyInstance;
    let consoleLogSpy: jest.SpyInstance;

    beforeAll(() => {
    // Intercepta console.error para no mostrarlo en tests
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new level', async () => {
      const levelData = { damId: 1, level: 50, timestamp: new Date() };
      const createdLevel = { ...levelData, id: 1 };

      mockRepo.create.mockReturnValue(createdLevel);
      mockRepo.save.mockResolvedValue(createdLevel);

      const result = await levelsRepository.create(levelData.damId, levelData.level, levelData.timestamp);

      expect(mockRepo.create).toHaveBeenCalledWith(levelData);
      expect(mockRepo.save).toHaveBeenCalledWith(createdLevel);
      expect(result).toEqual(createdLevel);
    });

    it('should throw error if save fails', async () => {
      const levelData = { damId: 1, level: 50, timestamp: new Date() };
      const createdLevel = { ...levelData, id: 1 };

      mockRepo.create.mockReturnValue(createdLevel);
      mockRepo.save.mockRejectedValue(new Error('fail'));

      await expect(levelsRepository.create(levelData.damId, levelData.level, levelData.timestamp))
        .rejects.toThrow('Error al crear el nivel');
    });
  });

  describe('findAll', () => {
    it('should return sorted levels', async () => {
      const levels = [
        { id: 1, timestamp: new Date('2025-01-01') },
        { id: 2, timestamp: new Date('2025-02-01') },
      ];
      mockRepo.find.mockResolvedValue(levels);

      const result = await levelsRepository.findAll();

      expect(mockRepo.find).toHaveBeenCalled();
      // Debe estar ordenado por timestamp descendente
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
    });

    it('should throw error if find fails', async () => {
      mockRepo.find.mockRejectedValue(new Error('fail'));

      await expect(levelsRepository.findAll()).rejects.toThrow('Error al obtener los niveles');
    });
  });

  describe('findByDamId', () => {
    it('should return levels filtered by damId', async () => {
      const levels = [
        { id: 1, damId: 1, timestamp: new Date() },
        { id: 2, damId: 1, timestamp: new Date() },
      ];
      mockRepo.find.mockResolvedValue(levels);

      const result = await levelsRepository.findByDamId(1);

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { damId: 1 },
        order: { timestamp: 'DESC' },
        take: 2,
      });
      expect(result).toEqual(levels);
    });

    it('should throw error if find fails', async () => {
      mockRepo.find.mockRejectedValue(new Error('fail'));

      await expect(levelsRepository.findByDamId(1)).rejects.toThrow('Error al obtener los niveles por ID de presa');
    });
  });
});
