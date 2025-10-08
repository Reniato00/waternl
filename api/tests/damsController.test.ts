import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import damRouter from "../controllers/damsController";
import { damService } from "../services/damService";
import { ResponseFactory } from "../utils/responseFactory";

const mockPasswordAuth = jest.fn((req : Request, res: Response, next: NextFunction) => next());
jest.mock("../services/damService");

describe("Dams API", () => {
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
        app = express();
        app.use(express.json());
        app.use("/", mockPasswordAuth, damRouter);
    });

    describe("GET /", () => {
        it("Should return all dams", async() =>{
            const mockDams = [{ id: 1, name: "Dam A" }];
            (damService.getAllDams as jest.Mock).mockResolvedValue(mockDams);
            const res = await request(app).get("/");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(ResponseFactory.success(mockDams));
            expect(damService.getAllDams).toHaveBeenCalled();
        });

        it("Should handle errors", async() => {
            (damService.getAllDams as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app).get("/");
            expect(res.status).toBe(500);
            expect(res.body).toEqual(ResponseFactory.error(null, "Error al obtener presas"));
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    describe("GET /fill-percentage", () => {
        it("Should return fill percentage of all dams", async() =>{
            const mockFillPercentage = [{ id: 1, fillPercentage: 75 }];
            (damService.fillPercentage as jest.Mock).mockResolvedValue(mockFillPercentage);
            const res = await request(app).get("/fill-percentage");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(ResponseFactory.success(mockFillPercentage));
            expect(damService.fillPercentage).toHaveBeenCalled();
        });

        it("Should handle errors", async() => {
            (damService.fillPercentage as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app).get("/fill-percentage");
            expect(res.status).toBe(500);
            expect(res.body).toEqual(ResponseFactory.error(null, "Error al obtener información de las presas"));
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });
});