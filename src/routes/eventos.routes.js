import { Router } from 'express';
import { eventosController } from '../controllers/eventos.js';
import { uploadEventos } from '../lib/multerEventos.js';

export const eventos = Router();

eventos.get('/', eventosController.getAll);
eventos.get('/:id', eventosController.getById);
eventos.post('/', uploadEventos.single('Img_Presentacion'), eventosController.create);
eventos.put('/:id', eventosController.update);
eventos.delete('/:id', eventosController.delete);
