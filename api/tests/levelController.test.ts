import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import levelsRouter from "../controllers/levelController";
import { levelService } from "../services/levelService";
import { ResponseFactory } from "../utils/responseFactory";

// Mock del middleware passwordAuth
const mockPasswordAuth = jest.fn((req: Request, res: Response, next: NextFunction) => next());

// Mock de levelService
jest.mock("../services/levelService");

describe("Levels API", () => {
  let app: express.Express;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    // Intercepta console.error para no mostrarlo en tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Crear app fresh para cada test
    app = express();
    app.use(express.json());
    app.use("/", mockPasswordAuth, levelsRouter);
  });

  describe("GET /", () => {
    it("should return all levels", async () => {
      const mockLevels = [{ id: 1, level: 50 }];
      (levelService.getAll as jest.Mock).mockResolvedValue(mockLevels);

      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(ResponseFactory.success(mockLevels));
      expect(levelService.getAll).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      (levelService.getAll as jest.Mock).mockRejectedValue(new Error("fail"));

      const res = await request(app).get("/");

      expect(res.status).toBe(500);
      expect(res.body).toEqual(ResponseFactory.error(null, "Error al obtener niveles"));
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("POST /create", () => {
    it("should create a new level", async () => {
      const newLevel = { id: 1, level: 55 };
      (levelService.createLevel as jest.Mock).mockResolvedValue(newLevel);

      const res = await request(app)
        .post("/create")
        .send({ damId: 1, level: 55, timestamp: "2025-10-07T12:00:00Z" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(ResponseFactory.created(newLevel));
      expect(levelService.createLevel).toHaveBeenCalledWith(1, 55, new Date("2025-10-07T12:00:00Z"));
    });

    it("should handle errors on create", async () => {
      (levelService.createLevel as jest.Mock).mockRejectedValue(new Error("fail"));

      const res = await request(app)
        .post("/create")
        .send({ damId: 1, level: 55, timestamp: "2025-10-07T12:00:00Z" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual(ResponseFactory.error(null, "Error al crear el nivel"));
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
