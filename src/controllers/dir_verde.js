import { dir_verdeModel } from '../models/dir_verde.js';
import { uploadBuffer } from '../lib/blobStorage.js';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
export class dir_verdeController {
  static async getAll(request, response) {
    try {
      const tiendas = await dir_verdeModel.getAll();
      return response.status(200).json({
        success: true,
        data: tiendas,
        message: 'tiendas obtenidas correctamente',
      });
    } catch (error) {
      console.error('Error al obtener tienda:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async getById(request, response) {
    try {
      const { id_negocio } = request.params;

      // Validaciones
      if (!id_negocio || Number.isNaN(Number(id_negocio))) {
        return response.status(400).json({
          success: false,
          message: 'id_negocio inválido',
        });
      }

      const negocio = await dir_verdeModel.getById({ id_negocio: Number(id_negocio) });

      if (!negocio) {
        return response.status(404).json({
          success: false,
          message: 'negocio no encontrado',
        });
      }

      return response.status(200).json({
        success: true,
        data: negocio,
        message: 'negocio obtenido correctamente',
      });
    } catch (error) {
      console.error('Error al obtener negocio por id_negocio:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async create(request, response) {
    try {
      const {
        negocio,
        id_grupo,
        criterios_ids,
        sub_categoria,
        descripcion,
        actividad,
        unidad_productiva,
        zona,
        municipio,
        direccion,
        representante,
        whatsup,
        url_youtube,
        url_facebook,
        url_instagram,
        url_tiktok,
        correo,
        url_negocio,
        pos_gps,
        id_fase,
        estado,
        ano_verificacion,
        autorizado_por,
      } = request.body;

      // ==========================
      // FOTO -> subir a Blob y guardar URL
      // ==========================

      let dir_verde = undefined;
      if (request.file && request.file.buffer) {
        try {
          const originalName = request.file.originalname ?? 'file';
          const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}-${originalName}`;
          const url = await uploadBuffer(request.file.buffer, filename, request.file.mimetype);
          dir_verde = url;
        } catch (err) {
          console.error('Error subiendo imagen a Blob:', err);
          return response.status(500).json({ success: false, message: 'Error subiendo la imagen' });
        }
      }
      // VALIDACIONES
      // ==========================

      if (!negocio || negocio.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'negocio es obligatorio',
        });
      }

      if (!id_grupo || Number.isNaN(Number(id_grupo))) {
        return response.status(400).json({
          success: false,
          message: 'id_grupo inválido',
        });
      }

      if (!actividad || actividad.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'actividad es obligatoria',
        });
      }

      if (negocio.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre del negocio no puede exceder los 255 caracteres',
        });
      }

      if (actividad.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La actividad no puede exceder los 255 caracteres',
        });
      }

      if (direccion && direccion.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La dirección no puede exceder los 255 caracteres',
        });
      }

      if (correo && correo.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return response.status(400).json({
          success: false,
          message: 'El correo electrónico no es válido',
        });
      }

      const existingNegocio = await dir_verdeModel.getByCorreo({ correo });

      if (existingNegocio) {
        return response.status(409).json({
          success: false,
          message: 'este negocio ya existe, el correo es igual.',
        });
      }

      // Validar que el grupo existe
      const grupo = await prisma.grupos.findFirst({
        where: { id_grupo: Number(id_grupo) },
      });

      if (!grupo) {
        return response.status(400).json({
          success: false,
          message: 'El grupo especificado no existe',
        });
      }

      // Validar que todos los criterios existen
      if (Array.isArray(criterios_ids) && criterios_ids.length > 0) {
        const criteriosExistentes = await prisma.criterios.findMany({
          where: {
            id_criterio: {
              in: criterios_ids,
            },
          },
        });

        if (criteriosExistentes.length !== criterios_ids.length) {
          return response.status(400).json({
            success: false,
            message: 'Uno o más criterios especificados no existen',
          });
        }
      }
      // ==========================
      // LLAMAR AL MODEL
      // ==========================

      const nuevoNegocio = await dir_verdeModel.create({
        negocio,
        id_grupo: Number(id_grupo),
        criterios_ids,
        sub_categoria,
        descripcion,
        actividad,
        unidad_productiva,
        zona,
        municipio,
        direccion,
        representante,
        whatsup,
        url_youtube,
        url_facebook,
        url_instagram,
        url_tiktok,
        correo,
        url_negocio,
        pos_gps,
        id_fase: id_fase ? Number(id_fase) : undefined,
        estado,
        ano_verificacion: ano_verificacion ? Number(ano_verificacion) : undefined,
        autorizado_por,
        foto: dir_verde,
      });

      return response.status(201).json({
        success: true,
        message: 'Negocio creado correctamente',
        data: nuevoNegocio,
      });
    } catch (error) {
      console.error('Error:', error);

      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async delete(request, response) {
    try {
      const { id_negocio } = request.params;

      // Validaciones
      if (!id_negocio || Number.isNaN(Number(id_negocio))) {
        return response.status(400).json({
          success: false,
          message: 'id_negocio inválido',
        });
      }

      // Verificar si la negocio existe antes de eliminar
      const existingNegocio = await dir_verdeModel.getById({ id_negocio: Number(id_negocio) });
      if (!existingNegocio) {
        return response.status(404).json({
          success: false,
          message: 'negocio no encontrado',
        });
      }

      const negocio = await dir_verdeModel.delete({ id_negocio: Number(id_negocio) });

      return response.status(200).json({
        success: true,
        data: negocio,
        message: 'negocio eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar negocio:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
