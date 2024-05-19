/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rol_name_key` ON `Rol`(`name`);
