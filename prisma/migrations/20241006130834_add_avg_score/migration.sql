/*
  Warnings:

  - You are about to alter the column `percentage` on the `QuizResult` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `QuizResult` MODIFY `percentage` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `totalQuestions` INTEGER NOT NULL DEFAULT 0;
