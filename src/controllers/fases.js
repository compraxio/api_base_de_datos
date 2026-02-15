import { fasesModel } from '../models/fases.js';
import { uploadBuffer } from '../lib/blobStorage.js';
import { Prisma } from '@prisma/client';
export class fasesController {
  static async getAll(request, response) {
    try {
      const fases = await fasesModel.getAll();
      return response.status(200).json({
        success: true,
        data: fases,
        message: 'Fases obtenidas correctamente',
      });
    } catch (error) {
      console.error('Error al obtener fases:', error);
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

      const fase = await fasesModel.getById({ id: Number(id) });

      if (!fase) {
        return response.status(404).json({
          success: false,
          message: 'Fase no encontrada',
        });
      }

      return response.status(200).json({
        success: true,
        data: fase,
        message: 'Fase obtenida correctamente',
      });
    } catch (error) {
      console.error('Error al obtener fase por ID:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async create(request, response) {
    try {
      const { des_fase, id_fasex } = request.body;

      // ==========================
      // LOGO -> subir a Blob y guardar URL
      // ==========================

      let logo_fase = '';
      if (request.file && request.file.buffer) {
        try {
          const originalName = request.file.originalname ?? 'file';
          const filename = `fase-${Date.now()}-${Math.round(Math.random()*1e9)}-${originalName}`;
          const url = await uploadBuffer(request.file.buffer, filename, request.file.mimetype);
          logo_fase = url;
        } catch (err) {
          console.error('Error subiendo logo a Blob:', err);
          return response.status(500).json({ success: false, message: 'Error subiendo el logo' });
        }
      }

      // VALIDACIONES
      // ==========================

      if (!des_fase || des_fase.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo des_fase es requerido',
        });
      }

      if (des_fase.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La descripción no puede exceder los 255 caracteres',
        });
      }

      // ==========================
      // LLAMAR AL MODEL
      // ==========================

      const fase = await fasesModel.create({
        des_fase: des_fase.trim(),
        id_fasex,
        logo_fase,
      });

      return response.status(201).json({
        success: true,
        data: fase,
        message: 'Fase creada correctamente',
      });
    } catch (error) {
      console.error('Error al crear fase:', error);

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
      const { des_fase, id_fasex } = request.body;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID inválido',
        });
      }

      if (des_fase && des_fase.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'El campo des_fase no puede estar vacío',
        });
      }

      if (des_fase && des_fase.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La descripción no puede exceder los 255 caracteres',
        });
      }

      // Verificar si la fase existe
      const existingFase = await fasesModel.getById({ id: Number(id) });
      if (!existingFase) {
        return response.status(404).json({
          success: false,
          message: 'Fase no encontrada',
        });
      }

      const fase = await fasesModel.update({
        id: Number(id),
        des_fase: des_fase ? des_fase.trim() : undefined,
        id_fasex,
      });

      return response.status(200).json({
        success: true,
        data: fase,
        message: 'Fase actualizada correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar fase:', error);
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

      // Verificar si la fase existe antes de eliminar
      const existingFase = await fasesModel.getById({ id: Number(id) });
      if (!existingFase) {
        return response.status(404).json({
          success: false,
          message: 'Fase no encontrada',
        });
      }

      const fase = await fasesModel.delete({ id: Number(id) });

      return response.status(200).json({
        success: true,
        data: fase,
        message: 'Fase eliminada correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar fase:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
