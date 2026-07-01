/*
  Warnings:

  - Added the required column `medecinId` to the `Ordonnance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Rapport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rapport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rapport_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ordonnance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ordonnance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ordonnance_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ordonnance" ("contenu", "createdAt", "date", "id", "patientId") SELECT "contenu", "createdAt", "date", "id", "patientId" FROM "Ordonnance";
DROP TABLE "Ordonnance";
ALTER TABLE "new_Ordonnance" RENAME TO "Ordonnance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
