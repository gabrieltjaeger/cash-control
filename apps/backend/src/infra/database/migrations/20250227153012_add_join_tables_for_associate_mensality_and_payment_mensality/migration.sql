/*
  Warnings:

  - You are about to drop the `_MensalityToPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MensalityToPayment" DROP CONSTRAINT "_MensalityToPayment_A_fkey";

-- DropForeignKey
ALTER TABLE "_MensalityToPayment" DROP CONSTRAINT "_MensalityToPayment_B_fkey";

-- DropTable
DROP TABLE "_MensalityToPayment";

-- CreateTable
CREATE TABLE "payment_mensalities" (
    "paymentId" TEXT NOT NULL,
    "mensalityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "payment_mensalities_pkey" PRIMARY KEY ("paymentId","mensalityId")
);

-- CreateTable
CREATE TABLE "associate_mensalities" (
    "associateId" TEXT NOT NULL,
    "mensalityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "associate_mensalities_pkey" PRIMARY KEY ("associateId","mensalityId")
);

-- AddForeignKey
ALTER TABLE "payment_mensalities" ADD CONSTRAINT "payment_mensalities_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_mensalities" ADD CONSTRAINT "payment_mensalities_mensalityId_fkey" FOREIGN KEY ("mensalityId") REFERENCES "mensalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "associate_mensalities" ADD CONSTRAINT "associate_mensalities_associateId_fkey" FOREIGN KEY ("associateId") REFERENCES "associates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "associate_mensalities" ADD CONSTRAINT "associate_mensalities_mensalityId_fkey" FOREIGN KEY ("mensalityId") REFERENCES "mensalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
