import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class contactosModel {
  static async getAll() {
    const contactos = await prisma.contactos.findMany();
    return contactos;
  }
  static async getById({ id }) {
    const contacto = await prisma.contactos.findFirst({
      where: {
        id_contacto: id,
      },
    });
    return contacto;
  }
  static async getByTelefono({ telefono }) {
    const contacto = await prisma.contactos.findFirst({
      where: {
        telefono,
      },
    });
    return contacto;
  }
  static async getByCorreo({ correo }) {
    const contacto = await prisma.contactos.findFirst({
      where: {
        correo,
      },
    });
    return contacto;
  }
  static async create({
    nombre,
    telefono,
    correo,
  }) {
    const contacto = await prisma.contactos.create({
      data: {
        nombre: nombre,
        telefono: telefono,
        correo: correo,
      },
    });
    return contacto;
  }
  static async update({
    id,
    nombre,
    telefono,
    correo,
  }) {
    const contacto = await prisma.contactos.update({
      where: {
        id_contacto: id,
      },
      data: {
        nombre: nombre,
        telefono: telefono,
        correo: correo,
      },
    });
    return contacto;
  }
  static async delete({ id }) {
    const contacto = await prisma.contactos.delete({
      where: {
        id_contacto: id,
      },
    });

    return contacto;
  }
}
