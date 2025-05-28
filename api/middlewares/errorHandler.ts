// api/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('❌ Error capturado por middleware:', err);

  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message || 'Ocurrió un error inesperado',
  });
}
// Este middleware captura errores en toda la aplicación y envía una respuesta JSON con el mensaje de error.