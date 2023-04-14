-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `grossTotalAmount` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `totalAmount` DOUBLE NOT NULL DEFAULT 0;
