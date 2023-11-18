-- CreateTable
CREATE TABLE `aans__admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `m_name` VARCHAR(255) NULL,
    `l_name` VARCHAR(255) NULL,
    `gender` VARCHAR(10) NULL,
    `s_dob` DATE NULL,
    `s_placeofbirth` VARCHAR(255) NULL,
    `nationality` VARCHAR(255) NULL,
    `learning__modality` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_accommodation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `is_signed` BOOLEAN NULL,
    `mode_travel` VARCHAR(255) NULL,
    `pickup_place` VARCHAR(255) NULL,
    `driver_name` VARCHAR(255) NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `platform` VARCHAR(255) NULL,
    `account` VARCHAR(255) NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_family` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `relationship` VARCHAR(255) NULL,
    `f_name` VARCHAR(255) NULL,
    `m_name` VARCHAR(255) NULL,
    `l_name` VARCHAR(255) NULL,
    `nationality` VARCHAR(255) NULL,
    `occupation` VARCHAR(255) NULL,
    `religion` VARCHAR(255) NULL,
    `contact` VARCHAR(20) NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_financial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `f_name` VARCHAR(255) NULL,
    `l_name` VARCHAR(255) NULL,
    `m_name` VARCHAR(255) NULL,
    `relationship` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_medical` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `blood_type` VARCHAR(10) NULL,
    `allergies` VARCHAR(255) NULL,
    `treatment` VARCHAR(255) NULL,
    `height` FLOAT NULL,
    `weight` FLOAT NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_prev_school` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `last_school_attended` VARCHAR(255) NULL,
    `school_year` VARCHAR(20) NULL,
    `school_address` VARCHAR(255) NULL,
    `school_principal` VARCHAR(255) NULL,
    `school_contact` VARCHAR(20) NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aans__student_religious_affiliation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id` INTEGER NULL,
    `religion` VARCHAR(255) NULL,
    `is_baptized` BOOLEAN NULL,
    `date_baptize` DATE NULL,

    INDEX `fk_id`(`fk_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
