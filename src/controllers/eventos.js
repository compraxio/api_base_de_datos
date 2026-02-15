import { eventosModel } from '../models/eventos.js';
import { uploadBuffer } from '../lib/blobStorage.js';
import { Prisma } from '@prisma/client';

export class eventosController {
  static async getAll(request, response) {
    try {
      const eventos = await eventosModel.getAll();
      return response.status(200).json({
        success: true,
        data: eventos,
        message: 'Eventos obtenidos correctamente',
      });
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
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
          message: 'ID inválido',
        });
      }

      const evento = await eventosModel.getById({ id: Number(id) });

      if (!evento) {
        return response.status(404).json({
          success: false,
          message: 'Evento no encontrado',
        });
      }

      return response.status(200).json({
        success: true,
        data: evento,
        message: 'Evento obtenido correctamente',
      });
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async create(request, response) {
    try {
      const { evento, direccion, fecha, hora, link, temas, tipo_evento, estado } = request.body;

      // ==========================
      // IMAGEN -> subir a Blob y guardar URL
      // ==========================

      let Img_Presentacion = '';
      if (request.file && request.file.buffer) {
        try {
          const originalName = request.file.originalname ?? 'file';
          const filename = `evento-${Date.now()}-${Math.round(Math.random()*1e9)}-${originalName}`;
          const url = await uploadBuffer(request.file.buffer, filename, request.file.mimetype);
          Img_Presentacion = url;
        } catch (err) {
          console.error('Error subiendo imagen a Blob:', err);
          return response.status(500).json({ success: false, message: 'Error subiendo la imagen' });
        }
      }

      // VALIDACIONES
      // ==========================

      if (!evento || evento.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo evento es requerido',
        });
      }

      if (!direccion || direccion.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo dirección es requerido',
        });
      }

      if (!estado || estado.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo estado es requerido',
        });
      }

      if (evento.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre del evento no puede exceder los 255 caracteres',
        });
      }

      if (direccion.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La dirección no puede exceder los 255 caracteres',
        });
      }

      // ==========================
      // LLAMAR AL MODEL
      // ==========================

      const eventoCreado = await eventosModel.create({
        evento: evento.trim(),
        direccion: direccion.trim(),
        fecha,
        hora,
        link,
        temas,
        tipo_evento,
        estado: estado.trim(),
        Img_Presentacion,
      });

      return response.status(201).json({
        success: true,
        data: eventoCreado,
        message: 'Evento creado correctamente',
      });
    } catch (error) {
      console.error('Error al crear evento:', error);

      // Verificar si es error de duplicado
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return response.status(409).json({
            success: false,
            message: 'El registro ya existe.', // Mensaje más genérico y útil
          });
        }
      }

      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async update(request, response) {
    try {
      const { id } = request.params;
      const { evento, direccion, fecha, hora, link, temas, tipo_evento, estado } = request.body;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID inválido',
        });
      }

      if (evento && evento.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo evento no puede estar vacío',
        });
      }

      if (direccion && direccion.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo dirección no puede estar vacío',
        });
      }

      if (evento && evento.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre del evento no puede exceder los 255 caracteres',
        });
      }

      if (direccion && direccion.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La dirección no puede exceder los 255 caracteres',
        });
      }

      // Verificar si el evento existe
      const existingEvento = await eventosModel.getById({ id: Number(id) });
      if (!existingEvento) {
        return response.status(404).json({
          success: false,
          message: 'Evento no encontrado',
        });
      }

      const eventoActualizado = await eventosModel.update({
        id: Number(id),
        evento: evento ? evento.trim() : undefined,
        direccion: direccion ? direccion.trim() : undefined,
        fecha,
        hora,
        link,
        temas,
        tipo_evento,
        estado: estado ? estado.trim() : undefined,
      });

      return response.status(200).json({
        success: true,
        data: eventoActualizado,
        message: 'Evento actualizado correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async delete(request, response) {
    try {
      const { id } = request.params;

      // Validaciones
      if (!id || isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID inválido',
        });
      }

      // Verificar si el evento existe antes de eliminar
      const existingEvento = await eventosModel.getById({ id: Number(id) });
      if (!existingEvento) {
        return response.status(404).json({
          success: false,
          message: 'Evento no encontrado',
        });
      }

      const eventoEliminado = await eventosModel.delete({ id: Number(id) });

      return response.status(200).json({
        success: true,
        data: eventoEliminado,
        message: 'Evento eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
