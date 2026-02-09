import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class municipiosModel {
  static async getAll() {
    const municipios = await prisma.municipios.findMany();
    return municipios;
  }
  static async getById({ id }) {
    const municipio = await prisma.municipios.findFirst({
      where: {
        cod_munic: id,
      },
    });
    return municipio;
  }
  static async create({
    cod_munic,
    departamento,
    zona,
    municipio,
  }) {
    const newMunicipio = await prisma.municipios.create({
      data: {
        cod_munic,
        departamento,
        zona,
        municipio,
      },
    });
    return newMunicipio;
  }
  static async update({
    id,
    departamento,
    zona,
    municipio,
  }) {
    const updatedMunicipio = await prisma.municipios.update({
      where: {
        cod_munic: id,
      },
      data: {
        departamento,
        zona,
        municipio,
      },
    });
    return updatedMunicipio;
  }
  static async delete({ id }) {
    const deletedMunicipio = await prisma.municipios.delete({
      where: {
        cod_munic: id,
      },
    });
    return deletedMunicipio;
  }
}
