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

    describe("POST /create", () => {
        it("Should create a new dam", async() =>{
            const newDam = { name: "Dam B", location: "Loc B", capacity: 1000, currentLevel: 500, constructionDate: "2020-01-01" };
            const createdDam = { id: 2, ...newDam };
            (damService.createDam as jest.Mock).mockResolvedValue(createdDam);
            const res = await request(app).post("/create").send(newDam);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(ResponseFactory.created(createdDam));
            expect(damService.createDam).toHaveBeenCalledWith(newDam.name, newDam.location, newDam.capacity, newDam.currentLevel, newDam.constructionDate);
        });

        it("Should handle errors", async() => {
            (damService.createDam as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app).post("/create").send({ name: "Dam B" });
            expect(res.status).toBe(500);
            expect(res.body).toEqual(ResponseFactory.error(null, "Error al crear la presa"));
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    describe("PUT /update/:id", () => {
        it("Should update an existing dam", async() =>{
            const updatedDam = { id: 1, name: "Dam A Updated", location: "Loc A", capacity: 1200, currentLevel: 600, constructionDate: "2019-01-01" };
            (damService.updateDam as jest.Mock).mockResolvedValue(updatedDam);
            const res = await request(app).put("/update/1").send({ name: "Dam A Updated", location: "Loc A", capacity: 1200, currentLevel: 600, constructionDate: "2019-01-01" });
            expect(res.status).toBe(200);
            expect(res.body).toEqual(ResponseFactory.success(updatedDam));
            expect(damService.updateDam).toHaveBeenCalledWith(1, updatedDam.name, updatedDam.location, updatedDam.capacity, updatedDam.currentLevel, updatedDam.constructionDate);
        });

        it("Should handle errors", async() => {
            (damService.updateDam as jest.Mock).mockRejectedValue(new Error("fail"));
            const res = await request(app).put("/update/1").send({ name: "Dam A Updated" });
            expect(res.status).toBe(500);
            expect(res.body).toEqual(ResponseFactory.error(null, "Error al actualizar la presa"));
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });
});