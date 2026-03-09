-- CreateTable
CREATE TABLE "Gerente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "idadeDiscipulado" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Discipulador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "idadeDiscipulado" TEXT NOT NULL,
    "nomeDiscipulado" TEXT NOT NULL,
    "gerenteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Discipulador_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "Gerente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Discipulo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "estrutura" TEXT NOT NULL,
    "goe" BOOLEAN NOT NULL DEFAULT false,
    "visitante" BOOLEAN NOT NULL DEFAULT false,
    "discipuladorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Discipulo_discipuladorId_fkey" FOREIGN KEY ("discipuladorId") REFERENCES "Discipulador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Frequencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "discipuloId" INTEGER NOT NULL,
    "discipuladorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Frequencia_discipuloId_fkey" FOREIGN KEY ("discipuloId") REFERENCES "Discipulo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Frequencia_discipuladorId_fkey" FOREIGN KEY ("discipuladorId") REFERENCES "Discipulador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Discipulador_email_key" ON "Discipulador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Frequencia_discipuloId_data_key" ON "Frequencia"("discipuloId", "data");
