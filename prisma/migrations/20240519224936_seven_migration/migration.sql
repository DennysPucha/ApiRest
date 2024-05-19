/*
  Warnings:

  - Added the required column `rol_id` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Credentials` ADD COLUMN `rol_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT 'default',
    `state` BOOLEAN NOT NULL DEFAULT true,
    `external_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rol_external_id_key`(`external_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Rol`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
