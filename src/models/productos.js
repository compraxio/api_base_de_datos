import { PrismaClient } from '@prisma/client'
import { deleteBlob } from '../lib/blobStorage.js';

const prisma = new PrismaClient()

export class productosModel {
  static async getAll() {
    const productos = await prisma.productos.findMany();
    return productos;
  }
  static async getById({ id }) {
    const producto = await prisma.productos.findFirst({
      where: {
        id_prodcucto: id,
      },
    });
    return producto;
  }
  static async create({
    nombre,
    descripcion,
    precio,
    img_prodcto,
  }) {
    const producto = await prisma.productos.create({
      data: {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        img_prodcto: img_prodcto,
      },
    });
    return producto;
  }
  static async update({
    id,
    nombre,
    descripcion,
    precio,
  }) {
    const producto = await prisma.productos.update({
      where: {
        id_prodcucto: id,
      },
      data: {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
      },
    });
    return producto;
  }
  static async delete({ id }) {
    // Obtener el producto antes de eliminar para borrar la imagen
    const producto = await prisma.productos.findFirst({
      where: {
        id_prodcucto: id,
      },
    });

    // Eliminar imagen de Blob si existe
    if (producto?.img_prodcto) {
      try {
        await deleteBlob(producto.img_prodcto);
      } catch (error) {
        console.error(`Error eliminando imagen ${producto.img_prodcto}:`, error);
        // Continuar con la eliminación aunque falle el borrado del archivo
      }
    }

    // Eliminar el producto de la BD
    const productoEliminado = await prisma.productos.delete({
      where: {
        id_prodcucto: id,
      },
    });

    return productoEliminado;
  }
}
