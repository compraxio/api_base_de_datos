import { Router } from 'express';
import { dir_verdeController } from '../controllers/dir_verde.js';
import { uploadDir_verde } from '../lib/multerDir_verde.js';
export const dir_verde_router = Router();

// Rutas para el directorio verde
dir_verde_router.get('/', dir_verdeController.getAll);
dir_verde_router.get('/:id_negocio', dir_verdeController.getById);
dir_verde_router.post('/', uploadDir_verde.single('dir_verde'), dir_verdeController.create);
dir_verde_router.delete('/:id_negocio', dir_verdeController.delete);
