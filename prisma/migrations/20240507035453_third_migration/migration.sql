/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Credentials_external_id_key` ON `Credentials`(`external_id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_external_id_key` ON `User`(`external_id`);
