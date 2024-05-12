/*
  Warnings:

  - You are about to drop the column `estado` on the `Credentials` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Credentials` DROP FOREIGN KEY `Credentials_user_id_fkey`;

-- AlterTable
ALTER TABLE `Credentials` DROP COLUMN `estado`,
    ADD COLUMN `state` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `state` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
