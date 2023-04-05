/*
  Warnings:

  - You are about to drop the column `companyId` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `idNo` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `companyId`,
    DROP COLUMN `companyName`,
    ADD COLUMN `idNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
