/*
  Warnings:

  - The primary key for the `Discipulo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discipulo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "sexo" TEXT NOT NULL DEFAULT 'Masculino',
    "estrutura" TEXT NOT NULL,
    "goe" BOOLEAN NOT NULL DEFAULT false,
    "visitante" BOOLEAN NOT NULL DEFAULT false,
    "discipuladorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Discipulo_discipuladorId_fkey" FOREIGN KEY ("discipuladorId") REFERENCES "Discipulador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Discipulo" ("createdAt", "discipuladorId", "estrutura", "goe", "id", "idade", "nome", "sexo", "telefone", "visitante") SELECT "createdAt", "discipuladorId", "estrutura", "goe", "id", "idade", "nome", "sexo", "telefone", "visitante" FROM "Discipulo";
DROP TABLE "Discipulo";
ALTER TABLE "new_Discipulo" RENAME TO "Discipulo";
CREATE TABLE "new_Frequencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "discipuloId" TEXT NOT NULL,
    "discipuladorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Frequencia_discipuloId_fkey" FOREIGN KEY ("discipuloId") REFERENCES "Discipulo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Frequencia_discipuladorId_fkey" FOREIGN KEY ("discipuladorId") REFERENCES "Discipulador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Frequencia" ("createdAt", "data", "discipuladorId", "discipuloId", "id", "presente") SELECT "createdAt", "data", "discipuladorId", "discipuloId", "id", "presente" FROM "Frequencia";
DROP TABLE "Frequencia";
ALTER TABLE "new_Frequencia" RENAME TO "Frequencia";
CREATE UNIQUE INDEX "Frequencia_discipuloId_data_key" ON "Frequencia"("discipuloId", "data");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
