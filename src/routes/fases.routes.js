import { Router } from 'express';
import { fasesController } from '../controllers/fases.js';
import { uploadFases } from '../lib/multerfases.js';

export const fases = Router();

fases.get('/', fasesController.getAll);
fases.get('/:id', fasesController.getById);
fases.post('/', uploadFases.single('logo_fase'), fasesController.create);
fases.put('/:id', fasesController.update);
fases.delete('/:id', fasesController.delete);
