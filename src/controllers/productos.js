import { productosModel } from '../models/productos.js';
import { uploadBuffer } from '../lib/blobStorage.js';

export class productosController {
  static async getAll(request, response) {
    try {
      const productos = await productosModel.getAll();
      return response.status(200).json({
        success: true,
        data: productos,
        message: 'Productos obtenidos correctamente',
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
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
          message: 'ID de producto inválido',
        });
      }

      const producto = await productosModel.getById({ id: Number(id) });

      if (!producto) {
        return response.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      return response.status(200).json({
        success: true,
        data: producto,
        message: 'Producto obtenido correctamente',
      });
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  static async create(request, response) {
    try {
      const { nombre, descripcion, precio } = request.body;

      // ==========================
      // IMAGEN -> subir a Blob y guardar URL
      // ==========================

      let img_prodcto = undefined;
      if (request.file && request.file.buffer) {
        try {
          const originalName = request.file.originalname ?? 'file';
          const filename = `producto-${Date.now()}-${Math.round(Math.random()*1e9)}-${originalName}`;
          const url = await uploadBuffer(request.file.buffer, filename, request.file.mimetype);
          img_prodcto = url;
        } catch (err) {
          console.error('Error subiendo imagen a Blob:', err);
          return response.status(500).json({ success: false, message: 'Error subiendo la imagen' });
        }
      }

      // VALIDACIONES
      // ==========================

      if (!nombre || nombre.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'El nombre del producto es obligatorio',
        });
      }

      if (nombre.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre del producto no puede exceder los 255 caracteres',
        });
      }

      if (precio === undefined || Number.isNaN(Number(precio)) || Number(precio) < 0) {
        return response
          .status(400)
          .json({
            success: false,
            message: 'El precio es obligatorio y debe ser un número válido mayor o igual a 0',
          });
      }


      // ==========================
      // LLAMAR AL MODEL
      // ==========================

      const producto = await productosModel.create({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim(),
        precio: Number(precio),
        img_prodcto,
      });

      return response.status(201).json({
        success: true,
        data: producto,
        message: 'Producto creado correctamente',
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
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
      const { nombre, descripcion, precio } = request.body;

      // Validaciones
      if (!id || Number.isNaN(Number(id))) {
        return response.status(400).json({
          success: false,
          message: 'ID de producto inválido',
        });
      }

      if (nombre !== undefined && nombre.trim() === '') {
        return response.status(400).json({
          success: false,
          message: 'El nombre del producto no puede estar vacío',
        });
      }

      if (nombre !== undefined && nombre.length > 255) {
        return response.status(400).json({
          success: false,
          message: 'El nombre del producto no puede exceder los 255 caracteres',
        });
      }

      if (precio !== undefined && (Number.isNaN(Number(precio)) || Number(precio) < 0)) {
        return response.status(400).json({
          success: false,
          message: 'El precio debe ser un número válido mayor o igual a 0',
        });
      }

      // Verificar si el producto existe
      const existingProducto = await productosModel.getById({ id: Number(id) });
      if (!existingProducto) {
        return response.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      const producto = await productosModel.update({
        id: Number(id),
        nombre: nombre ? nombre.trim() : undefined,
        descripcion: descripcion ? descripcion.trim() : undefined,
        precio: precio !== undefined ? Number(precio) : undefined,
      });

      return response.status(200).json({
        success: true,
        data: producto,
        message: 'Producto actualizado correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
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
          message: 'ID de producto inválido',
        });
      }

      // Verificar si el producto existe antes de eliminar
      const existingProducto = await productosModel.getById({ id: Number(id) });
      if (!existingProducto) {
        return response.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      const producto = await productosModel.delete({ id: Number(id) });

      return response.status(200).json({
        success: true,
        data: producto,
        message: 'Producto eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return response.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
