-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discipulador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "sexo" TEXT NOT NULL DEFAULT 'Masculino',
    "idadeDiscipulado" TEXT NOT NULL,
    "nomeDiscipulado" TEXT NOT NULL,
    "gerenteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Discipulador_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "Gerente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Discipulador" ("createdAt", "email", "gerenteId", "id", "idadeDiscipulado", "nome", "nomeDiscipulado", "senha", "telefone") SELECT "createdAt", "email", "gerenteId", "id", "idadeDiscipulado", "nome", "nomeDiscipulado", "senha", "telefone" FROM "Discipulador";
DROP TABLE "Discipulador";
ALTER TABLE "new_Discipulador" RENAME TO "Discipulador";
CREATE UNIQUE INDEX "Discipulador_email_key" ON "Discipulador"("email");
CREATE TABLE "new_Discipulo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
INSERT INTO "new_Discipulo" ("createdAt", "discipuladorId", "estrutura", "goe", "id", "idade", "nome", "telefone", "visitante") SELECT "createdAt", "discipuladorId", "estrutura", "goe", "id", "idade", "nome", "telefone", "visitante" FROM "Discipulo";
DROP TABLE "Discipulo";
ALTER TABLE "new_Discipulo" RENAME TO "Discipulo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
