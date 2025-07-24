/*
  Warnings:

  - You are about to alter the column `marketCapChange24h` on the `MarketData` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MarketData" (
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
    "marketCapChange24h" REAL NOT NULL,
    "marketCapChangePercentage24h" REAL NOT NULL,
    "circulatingSupply" REAL NOT NULL,
    "totalSupply" REAL NOT NULL,
    "maxSupply" REAL,
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
INSERT INTO "new_MarketData" ("assetId", "ath", "athChangePercentage", "athDate", "atl", "atlChangePercentage", "atlDate", "circulatingSupply", "currentPrice", "fullyDilutedValuation", "high24h", "id", "image", "lastUpdated", "low24h", "marketCap", "marketCapChange24h", "marketCapChangePercentage24h", "marketCapRank", "maxSupply", "name", "priceChange24h", "priceChangePercentage24h", "symbol", "totalSupply", "totalVolume") SELECT "assetId", "ath", "athChangePercentage", "athDate", "atl", "atlChangePercentage", "atlDate", "circulatingSupply", "currentPrice", "fullyDilutedValuation", "high24h", "id", "image", "lastUpdated", "low24h", "marketCap", "marketCapChange24h", "marketCapChangePercentage24h", "marketCapRank", "maxSupply", "name", "priceChange24h", "priceChangePercentage24h", "symbol", "totalSupply", "totalVolume" FROM "MarketData";
DROP TABLE "MarketData";
ALTER TABLE "new_MarketData" RENAME TO "MarketData";
CREATE UNIQUE INDEX "MarketData_assetId_key" ON "MarketData"("assetId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
