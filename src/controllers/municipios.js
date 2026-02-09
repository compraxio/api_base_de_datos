import { municipiosModel } from '../models/municipios.js';

export class municipiosController {
  static async getAll(request, response) {
    try {
      const municipios = await municipiosModel.getAll();
      return response.status(200).json({
        success: true,
        data: municipios,
        message: 'Municipios obtenidos correctamente',
      });
    } catch (error) {
      console.error('Error al obtener municipios:', error);
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
          message: 'ID de municipio inválido',
        });
      }

      const municipio = await municipiosModel.getById({ id: Number(id) });

      if (!municipio) {
        return response.status(404).json({
          success: false,
          message: 'Municipio no encontrado',
        });
      }

      return response.status(200).json({
        success: true,
        data: municipio,
        message: 'Municipio obtenido correctamente',
      });
    } catch (error) {
      console.error('Error al obtener municipio por ID:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async create(request, response) {
    try {
      const { cod_munic, departamento, zona, municipio } = request.body;

      // Validaciones
      if (!cod_munic || Number.isNaN(Number(cod_munic))) {
        return response.status(400).json({
          success: false,
          message: 'El código de municipio es obligatorio y debe ser un número',
        });
      }

      if (!departamento || departamento.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'El departamento es obligatorio',
        });
      }
      if (departamento.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El departamento no puede exceder los 255 caracteres',
        });
      }

      if (!zona || zona.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'La zona es obligatoria',
        });
      }
      if (zona.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La zona no puede exceder los 255 caracteres',
        });
      }

      if (!municipio || municipio.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'El municipio es obligatorio',
        });
      }
      if (municipio.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El municipio no puede exceder los 255 caracteres',
        });
      }

      const existingMunicipio = await municipiosModel.getById({ id: cod_munic });

      if (existingMunicipio) {
        return response.status(409).json({
          success: false,
          message: 'Ya existe este municipio, hay coincidencia en el codigo',
        });
      }

      const newMunicipio = await municipiosModel.create({
        cod_munic: Number(cod_munic),
        departamento: departamento.trim(),
        zona: zona.trim(),
        municipio: municipio.trim(),
      });
      return response.status(201).json({
        success: true,
        data: newMunicipio,
        message: 'Municipio creado correctamente',
      });
    } catch (error) {
      console.error('Error al crear municipio:', error);
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
      const { departamento, zona, municipio } = request.body;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de municipio inválido',
        });
      }

      if (departamento !== undefined && departamento.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'El departamento no puede estar vacío',
        });
      }
      if (departamento !== undefined && departamento.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El departamento no puede exceder los 255 caracteres',
        });
      }

      if (zona !== undefined && zona.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'La zona no puede estar vacía',
        });
      }
      if (zona !== undefined && zona.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'La zona no puede exceder los 255 caracteres',
        });
      }

      if (municipio !== undefined && municipio.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'El municipio no puede estar vacío',
        });
      }
      if (municipio !== undefined && municipio.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El municipio no puede exceder los 255 caracteres',
        });
      }

      // Verificar si el municipio existe
      const existingMunicipio = await municipiosModel.getById({ id: Number(id) });
      if (!existingMunicipio) {
        return response.status(404).json({
          success: false,
          message: 'Municipio no encontrado',
        });
      }

      const updatedMunicipio = await municipiosModel.update({
        id: Number(id),
        departamento: departamento ? departamento.trim() : undefined,
        zona: zona ? zona.trim() : undefined,
        municipio: municipio ? municipio.trim() : undefined,
      });
      return response.status(200).json({
        success: true,
        data: updatedMunicipio,
        message: 'Municipio actualizado correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar municipio:', error);
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
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de municipio inválido',
        });
      }

      // Verificar si el municipio existe antes de eliminar
      const existingMunicipio = await municipiosModel.getById({ id: Number(id) });
      if (!existingMunicipio) {
        return response.status(404).json({
          success: false,
          message: 'Municipio no encontrado',
        });
      }

      const deletedMunicipio = await municipiosModel.delete({ id: Number(id) });
      return response.status(200).json({
        success: true,
        data: deletedMunicipio,
        message: 'Municipio eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar municipio:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
