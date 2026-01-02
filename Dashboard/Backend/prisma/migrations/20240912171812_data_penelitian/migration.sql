 -- CreateTable
CREATE TABLE `DataKontrols` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `suhu` INTEGER NOT NULL,
    `volume` INTEGER NOT NULL,
    `ppm_before` INTEGER NOT NULL,
    `ppm_after` INTEGER NOT NULL,
    `selisih` INTEGER NOT NULL,
    `Vnutrisi` INTEGER NOT NULL,
    `active_pump` INTEGER NOT NULL,
    `setpoint` INTEGER NOT NULL,
    `controlAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parameters` (
    `id` INTEGER NOT NULL,
    `setpoint_atas` INTEGER NOT NULL,
    `setpoint_bawah` INTEGER NOT NULL,
    `panjang` DOUBLE NOT NULL,
    `lebar` DOUBLE NOT NULL,
    `tinggi` DOUBLE NOT NULL,
    `flowrate` INTEGER NOT NULL,
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
