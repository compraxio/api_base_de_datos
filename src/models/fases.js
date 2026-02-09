import { PrismaClient } from '@prisma/client'
import { deleteBlob } from '../lib/blobStorage.js';

const prisma = new PrismaClient()

export class fasesModel {
  static async getAll() {
    const fases = await prisma.fases.findMany();
    return fases;
  }
  static async getById({ id }) {
    const fase = await prisma.fases.findFirst({
      where: {
        id_fase: id,
      },
    });
    return fase;
  }
  static async create({
    des_fase,
    logo_fase,
    id_fasex,
  }) {
    const fase = await prisma.fases.create({
      data: {
        des_fase: des_fase,
        logo_fase: logo_fase,
        id_fasex: id_fasex,
      },
    });
    return fase;
  }
  static async update({
    id,
    des_fase,
    id_fasex,
  }) {
    const fase = await prisma.fases.update({
      where: {
        id_fase: id,
      },
      data: {
        des_fase: des_fase,
        id_fasex: id_fasex,
      },
    });
    return fase;
  }
  static async delete({ id }) {
    // Obtener la fase antes de eliminar para borrar el logo
    const fase = await prisma.fases.findFirst({
      where: {
        id_fase: id,
      },
    });

    // Eliminar logo de Blob si existe
    if (fase?.logo_fase) {
      try {
        await deleteBlob(fase.logo_fase);
      } catch (error) {
        console.error(`Error eliminando logo ${fase.logo_fase}:`, error);
        // Continuar con la eliminación aunque falle el borrado del archivo
      }
    }

    // Eliminar la fase de la BD
    const faseEliminada = await prisma.fases.delete({
      where: {
        id_fase: id,
      },
    });
    return faseEliminada;
  }
}
