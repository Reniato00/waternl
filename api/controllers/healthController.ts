import { Router } from 'express';
import { passwordAuth } from '../filters/passwordAuth';

const router = Router();

router.get('/', passwordAuth ,(_req, res) => {
  res.json({ status: 'ok' });
});


export default router;