import { gruposModel } from '../models/grupos.js';
import { uploadBuffer } from '../lib/blobStorage.js';

export class gruposController {
  static async getAll(request, response) {
    try {
      const grupos = await gruposModel.getAll();
      return response.status(200).json({
        success: true,
        data: grupos,
        message: 'Grupos obtenidos correctamente',
      });
    } catch (error) {
      console.error('Error al obtener grupos:', error);
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

      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de grupo inválido',
        });
      }

      const grupo = await gruposModel.getById({ id: Number(id) });

      if (!grupo) {
        return response.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      return response.status(200).json({
        success: true,
        data: grupo,
        message: 'Grupo obtenido correctamente',
      });
    } catch (error) {
      console.error('Error al obtener grupo por ID:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async create(request, response) {
    try {
      const { actividad } = request.body;

      // ==========================
      // LOGO -> subir a Blob y guardar URL
      // ==========================

      let logo_grupo = undefined;
      if (request.file && request.file.buffer) {
        try {
          const originalName = request.file.originalname ?? 'file';
          const filename = `grupo-${Date.now()}-${Math.round(Math.random()*1e9)}-${originalName}`;
          const url = await uploadBuffer(request.file.buffer, filename, request.file.mimetype);
          logo_grupo = url;
        } catch (err) {
          console.error('Error subiendo logo a Blob:', err);
          return response.status(500).json({ success: false, message: 'Error subiendo el logo' });
        }
      }

      // VALIDACIONES
      // ==========================

      if (!actividad || actividad.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'La actividad es obligatoria',
        });
      }

      if (actividad.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La actividad no puede exceder los 255 caracteres',
        });
      }

      // ==========================
      // LLAMAR AL MODEL
      // ==========================

      const newGrupo = await gruposModel.create({
        actividad: actividad.trim(),
        logo_grupo,
      });

      return response.status(201).json({
        success: true,
        data: newGrupo,
        message: 'Grupo creado correctamente',
      });
    } catch (error) {
      console.error('Error al crear grupo:', error);
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
      const { actividad } = request.body;

      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de grupo inválido',
        });
      }

      if (actividad !== undefined && actividad.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'La actividad no puede estar vacía',
        });
      }

      if (actividad !== undefined && actividad.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La actividad no puede exceder los 255 caracteres',
        });
      }

      const existingGrupo = await gruposModel.getById({ id: Number(id) });
      if (!existingGrupo) {
        return response.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      const updatedGrupo = await gruposModel.update({
        id: Number(id),
        actividad: actividad ? actividad.trim() : undefined,
      });

      return response.status(200).json({
        success: true,
        data: updatedGrupo,
        message: 'Grupo actualizado correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
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

      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de grupo inválido',
        });
      }

      const existingGrupo = await gruposModel.getById({ id: Number(id) });
      if (!existingGrupo) {
        return response.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      const deletedGrupo = await gruposModel.delete({ id: Number(id) });

      return response.status(200).json({
        success: true,
        data: deletedGrupo,
        message: 'Grupo eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
