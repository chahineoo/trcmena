-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exchangeId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "originalAmount" DECIMAL NOT NULL,
    "originalFee" DECIMAL NOT NULL,
    "amountFrom" DECIMAL NOT NULL,
    "amountTo" DECIMAL NOT NULL,
    "currencyFrom" TEXT NOT NULL,
    "currencyTo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redirectUrl" TEXT NOT NULL
);
INSERT INTO "new_Payment" ("amountFrom", "amountTo", "birthDate", "clientName", "createdAt", "currencyFrom", "currencyTo", "email", "exchangeId", "id", "originalAmount", "originalFee", "passport", "redirectUrl", "status") SELECT "amountFrom", "amountTo", "birthDate", "clientName", "createdAt", "currencyFrom", "currencyTo", "email", "exchangeId", "id", "originalAmount", "originalFee", "passport", "redirectUrl", "status" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");
CREATE UNIQUE INDEX "Payment_exchangeId_key" ON "Payment"("exchangeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
