import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import statusRouter from "../controllers/healthController";

// Mock del middleware passwordAuth
const mockPasswordAuth = jest.fn((req: Request, res: Response, next: NextFunction) => next());

// Crea una app de Express solo para test
const app = express();
app.use("/", mockPasswordAuth, statusRouter);

describe("GET /", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
