/*
  Warnings:

  - You are about to alter the column `images` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `sizes` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `images` JSON NOT NULL,
    MODIFY `sizes` JSON NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `cartData` JSON NOT NULL,
    ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `items` JSON NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `address` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Order Placed',
    `paymentMethod` VARCHAR(191) NOT NULL,
    `payment` BOOLEAN NOT NULL DEFAULT false,
    `date` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;