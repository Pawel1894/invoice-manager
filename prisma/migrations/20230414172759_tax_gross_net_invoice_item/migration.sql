/*
  Warnings:

  - You are about to drop the column `total` on the `invoiceitem` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gross` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `net` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `clientId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `invoiceitem` DROP COLUMN `total`,
    ADD COLUMN `gross` DOUBLE NOT NULL,
    ADD COLUMN `net` DOUBLE NOT NULL,
    ADD COLUMN `tax` DOUBLE NOT NULL;
