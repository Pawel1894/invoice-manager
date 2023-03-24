/*
  Warnings:

  - Added the required column `status` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `status` ENUM('DRAFT', 'PENDING', 'PAID') NOT NULL,
    ADD COLUMN `totalAmount` DECIMAL(65, 30) NOT NULL;
