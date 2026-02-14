/*
  Warnings:

  - The `precio` column on the `productos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "productos" DROP COLUMN "precio",
ADD COLUMN     "precio" INTEGER;
