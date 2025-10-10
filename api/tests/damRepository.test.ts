// api/tests/damRepository.test.ts

// 1️⃣ Declaramos el mock primero
const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

// 2️⃣ Mock de AppDataSource antes de importar damRepository
jest.mock("../persistence/data-source", () => ({
  AppDataSource: {
    getRepository: () => mockRepo,
  },
}));

// 3️⃣ Importamos después
import { damRepository } from "../persistence/damRepository";
import { Dam } from "../entities/damModel";

describe("damRepository", () => {
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

  describe("create", () => {
    it("should create and save a dam", async () => {
      const newDam = { id: 1, name: "La Boca" } as Dam;
      mockRepo.create.mockReturnValue(newDam);
      mockRepo.save.mockResolvedValue(newDam);

      const result = await damRepository.create("La Boca", "NL", 1000, 500, new Date());

      expect(mockRepo.create).toHaveBeenCalledWith({
        name: "La Boca",
        location: "NL",
        capacity: 1000,
        currentLevel: 500,
        constructionDate: expect.any(Date),
      });
      expect(mockRepo.save).toHaveBeenCalledWith(newDam);
      expect(result).toEqual(newDam);
    });

    it("should throw error if save fails", async () => {
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockRejectedValue(new Error("fail"));

      await expect(
        damRepository.create("La Boca", "NL", 1000, 500, new Date())
      ).rejects.toThrow("Error al crear la presa");
    });
  });

  describe("findAll", () => {
    it("should return all dams", async () => {
      const dams = [{ id: 1, name: "La Boca" }] as Dam[];
      mockRepo.find.mockResolvedValue(dams);

      const result = await damRepository.findAll();
      expect(mockRepo.find).toHaveBeenCalled();
      expect(result).toEqual(dams);
    });

    it("should throw error if find fails", async () => {
      mockRepo.find.mockRejectedValue(new Error("fail"));
      await expect(damRepository.findAll()).rejects.toThrow("Error al obtener las presas");
    });
  });

  describe("update", () => {
    it("should update a dam", async () => {
      const dam = { id: 1, name: "Old" } as Dam;
      mockRepo.findOneBy.mockResolvedValue(dam);
      mockRepo.save.mockResolvedValue(dam);

      const result = await damRepository.update(1, "La Boca", "NL", 1000, 500, new Date());

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.save).toHaveBeenCalledWith(dam);
      expect(result.name).toBe("La Boca");
    });

    it("should throw error if update fails", async () => {
      mockRepo.findOneBy.mockRejectedValue(new Error("fail"));
      await expect(
        damRepository.update(1, "La Boca", "NL", 1000, 500, new Date())
      ).rejects.toThrow("Error al actualizar la presa");
    });
  });

  describe("patchLevel", () => {
    it("should update currentLevel and lastUpdate", async () => {
      const dam = { id: 1, capacity: 1000, currentLevel: 500 } as Dam;
      mockRepo.findOneBy.mockResolvedValue(dam);
      mockRepo.save.mockResolvedValue(dam);

      const timestamp = new Date();
      const result = await damRepository.patchLevel(1, 0.6, timestamp);

      expect(dam.currentLevel).toBe(600);
      expect(dam.lastUpdate).toBe(timestamp);
      expect(mockRepo.save).toHaveBeenCalledWith(dam);
      expect(result).toEqual(dam);
    });

    it("should throw error if dam not found", async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(damRepository.patchLevel(1, 0.6, new Date())).rejects.toThrow(
        "Error al actualizar el nivel de la presa"
      );
    });
  });

  describe("findById", () => {
    it("should return a dam by id", async () => {
      const dam = { id: 1, name: "La Boca" } as Dam;
      mockRepo.findOneBy.mockResolvedValue(dam);

      const result = await damRepository.findById(1);
      expect(result).toEqual(dam);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it("should throw error if dam not found", async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(damRepository.findById(1)).rejects.toThrow("Error al obtener la presa por ID");
    });
  });
});
