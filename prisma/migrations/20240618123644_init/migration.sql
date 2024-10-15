-- CreateTable
CREATE TABLE `Userprofile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `mobileNumber` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,

    UNIQUE INDEX `Userprofile_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
