/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `invoiceDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `paymentDate`,
    ADD COLUMN `invoiceDate` DATETIME(3) NOT NULL;
