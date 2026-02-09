import { Router } from 'express';
import { contactosController } from '../controllers/contactos.js';
export const contactos = Router();

contactos.get('/', contactosController.getAll);
contactos.get('/:id', contactosController.getById);
contactos.post('/', contactosController.create);
contactos.put('/:id', contactosController.update);
contactos.delete('/:id', contactosController.delete);
