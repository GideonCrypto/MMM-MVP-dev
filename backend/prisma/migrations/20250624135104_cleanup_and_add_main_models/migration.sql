/*
  Warnings:

  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Investment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "price" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Transaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "marketId" TEXT
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "currentPrice" REAL NOT NULL,
    "marketCap" BIGINT NOT NULL,
    "marketCapRank" INTEGER NOT NULL,
    "fullyDilutedValuation" BIGINT NOT NULL,
    "totalVolume" BIGINT NOT NULL,
    "high24h" REAL NOT NULL,
    "low24h" REAL NOT NULL,
    "priceChange24h" REAL NOT NULL,
    "priceChangePercentage24h" REAL NOT NULL,
    "marketCapChange24h" BIGINT NOT NULL,
    "marketCapChangePercentage24h" REAL NOT NULL,
    "circulatingSupply" REAL NOT NULL,
    "totalSupply" REAL NOT NULL,
    "maxSupply" REAL NOT NULL,
    "ath" REAL NOT NULL,
    "athChangePercentage" REAL NOT NULL,
    "athDate" DATETIME NOT NULL,
    "atl" REAL NOT NULL,
    "atlChangePercentage" REAL NOT NULL,
    "atlDate" DATETIME NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "assetId" TEXT,
    CONSTRAINT "MarketData_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_marketId_key" ON "Asset"("marketId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketData_assetId_key" ON "MarketData"("assetId");
