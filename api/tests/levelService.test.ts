// api/tests/levelService.test.ts

// 1️⃣ Mocks de los repositorios
const mockDamRepo = {
  findById: jest.fn(),
  patchLevel: jest.fn(),
};

const mockLevelsRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
};

// 2️⃣ Mock antes de importar el servicio
jest.mock('../persistence/damRepository', () => ({
  damRepository: mockDamRepo,
}));

jest.mock('../persistence/levelRepository', () => ({
  levelsRepository: mockLevelsRepo,
}));

// 3️⃣ Imports después de los mocks
import { levelService } from '../services/levelService';

describe('levelService', () => {
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

  describe('createLevel', () => {
    it('should create a level and update dam if timestamp is newer', async () => {
      const dam = { id: 1, lastUpdate: new Date('2025-10-01T00:00:00Z') };
      const timestamp = new Date('2025-10-07T00:00:00Z');
      const newLevel = { damId: 1, level: 50, timestamp };

      mockDamRepo.findById.mockResolvedValue(dam);
      mockLevelsRepo.create.mockResolvedValue(newLevel);
      mockDamRepo.patchLevel.mockResolvedValue({ ...dam, currentLevel: 50, lastUpdate: timestamp });

      const result = await levelService.createLevel(1, 50, timestamp);

      expect(mockDamRepo.findById).toHaveBeenCalledWith(1);
      expect(mockLevelsRepo.create).toHaveBeenCalledWith(1, 50, timestamp);
      expect(mockDamRepo.patchLevel).toHaveBeenCalledWith(1, 50, timestamp);
      expect(result).toEqual(newLevel);
    });

    it('should create a level without updating dam if timestamp is older', async () => {
      const dam = { id: 1, lastUpdate: new Date('2025-10-10T00:00:00Z') };
      const timestamp = new Date('2025-10-07T00:00:00Z');
      const newLevel = { damId: 1, level: 50, timestamp };

      mockDamRepo.findById.mockResolvedValue(dam);
      mockLevelsRepo.create.mockResolvedValue(newLevel);

      const result = await levelService.createLevel(1, 50, timestamp);

      expect(mockDamRepo.findById).toHaveBeenCalledWith(1);
      expect(mockLevelsRepo.create).toHaveBeenCalledWith(1, 50, timestamp);
      expect(mockDamRepo.patchLevel).not.toHaveBeenCalled();
      expect(result).toEqual(newLevel);
    });

    it('should throw error if dam not found', async () => {
      mockDamRepo.findById.mockResolvedValue(null);

      await expect(levelService.createLevel(1, 50, new Date()))
        .rejects.toThrow('Error al crear el nivel');
    });

    it('should throw error if any repository fails', async () => {
      mockDamRepo.findById.mockRejectedValue(new Error('fail'));

      await expect(levelService.createLevel(1, 50, new Date()))
        .rejects.toThrow('Error al crear el nivel');
    });
  });

  describe('getAll', () => {
    it('should return all levels', async () => {
      const levels = [{ damId: 1, level: 50 }];
      mockLevelsRepo.findAll.mockResolvedValue(levels);

      const result = await levelService.getAll();

      expect(mockLevelsRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(levels);
    });

    it('should throw error if findAll fails', async () => {
      mockLevelsRepo.findAll.mockRejectedValue(new Error('fail'));

      await expect(levelService.getAll())
        .rejects.toThrow('Error al obtener todos los niveles');
    });
  });
});
