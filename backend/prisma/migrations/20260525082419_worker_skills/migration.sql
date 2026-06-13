-- CreateEnum
CREATE TYPE "WorkerSkill" AS ENUM ('PLUMBER', 'ELECTRICIAN', 'CARPENTER', 'CLEANER', 'PAINTER', 'TECHNICIAN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "skill" "WorkerSkill";
