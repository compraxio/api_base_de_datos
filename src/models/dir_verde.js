import { PrismaClient } from '@prisma/client'
import { deleteBlob } from '../lib/blobStorage.js';


const prisma = new PrismaClient()

export class dir_verdeModel {
  static async getAll() {
    const dir_verde = await prisma.dir_verde.findMany({
      include: {
        criterios: true,
        fotografias: true,
        grupo: true,
      },
    });

    return dir_verde;
  }
  static async getById({ id_negocio }) {
    const dir_verde = await prisma.dir_verde.findFirst({
      where: {
        id_negocio: id_negocio,
      },
      include: {
        criterios: true,
        fotografias: true,
        grupo: true,
      },
    });
    return dir_verde;
  }
  static async getByCorreo({ correo }) {
    const dir_verde = await prisma.dir_verde.findFirst({
      where: {
        correo,
      },
    });
    return dir_verde;
  }

  static async create({
    negocio,
    id_grupo,
    criterios_ids = [],
    sub_categoria,
    descripcion,
    actividad,
    unidad_productiva,
    zona,
    municipio,
    direccion,
    representante,
    whatsup,
    logo,
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
    foto,
  }) {
    const dirVerde = await prisma.dir_verde.create({
      data: {
        // Campos simples
        negocio,
        sub_categoria,
        descripcion,
        actividad,
        unidad_productiva,
        zona,
        municipio,
        direccion,
        representante,
        whatsup,
        logo,
        url_youtube,
        url_facebook,
        url_instagram,
        url_tiktok,
        correo: correo || '',
        url_negocio,
        pos_gps,
        id_fase,
        estado,
        ano_verificacion,
        autorizado_por,

        // Relación con grupo
        grupo: {
          connect: { id_grupo },
        },

        // Relación muchos a muchos
        criterios: {
          create: criterios_ids.map((id) => ({
            criterio: {
              connect: { id_criterio: id },
            },
          })),
        },

        // Fotos
        fotografias: foto
          ? {
              create: { url_foto: foto },
            }
          : undefined,
      },
      include: {
        grupo: true,

        fotografias: true,

        criterios: {
          include: {
            criterio: true,
          },
        },
      },
    });

    return dirVerde;
  }

  static async delete({ id_negocio }) {
    // Obtener el negocio con sus fotos antes de eliminar
    const negocio = await prisma.dir_verde.findFirst({
      where: { id_negocio },
      include: {
        fotografias: true,
      },
    });

    // Eliminar archivos de Blob
    if (negocio?.fotografias) {
      for (const foto of negocio.fotografias) {
        if (foto.url_foto) {
          try {
            await deleteBlob(foto.url_foto);
          } catch (error) {
            console.error(`Error eliminando foto ${foto.url_foto}:`, error);
            // Continuar con la eliminación aunque falle el borrado del archivo
          }
        }
      }
    }

    const result = await prisma.$transaction([
      // borrar tabla puente
      prisma.dir_verde_vs_criterios.deleteMany({
        where: { id_negocio },
      }),

      // borrar fotos de la BD
      prisma.fotografias.deleteMany({
        where: { id_negocio },
      }),

      // borrar negocio
      prisma.dir_verde.delete({
        where: { id_negocio },
      }),
    ]);

    return result;
  }
}
