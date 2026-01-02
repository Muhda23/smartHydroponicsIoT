-- CreateTable
CREATE TABLE `dataMonitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ppm` INTEGER NOT NULL,
    `suhu` INTEGER NOT NULL,
    `volume` DOUBLE NOT NULL,
    `monitoringAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
