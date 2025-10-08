import { errorHandler } from "../middlewares/errorHandler";
import { Request, Response, NextFunction } from "express";

describe("errorHandler middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should respond with 500 and the error message", () => {
    const error = new Error("Something went wrong");

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "❌ Error capturado por middleware:",
      error
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
      error: "Something went wrong",
    });
  });

  it("should handle errors without message property", () => {
    const error = { code: 123 };

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
      error: "Ocurrió un error inesperado",
    });
  });
});
