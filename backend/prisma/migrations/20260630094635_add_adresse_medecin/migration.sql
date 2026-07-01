-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medecin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "specialite" TEXT NOT NULL,
    "rpps" TEXT NOT NULL,
    "adresse" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Medecin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Medecin" ("createdAt", "id", "nom", "prenom", "rpps", "specialite", "telephone", "userId") SELECT "createdAt", "id", "nom", "prenom", "rpps", "specialite", "telephone", "userId" FROM "Medecin";
DROP TABLE "Medecin";
ALTER TABLE "new_Medecin" RENAME TO "Medecin";
CREATE UNIQUE INDEX "Medecin_userId_key" ON "Medecin"("userId");
CREATE UNIQUE INDEX "Medecin_rpps_key" ON "Medecin"("rpps");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
