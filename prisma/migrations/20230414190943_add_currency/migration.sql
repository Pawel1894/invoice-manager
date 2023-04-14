/*
  Warnings:

  - Added the required column `currencyCountry` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `currencyCountry` VARCHAR(191) NOT NULL;
