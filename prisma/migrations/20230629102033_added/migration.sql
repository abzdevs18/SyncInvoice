-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `avatarColor` VARCHAR(191) NULL,
    `issuedDate` DATETIME(3) NOT NULL,
    `companyEmail` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL,
    `invoiceStatus` ENUM('PAID', 'UNPAID', 'OVERDUE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
