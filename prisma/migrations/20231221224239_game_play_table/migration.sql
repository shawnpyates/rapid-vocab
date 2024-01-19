-- CreateTable
CREATE TABLE "GamePlay" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GamePlay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GamePlay_id_key" ON "GamePlay"("id");

-- AddForeignKey
ALTER TABLE "GamePlay" ADD CONSTRAINT "GamePlay_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
