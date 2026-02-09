import { contactosModel } from '../models/contactos.js';

export class contactosController {
  static async getAll(request, response) {
    try {
      const contactos = await contactosModel.getAll();
      return response.status(200).json({
        success: true,
        data: contactos,
        message: 'Contactos obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
  static async getById(request, response) {
    try {
      const { id } = request.params;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de contacto inválido'
        });
      }

      const contacto = await contactosModel.getById({ id: Number(id) });

      if (!contacto) {
        return response.status(404).json({
          success: false,
          message: 'Contacto no encontrado'
        });
      }

      return response.status(200).json({
        success: true,
        data: contacto,
        message: 'Contacto obtenido correctamente'
      });
    } catch (error) {
      console.error('Error al obtener contacto por ID:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  static async create(request, response) {
    try {
      const {  nombre, telefono, correo } = request.body;


      if (nombre !== undefined && nombre.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre no puede exceder los 255 caracteres'
        });
      }

      if (telefono !== undefined && telefono.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El teléfono no puede exceder los 255 caracteres'
        });
      }

      if (correo !== undefined && correo.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return response.status(400).json({
          success: false,
          message: 'El formato del correo electrónico no es válido'
        });
      }

      if (correo !== undefined && correo.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El correo electrónico no puede exceder los 255 caracteres'
        });
      }

      const existingContactoTelefono = await contactosModel.getByTelefono({telefono})
      const existingContactoCorreo = await contactosModel.getByCorreo({ correo });

      if (existingContactoTelefono) {
        return response.status(409).json({
          success: false,
          message: 'Ya existe un contacto con este teléfono',
        });
      }

      if (existingContactoCorreo) {
        return response.status(409).json({
          success: false,
          message: 'Ya existe un contacto con este correo',
        });
      }


      const contacto = await contactosModel.create({
        nombre: nombre ? nombre.trim() : undefined,
        telefono: telefono ? telefono.trim() : undefined,
        correo: correo ? correo.trim() : undefined,
      });
      return response.status(201).json({
        success: true,
        data: contacto,
        message: 'Contacto creado correctamente'
      });
    } catch (error) {
      console.error('Error al crear contacto:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  static async update(request, response) {
    try {
      const { id } = request.params;
      const { nombre, telefono, correo } = request.body;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de contacto inválido'
        });
      }


      if (nombre !== undefined && nombre.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre no puede exceder los 255 caracteres'
        });
      }

      if (telefono !== undefined && telefono.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El teléfono no puede exceder los 255 caracteres'
        });
      }

      if (correo !== undefined && correo.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return response.status(400).json({
          success: false,
          message: 'El formato del correo electrónico no es válido'
        });
      }

      if (correo !== undefined && correo.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El correo electrónico no puede exceder los 255 caracteres'
        });
      }

      // Verificar si el contacto existe
      const existingContacto = await contactosModel.getById({ id: Number(id) });
      if (!existingContacto) {
        return response.status(404).json({
          success: false,
          message: 'Contacto no encontrado'
        });
      }

      const contacto = await contactosModel.update({
        id: Number(id),
        nombre: nombre ? nombre.trim() : undefined,
        telefono: telefono ? telefono.trim() : undefined,
        correo: correo ? correo.trim() : undefined,
      });
      return response.status(200).json({
        success: true,
        data: contacto,
        message: 'Contacto actualizado correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  static async delete(request, response) {
    try {
      const { id } = request.params;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de contacto inválido'
        });
      }

      // Verificar si el contacto existe antes de eliminar
      const existingContacto = await contactosModel.getById({ id: Number(id) });
      if (!existingContacto) {
        return response.status(404).json({
          success: false,
          message: 'Contacto no encontrado'
        });
      }

      const contacto = await contactosModel.delete({ id: Number(id) });

      return response.status(200).json({
        success: true,
        data: contacto,
        message: 'Contacto eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
