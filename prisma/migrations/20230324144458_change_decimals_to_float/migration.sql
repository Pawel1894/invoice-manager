/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `price` on the `invoiceitem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `total` on the `invoiceitem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `totalAmount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `invoiceitem` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `total` DOUBLE NOT NULL;
