import { PrismaClient } from '@prisma/client'
import { deleteBlob } from '../lib/blobStorage.js';

const prisma = new PrismaClient()

export class eventosModel {
  static async getAll() {
    const eventos = await prisma.eventos.findMany();
    return eventos;
  }

  static async getById({ id }) {
    const evento = await prisma.eventos.findFirst({
      where: {
        id_evento: id,
      },
    });
    return evento;
  }

  static async create({
    evento,
    direccion,
    fecha,
    hora,
    link,
    temas,
    tipo_evento,
    estado,
    Img_Presentacion,
  }) {
    const eventoCreado = await prisma.eventos.create({
      data: {
        evento: evento,
        direccion: direccion,
        fecha: fecha,
        hora: hora,
        link: link,
        temas: temas,
        tipo_evento: tipo_evento,
        estado: estado,
        Img_Presentacion: Img_Presentacion,
      },
    });
    return eventoCreado;
  }

  static async update({
    id,
    evento,
    direccion,
    fecha,
    hora,
    link,
    temas,
    tipo_evento,
    estado,
  }) {
    const eventoActualizado = await prisma.eventos.update({
      where: {
        id_evento: id,
      },
      data: {
        evento: evento,
        direccion: direccion,
        fecha: fecha,
        hora: hora,
        link: link,
        temas: temas,
        tipo_evento: tipo_evento,
        estado: estado,
      },
    });
    return eventoActualizado;
  }

  static async delete({ id }) {
    // Obtener el evento antes de eliminar para borrar la imagen
    const evento = await prisma.eventos.findFirst({
      where: {
        id_evento: id,
      },
    });

    // Eliminar imagen de Blob si existe
    if (evento?.Img_Presentacion) {
      try {
        await deleteBlob(evento.Img_Presentacion);
      } catch (error) {
        console.error(`Error eliminando imagen ${evento.Img_Presentacion}:`, error);
        // Continuar con la eliminación aunque falle el borrado del archivo
      }
    }

    // Eliminar el evento de la BD
    const eventoEliminado = await prisma.eventos.delete({
      where: {
        id_evento: id,
      },
    });
    return eventoEliminado;
  }
}
