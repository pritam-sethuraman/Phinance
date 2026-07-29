-- Prisma's schema language has no native CHECK-constraint attribute, so this
-- is a hand-authored migration (per docs/07 M1 step 4) rather than one
-- generated from schema.prisma. Enforces money invariants at the DB level,
-- not just in Zod/service-layer validation.

-- CreateCheckConstraint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_amount_positive" CHECK ("amount" > 0);

-- CreateCheckConstraint
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_amount_positive" CHECK ("amount" > 0);
