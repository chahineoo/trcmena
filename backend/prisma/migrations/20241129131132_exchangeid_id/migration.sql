/*
  Warnings:

  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Payment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "exchangeId" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "redirectUrl" TEXT NOT NULL
);
INSERT INTO "new_Payment" ("amountFrom", "amountTo", "birthDate", "clientName", "createdAt", "currencyFrom", "currencyTo", "email", "exchangeId", "originalAmount", "originalFee", "passport", "redirectUrl", "status", "updatedAt") SELECT "amountFrom", "amountTo", "birthDate", "clientName", "createdAt", "currencyFrom", "currencyTo", "email", "exchangeId", "originalAmount", "originalFee", "passport", "redirectUrl", "status", "updatedAt" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_exchangeId_key" ON "Payment"("exchangeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
