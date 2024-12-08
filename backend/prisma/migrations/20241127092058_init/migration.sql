-- CreateTable
CREATE TABLE "Payment" (
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
    "createdAt" DATETIME NOT NULL,
    "redirectUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_exchangeId_key" ON "Payment"("exchangeId");
