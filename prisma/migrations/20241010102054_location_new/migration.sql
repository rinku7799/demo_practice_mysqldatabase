/*
  Warnings:

  - You are about to drop the column `code` on the `country` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `state` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `State` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Country_code_key` ON `country`;

-- DropIndex
DROP INDEX `State_code_key` ON `state`;

-- AlterTable
ALTER TABLE `country` DROP COLUMN `code`;

-- AlterTable
ALTER TABLE `state` DROP COLUMN `code`;

-- CreateIndex
CREATE UNIQUE INDEX `City_name_key` ON `City`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Country_name_key` ON `Country`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `State_name_key` ON `State`(`name`);
