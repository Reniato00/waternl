import { Router, Request, Response } from 'express';
import { ResponseFactory } from '../utils/responseFactory';
import { passwordAuth } from '../filters/passwordAuth';

import { levelService } from '../services/levelService';

const router = Router();

router.get('/', passwordAuth ,async (req: Request, res: Response) => {
  try {
    const levels = await levelService.getAll();
    res.json(ResponseFactory.success(levels));
  } catch (err: any) {
    console.error('Error en GET /levels:', err);
    res.status(500).json(ResponseFactory.error(null, 'Error al obtener niveles'));
  }
});

router.post('/create', passwordAuth, async (req: Request, res: Response) => {
  try {
    const { damId, level, timestamp } = req.body;
    const newLevel = await levelService.createLevel(damId, level, new Date(timestamp));
    res.json(ResponseFactory.created(newLevel));
  } catch (err: any) {
    console.error('Error en POST /levels/create:', err);
    res.status(500).json(ResponseFactory.error(null, 'Error al crear el nivel'));
  }
});

export default router;