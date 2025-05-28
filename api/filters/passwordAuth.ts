// api/filters/passwordAuth.ts
import { Request, Response, NextFunction } from 'express';

export function passwordAuth(req: Request, res: Response, next: NextFunction) {
  const password = req.headers['password'];

  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Contraseña inválida' });
    return;

  }

  next();
}
