import { passwordAuth } from "../filters/passwordAuth";
import { Request, Response, NextFunction } from "express";

describe("passwordAuth middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    process.env.ADMIN_PASSWORD = "superSecret"; // valor simulado
  });

  it("should call next() when password is correct", () => {
    mockReq.headers = { password: "superSecret" };

    passwordAuth(mockReq as Request, mockRes as Response, next);

    expect(next).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it("should return 401 when password is missing", () => {
    passwordAuth(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Contraseña inválida" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when password is incorrect", () => {
    mockReq.headers = { password: "wrong" };

    passwordAuth(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Contraseña inválida" });
    expect(next).not.toHaveBeenCalled();
  });
});
