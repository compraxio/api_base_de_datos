-- CreateTable
CREATE TABLE "contactos" (
    "id_contacto" SERIAL NOT NULL,
    "nombre" TEXT,
    "telefono" TEXT,
    "correo" TEXT,

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id_contacto")
);

-- CreateTable
CREATE TABLE "municipios" (
    "cod_munic" SERIAL NOT NULL,
    "departamento" TEXT NOT NULL,
    "zona" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("cod_munic")
);

-- CreateTable
CREATE TABLE "estados" (
    "estado" TEXT NOT NULL,
    "des_estado" TEXT,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("estado")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_prodcucto" SERIAL NOT NULL,
    "nombre" TEXT,
    "descripcion" TEXT,
    "precio" INTEGER,
    "img_prodcto" TEXT,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_prodcucto")
);

-- CreateTable
CREATE TABLE "fases" (
    "id_fase" SERIAL NOT NULL,
    "des_fase" TEXT NOT NULL,
    "logo_fase" TEXT NOT NULL,
    "id_fasex" TEXT,

    CONSTRAINT "fases_pkey" PRIMARY KEY ("id_fase")
);

-- CreateTable
CREATE TABLE "videos" (
    "id_video" SERIAL NOT NULL,
    "url_video" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id_video")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id_evento" SERIAL NOT NULL,
    "evento" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "fecha" TEXT,
    "hora" TEXT,
    "link" TEXT,
    "temas" TEXT,
    "tipo_evento" TEXT,
    "estado" TEXT NOT NULL,
    "Img_Presentacion" TEXT NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "dir_verde" (
    "id_negocio" SERIAL NOT NULL,
    "negocio" TEXT NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "sub_categoria" TEXT,
    "descripcion" TEXT,
    "actividad" TEXT NOT NULL,
    "unidad_productiva" TEXT,
    "zona" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "representante" TEXT,
    "whatsup" TEXT,
    "logo" TEXT,
    "url_youtube" TEXT,
    "url_facebook" TEXT,
    "url_instagram" TEXT,
    "url_tiktok" TEXT,
    "correo" TEXT NOT NULL,
    "url_negocio" TEXT,
    "pos_gps" TEXT,
    "id_fase" INTEGER,
    "estado" TEXT,
    "año_verificacion" INTEGER,
    "autorizado_por" TEXT,

    CONSTRAINT "dir_verde_pkey" PRIMARY KEY ("id_negocio")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id_grupo" SERIAL NOT NULL,
    "actividad" TEXT NOT NULL,
    "logo_grupo" TEXT,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "criterios" (
    "id_criterio" INTEGER NOT NULL,
    "criterio" TEXT NOT NULL,

    CONSTRAINT "criterios_pkey" PRIMARY KEY ("id_criterio")
);

-- CreateTable
CREATE TABLE "fotografias" (
    "id_foto" SERIAL NOT NULL,
    "id_negocio" INTEGER NOT NULL,
    "url_foto" TEXT,

    CONSTRAINT "fotografias_pkey" PRIMARY KEY ("id_foto")
);

-- CreateTable
CREATE TABLE "dir_verde_vs_criterios" (
    "id_negocio" INTEGER NOT NULL,
    "id_criterio" INTEGER NOT NULL,

    CONSTRAINT "dir_verde_vs_criterios_pkey" PRIMARY KEY ("id_negocio","id_criterio")
);

-- CreateIndex
CREATE UNIQUE INDEX "contactos_telefono_key" ON "contactos"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "contactos_correo_key" ON "contactos"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "dir_verde_correo_key" ON "dir_verde"("correo");

-- AddForeignKey
ALTER TABLE "dir_verde" ADD CONSTRAINT "dir_verde_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupos"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotografias" ADD CONSTRAINT "fotografias_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "dir_verde"("id_negocio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dir_verde_vs_criterios" ADD CONSTRAINT "dir_verde_vs_criterios_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "dir_verde"("id_negocio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dir_verde_vs_criterios" ADD CONSTRAINT "dir_verde_vs_criterios_id_criterio_fkey" FOREIGN KEY ("id_criterio") REFERENCES "criterios"("id_criterio") ON DELETE RESTRICT ON UPDATE CASCADE;
