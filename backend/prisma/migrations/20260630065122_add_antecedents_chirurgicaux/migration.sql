-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dossier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "antecedents" TEXT NOT NULL DEFAULT '',
    "antecedentsChirurgicaux" TEXT NOT NULL DEFAULT '',
    "allergies" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dossier_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Dossier" ("allergies", "antecedents", "createdAt", "id", "notes", "patientId") SELECT "allergies", "antecedents", "createdAt", "id", "notes", "patientId" FROM "Dossier";
DROP TABLE "Dossier";
ALTER TABLE "new_Dossier" RENAME TO "Dossier";
CREATE UNIQUE INDEX "Dossier_patientId_key" ON "Dossier"("patientId");
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "dateNaissance" TEXT NOT NULL,
    "nss" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medecinTraitant" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("createdAt", "dateNaissance", "id", "nom", "nss", "prenom", "telephone", "userId") SELECT "createdAt", "dateNaissance", "id", "nom", "nss", "prenom", "telephone", "userId" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");
CREATE UNIQUE INDEX "Patient_nss_key" ON "Patient"("nss");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
