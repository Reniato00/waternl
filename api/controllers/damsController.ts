import { Router, Request, Response } from 'express';
import { ResponseFactory } from '../utils/responseFactory';
import { damRepository } from '../persistence/damRepository';
import { passwordAuth } from '../filters/passwordAuth';

import { damService } from '../services/damService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const dams = await damService.getAllDams();
    res.json(ResponseFactory.success(dams));
  } catch (err: any) {
    console.error('Error en GET /dams:', err);
    res.status(500).json(ResponseFactory.error(null, 'Error al obtener presas'));
  }
});

router.get('/fill-percentage', async (req: Request, res: Response) => {
  try {
    const fillPercentage = await damService.fillPercentage();
    res.json(ResponseFactory.success(fillPercentage));
  }catch (err: any) {
    console.error('Error en GET /dams/info:', err);
    res.status(500).json(ResponseFactory.error(null, 'Error al obtener información de las presas'));
  }
});

router.post('/create', passwordAuth , async (req: Request, res: Response) => {
  try {
    const { name, location, capacity, currentLevel, constructionDate } = req.body;
    const dam = await damService.createDam(name, location, capacity, currentLevel, constructionDate);
    res.json(ResponseFactory.created(dam));
  } catch (err: any) {
    console.error('Error en POST /dams/create:', err);
    res.status(500).json(ResponseFactory.error(null, 'Error al crear la presa'));
  }
});

router.put('/update/:id', passwordAuth, async (req: Request, res: Response) => {
  try{
    const { id } = req.params;
    const { name, location, capacity, currentLevel, constructionDate } = req.body;
    const dam = await damService.updateDam(parseInt(id), name, location, capacity, currentLevel, constructionDate);
    res.json(ResponseFactory.success(dam));

  }catch (err: any) {
    console.error('Error en PUT /dams/update/:id:', err);
    res.status(500).json(ResponseFactory.error(null, 'Error al actualizar la presa'));
  }
});

export default router;
