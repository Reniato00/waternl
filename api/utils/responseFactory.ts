import { ResponseModel } from '../entities/responseModel';

export class ResponseFactory{

    static success<T>(data: T, message = 'Operación exitosa', code = 200): ResponseModel<T> {
        return {
          code,
          message,
          response: data
        };
    }

    static created<T>(data: T, message = 'Creado exitosamente', code = 201): ResponseModel<T> {
        return {
          code,
          message,
          response: data
        };
    }
    
    static error<T>(data: T, message = 'Ocurrió un error', code = 500): ResponseModel<T> {
        return {
          code,
          message,
          response: data
        };
    }
    
    static notFound(message = 'No encontrado'): ResponseModel<null> {
        return {
          code: 404,
          message,
          response: null
        };
    }
}   