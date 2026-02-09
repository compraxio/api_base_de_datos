import { PrismaClient } from '@prisma/client'
import { deleteBlob } from '../lib/blobStorage.js';
const prisma = new PrismaClient()

export class gruposModel {
  static async getAll() {
    const grupos = await prisma.grupos.findMany({
      include: {
        negocio: true,
      },
    });
    return grupos;
  }

  static async getById({ id }) {
    const grupo = await prisma.grupos.findFirst({
      where: {
        id_grupo: id,
      },
      include: {
        negocio: true,
      },
    });
    return grupo;
  }

  static async create({ actividad, logo_grupo }) {
    const newGrupo = await prisma.grupos.create({
      data: {
        actividad,
        logo_grupo,
      },
      include: {
        negocio: true,
      },
    });
    return newGrupo;
  }

  static async update({ id, actividad }) {
    const updatedGrupo = await prisma.grupos.update({
      where: {
        id_grupo: id,
      },
      data: {
        actividad,
      },
      include: {
        negocio: true,
      },
    });
    return updatedGrupo;
  }

  static async delete({ id }) {
    // Obtener el grupo antes de eliminar para borrar el logo
    const grupo = await prisma.grupos.findFirst({
      where: {
        id_grupo: id,
      },
    });

    // Eliminar logo de Blob si existe
    if (grupo?.logo_grupo) {
      try {
        await deleteBlob(grupo.logo_grupo);
      } catch (error) {
        console.error(`Error eliminando logo ${grupo.logo_grupo}:`, error);
        // Continuar con la eliminación aunque falle el borrado del archivo
      }
    }

    // Eliminar el grupo de la BD
    const deletedGrupo = await prisma.grupos.delete({
      where: {
        id_grupo: id,
      },
      include: {
        negocio: true,
      },
    });
    return deletedGrupo;
  }
}
