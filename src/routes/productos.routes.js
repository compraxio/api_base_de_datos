import { Router } from 'express';
import { productosController } from '../controllers/productos.js';
import { uploadProductos } from '../lib/multerProductos.js';

export const productos = Router();

productos.get('/', productosController.getAll);
productos.get('/:id', productosController.getById);
productos.post('/', uploadProductos.single('img_prodcto'), productosController.create);
productos.put('/:id', productosController.update);
productos.delete('/:id', productosController.delete);
