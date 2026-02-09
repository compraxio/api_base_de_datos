import { Router } from 'express';
import { municipiosController } from '../controllers/municipios.js';
export const municipios = Router();

municipios.get('/', municipiosController.getAll);
municipios.get('/:id', municipiosController.getById);
municipios.post('/', municipiosController.create);
municipios.put('/:id', municipiosController.update);
municipios.delete('/:id', municipiosController.delete);
