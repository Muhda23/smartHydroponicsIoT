/*
  Warnings:

  - You are about to alter the column `volume` on the `datakontrols` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `Vnutrisi` on the `datakontrols` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `active_pump` on the `datakontrols` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `flowrate` on the `parameters` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `datakontrols` MODIFY `volume` DOUBLE NOT NULL,
    MODIFY `Vnutrisi` DOUBLE NOT NULL,
    MODIFY `active_pump` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `parameters` MODIFY `flowrate` DOUBLE NOT NULL;
