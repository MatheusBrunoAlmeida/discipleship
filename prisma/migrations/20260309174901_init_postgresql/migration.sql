-- CreateTable
CREATE TABLE "Gerente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "idadeDiscipulado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gerente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipulador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "sexo" TEXT NOT NULL DEFAULT 'Masculino',
    "idadeDiscipulado" TEXT NOT NULL,
    "nomeDiscipulado" TEXT NOT NULL,
    "gerenteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discipulador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipulo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "sexo" TEXT NOT NULL DEFAULT 'Masculino',
    "estrutura" TEXT NOT NULL,
    "goe" BOOLEAN NOT NULL DEFAULT false,
    "visitante" BOOLEAN NOT NULL DEFAULT false,
    "discipuladorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discipulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frequencia" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "discipuloId" TEXT NOT NULL,
    "discipuladorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Frequencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discipulador_email_key" ON "Discipulador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Frequencia_discipuloId_data_key" ON "Frequencia"("discipuloId", "data");

-- AddForeignKey
ALTER TABLE "Discipulador" ADD CONSTRAINT "Discipulador_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "Gerente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipulo" ADD CONSTRAINT "Discipulo_discipuladorId_fkey" FOREIGN KEY ("discipuladorId") REFERENCES "Discipulador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frequencia" ADD CONSTRAINT "Frequencia_discipuloId_fkey" FOREIGN KEY ("discipuloId") REFERENCES "Discipulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Frequencia" ADD CONSTRAINT "Frequencia_discipuladorId_fkey" FOREIGN KEY ("discipuladorId") REFERENCES "Discipulador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
