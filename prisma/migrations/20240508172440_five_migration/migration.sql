/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Credentials_email_key` ON `Credentials`(`email`);
