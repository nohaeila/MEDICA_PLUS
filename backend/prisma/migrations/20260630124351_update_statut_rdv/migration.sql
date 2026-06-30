/*
  Warnings:

  - The values [CONFIRME,EN_ATTENTE,URGENT] on the enum `Statut` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Statut_new" AS ENUM ('PLANIFIE', 'TERMINE', 'ANNULE');
ALTER TABLE "RendezVous" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "RendezVous" ALTER COLUMN "statut" TYPE "Statut_new" USING ("statut"::text::"Statut_new");
ALTER TYPE "Statut" RENAME TO "Statut_old";
ALTER TYPE "Statut_new" RENAME TO "Statut";
DROP TYPE "Statut_old";
ALTER TABLE "RendezVous" ALTER COLUMN "statut" SET DEFAULT 'PLANIFIE';
COMMIT;

-- AlterTable
ALTER TABLE "RendezVous" ALTER COLUMN "statut" SET DEFAULT 'PLANIFIE';

-- CreateTable
CREATE TABLE "Dossier" (
    "id" SERIAL NOT NULL,
    "antecedents" TEXT,
    "antecedentsChirurgicaux" TEXT,
    "allergies" TEXT,
    "patientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_patientId_key" ON "Dossier"("patientId");

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
