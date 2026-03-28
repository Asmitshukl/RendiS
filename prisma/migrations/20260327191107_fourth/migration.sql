/*
  Warnings:

  - You are about to drop the column `data` on the `Worklow` table. All the data in the column will be lost.
  - Added the required column `name` to the `Worklow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Worklow" DROP COLUMN "data",
ADD COLUMN     "name" TEXT NOT NULL;
