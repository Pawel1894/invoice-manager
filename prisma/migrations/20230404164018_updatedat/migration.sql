/*
  Warnings:

  - Made the column `updatedAt` on table `invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
