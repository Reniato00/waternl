import { ResponseFactory } from "../utils/responseFactory";

describe("ResponseFactory", () => {
  describe("success()", () => {
    it("should return a successful response with default message and code", () => {
      const data = { name: "Test" };
      const result = ResponseFactory.success(data);

      expect(result).toEqual({
        code: 200,
        message: "Operación exitosa",
        response: data,
      });
    });

    it("should allow custom message and code", () => {
      const data = [1, 2, 3];
      const result = ResponseFactory.success(data, "Todo bien", 202);

      expect(result).toEqual({
        code: 202,
        message: "Todo bien",
        response: data,
      });
    });
  });

  describe("created()", () => {
    it("should return a created response with default message and code", () => {
      const data = { id: 10 };
      const result = ResponseFactory.created(data);

      expect(result).toEqual({
        code: 201,
        message: "Creado exitosamente",
        response: data,
      });
    });

    it("should allow custom message and code", () => {
      const data = "ok";
      const result = ResponseFactory.created(data, "Elemento creado", 202);

      expect(result).toEqual({
        code: 202,
        message: "Elemento creado",
        response: data,
      });
    });
  });

  describe("error()", () => {
    it("should return an error response with default message and code", () => {
      const result = ResponseFactory.error(null);

      expect(result).toEqual({
        code: 500,
        message: "Ocurrió un error",
        response: null,
      });
    });

    it("should allow custom message and code", () => {
      const result = ResponseFactory.error("fail", "Algo salió mal", 400);

      expect(result).toEqual({
        code: 400,
        message: "Algo salió mal",
        response: "fail",
      });
    });
  });

  describe("notFound()", () => {
    it("should return a not found response with default message", () => {
      const result = ResponseFactory.notFound();

      expect(result).toEqual({
        code: 404,
        message: "No encontrado",
        response: null,
      });
    });

    it("should allow custom not found message", () => {
      const result = ResponseFactory.notFound("Usuario no encontrado");

      expect(result).toEqual({
        code: 404,
        message: "Usuario no encontrado",
        response: null,
      });
    });
  });
});
