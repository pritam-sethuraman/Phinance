/**
 * Dev-only seed data. Run with `npm run db:seed`.
 *
 * Creates:
 *  - 1 ADMIN user + 1 demo USER (idempotent — upserted by email)
 *  - ~45 transactions for the demo user across all 17 categories, spread
 *    over the last 6 months, plus monthly income
 *  - An overall budget + 4 category budgets for the CURRENT month, sized so
 *    the demo account renders the same on-track/warn/over states shown in
 *    docs/06-WIREFRAMES.md (Rent at limit, Groceries nearing limit, etc.)
 *
 * Transactions/budgets are wiped and recreated on each run so this script
 * is safe to re-run.
 */
import {
  PrismaClient,
  Category,
  TransactionType,
} from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import argon2 from "argon2";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Anchor seed data to the real current month so budgets/dashboard render
// sensibly regardless of when this is run.
const now = new Date();
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

function monthsAgo(n: number, day = 1): Date {
  return new Date(now.getFullYear(), now.getMonth() - n, day);
}

interface SeedTxn {
  type: TransactionType;
  amount: number; // cents
  date: Date;
  category: Category;
  merchant?: string;
  note?: string;
}

async function main() {
  console.log(`Seeding for current month ${currentMonthKey}...`);

  const adminPasswordHash = await argon2.hash("AdminPass123!");
  const demoPasswordHash = await argon2.hash("DemoPass123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@phinance.app" },
    update: {},
    create: {
      email: "admin@phinance.app",
      name: "Phinance Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      currency: "CAD",
      locale: "en-CA",
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@phinance.app" },
    update: {},
    create: {
      email: "demo@phinance.app",
      name: "Pritam Sethuraman",
      role: "USER",
      passwordHash: demoPasswordHash,
      currency: "CAD",
      locale: "en-CA",
    },
  });
  void admin;

  // Idempotent re-runs: clear this demo user's prior seeded data.
  await prisma.transaction.deleteMany({ where: { userId: demo.id } });
  await prisma.budget.deleteMany({ where: { userId: demo.id } });

  const txns: SeedTxn[] = [];

  // --- Current month "hero" transactions ----------------------------------
  // The 4 budgeted categories are sized to reproduce the wireframe's example
  // states: Rent at 100% (over), Groceries at 85% (warn), Public
  // transportation at 50% (ok), Entertainment at 60% (ok).
  txns.push(
    {
      type: "EXPENSE",
      amount: 120_000,
      date: monthsAgo(0, 1),
      category: "RENT",
      merchant: "Landlord Properties",
      note: "Rent",
    },
    {
      type: "EXPENSE",
      amount: 13_000,
      date: monthsAgo(0, 3),
      category: "GROCERIES",
      merchant: "Loblaws",
      note: "Weekly groceries",
    },
    {
      type: "EXPENSE",
      amount: 12_000,
      date: monthsAgo(0, 9),
      category: "GROCERIES",
      merchant: "Metro",
    },
    {
      type: "EXPENSE",
      amount: 9_500,
      date: monthsAgo(0, 15),
      category: "GROCERIES",
      merchant: "Farm Boy",
    },
    {
      type: "EXPENSE",
      amount: 8_800,
      date: monthsAgo(0, 21),
      category: "GROCERIES",
      merchant: "No Frills",
    },
    {
      type: "EXPENSE",
      amount: 7_700,
      date: monthsAgo(0, 27),
      category: "GROCERIES",
      merchant: "Sobeys",
    },
    {
      type: "EXPENSE",
      amount: 6_200,
      date: monthsAgo(0, 13),
      category: "PUBLIC_TRANSPORTATION",
      merchant: "Uber",
    },
    {
      type: "EXPENSE",
      amount: 4_550,
      date: monthsAgo(0, 20),
      category: "PUBLIC_TRANSPORTATION",
      merchant: "PRESTO",
    },
    {
      type: "EXPENSE",
      amount: 4_250,
      date: monthsAgo(0, 6),
      category: "PUBLIC_TRANSPORTATION",
      merchant: "TTC",
    },
    {
      type: "EXPENSE",
      amount: 1_699,
      date: monthsAgo(0, 1),
      category: "ENTERTAINMENT",
      merchant: "Netflix",
    },
    {
      type: "EXPENSE",
      amount: 2_401,
      date: monthsAgo(0, 10),
      category: "ENTERTAINMENT",
      merchant: "Cineplex",
    },
    {
      type: "EXPENSE",
      amount: 1_900,
      date: monthsAgo(0, 1),
      category: "ENTERTAINMENT",
      merchant: "Spotify",
    },
    // One-off coverage for the 13 categories without a dedicated budget this month.
    {
      type: "EXPENSE",
      amount: 15_000,
      date: monthsAgo(0, 2),
      category: "UTILITIES",
      merchant: "Toronto Hydro",
    },
    {
      type: "EXPENSE",
      amount: 4_900,
      date: monthsAgo(0, 8),
      category: "SUBSCRIPTION",
      merchant: "Coursera Plus",
    },
    {
      type: "EXPENSE",
      amount: 6_500,
      date: monthsAgo(0, 16),
      category: "CLOTHING",
      merchant: "Winners",
    },
    {
      type: "EXPENSE",
      amount: 5_999,
      date: monthsAgo(0, 1),
      category: "GYM",
      merchant: "GoodLife Fitness",
    },
    {
      type: "EXPENSE",
      amount: 12_999,
      date: monthsAgo(0, 19),
      category: "ELECTRONICS",
      merchant: "Best Buy",
    },
    {
      type: "EXPENSE",
      amount: 4_200,
      date: monthsAgo(0, 12),
      category: "MEDICAL",
      merchant: "Shoppers Drug Mart",
    },
    {
      type: "EXPENSE",
      amount: 3_500,
      date: monthsAgo(0, 23),
      category: "GIFTS",
      merchant: "Indigo",
    },
    {
      type: "EXPENSE",
      amount: 4_800,
      date: monthsAgo(0, 14),
      category: "GOING_OUT",
      merchant: "The Keg",
    },
    {
      type: "EXPENSE",
      amount: 22_000,
      date: monthsAgo(0, 18),
      category: "TRAVEL",
      merchant: "Air Canada",
    },
    {
      type: "EXPENSE",
      amount: 8_900,
      date: monthsAgo(0, 5),
      category: "BILLS",
      merchant: "Bell Canada",
    },
    {
      type: "EXPENSE",
      amount: 3_200,
      date: monthsAgo(0, 22),
      category: "RESTAURANT",
      merchant: "Pai Northern Thai",
    },
    {
      type: "EXPENSE",
      amount: 8_900,
      date: monthsAgo(0, 25),
      category: "SHOPPING",
      merchant: "Amazon.ca",
    },
    {
      type: "EXPENSE",
      amount: 1_200,
      date: monthsAgo(0, 24),
      category: "OTHER",
      merchant: "Canada Post",
    },
  );

  // --- Historical months (last 5 months before the current one) ----------
  const historicalMerchants: Record<Category, string[]> = {
    RENT: ["Landlord Properties"],
    UTILITIES: ["Toronto Hydro", "Enbridge Gas"],
    SUBSCRIPTION: ["Coursera Plus", "Disney+", "iCloud+"],
    CLOTHING: ["Winners", "H&M", "Uniqlo"],
    GROCERIES: ["Loblaws", "Metro", "Farm Boy", "No Frills", "Sobeys"],
    GYM: ["GoodLife Fitness"],
    ELECTRONICS: ["Best Buy", "Apple"],
    ENTERTAINMENT: ["Netflix", "Spotify", "Cineplex"],
    MEDICAL: ["Shoppers Drug Mart", "Dentist Office"],
    GIFTS: ["Indigo", "Etsy"],
    GOING_OUT: ["The Keg", "Bar Volo"],
    PUBLIC_TRANSPORTATION: ["Uber", "PRESTO", "TTC"],
    TRAVEL: ["Air Canada", "VIA Rail"],
    BILLS: ["Bell Canada", "Rogers"],
    RESTAURANT: ["Pai Northern Thai", "Pizzeria Libretto"],
    SHOPPING: ["Amazon.ca", "IKEA"],
    OTHER: ["Canada Post", "Misc."],
  };
  const categoriesForHistory = Object.keys(historicalMerchants) as Category[];

  // Small deterministic PRNG so seed data is stable across runs.
  let seed = 42;
  function rand(): number {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  }

  for (let m = 1; m <= 5; m++) {
    // ~4 transactions per historical month, rotating through categories.
    for (let i = 0; i < 4; i++) {
      const category =
        categoriesForHistory[(m + i * 3) % categoriesForHistory.length]!;
      const merchants = historicalMerchants[category];
      const merchant = merchants[i % merchants.length]!;
      const day = 3 + Math.floor(rand() * 25);
      const baseAmount =
        category === "RENT" ? 120_000 : 2_000 + Math.floor(rand() * 15_000);

      txns.push({
        type: "EXPENSE",
        amount: baseAmount,
        date: monthsAgo(m, day),
        category,
        merchant,
      });
    }
  }

  // --- Income: one paycheck per month for the last 6 months --------------
  for (let m = 0; m <= 5; m++) {
    txns.push({
      type: "INCOME",
      amount: 320_000,
      date: monthsAgo(m, 1),
      category: "OTHER",
      merchant: "Employer Inc.",
      note: "Paycheck",
    });
  }

  await prisma.transaction.createMany({
    data: txns.map((t) => ({ ...t, userId: demo.id })),
  });

  console.log(`Created ${txns.length} transactions for ${demo.email}.`);

  // --- Budgets for the current month --------------------------------------
  await prisma.budget.createMany({
    data: [
      {
        userId: demo.id,
        category: null,
        month: currentMonthKey,
        amount: 250_000,
      }, // overall
      {
        userId: demo.id,
        category: "RENT",
        month: currentMonthKey,
        amount: 120_000,
      },
      {
        userId: demo.id,
        category: "GROCERIES",
        month: currentMonthKey,
        amount: 60_000,
      },
      {
        userId: demo.id,
        category: "PUBLIC_TRANSPORTATION",
        month: currentMonthKey,
        amount: 30_000,
      },
      {
        userId: demo.id,
        category: "ENTERTAINMENT",
        month: currentMonthKey,
        amount: 10_000,
      },
    ],
  });

  console.log("Created overall + 4 category budgets for", currentMonthKey);
  console.log("\nDemo login: demo@phinance.app / DemoPass123!");
  console.log("Admin login: admin@phinance.app / AdminPass123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
