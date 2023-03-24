/*
  Warnings:

  - Added the required column `bankAccount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `bankAccount` VARCHAR(191) NOT NULL;
