import { Router } from 'express';
import { gruposController } from '../controllers/grupos.js';
import { uploadGrupo } from '../lib/multerGrupo.js';

export const grupos = Router();

grupos.get('/', gruposController.getAll);
grupos.get('/:id', gruposController.getById);
grupos.post('/', uploadGrupo.single('logo_grupo'), gruposController.create);
grupos.put('/:id', gruposController.update);
grupos.delete('/:id', gruposController.delete);
