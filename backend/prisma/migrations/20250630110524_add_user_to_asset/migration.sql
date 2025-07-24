/*
  Warnings:

  - Added the required column `userId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "marketId" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("id", "marketId", "name", "symbol") SELECT "id", "marketId", "name", "symbol" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE UNIQUE INDEX "Asset_marketId_key" ON "Asset"("marketId");
CREATE INDEX "Asset_userId_idx" ON "Asset"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
