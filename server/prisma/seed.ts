/**
 * Prisma Seed Script
 * Run with: npm run db:seed
 *
 * Creates a default admin user, a sample teacher, and sample courses.
 * Uses upsert so it can be run multiple times safely (idempotent).
 */

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Admin User ──────────────────────────────────────────────────────────────

  const adminPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@reclms.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@reclms.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`  ✅ Admin user: ${admin.email}`);

  // ── Sample Teacher ──────────────────────────────────────────────────────────

  const teacherPassword = await bcrypt.hash("Teacher@123", 12);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@reclms.com" },
    update: {},
    create: {
      name: "Dr. Sarah Johnson",
      email: "teacher@reclms.com",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  console.log(`  ✅ Teacher user: ${teacher.email}`);

  // ── Sample Student ──────────────────────────────────────────────────────────

  const studentPassword = await bcrypt.hash("Student@123", 12);

  const student = await prisma.user.upsert({
    where: { email: "student@reclms.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "student@reclms.com",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  console.log(`  ✅ Student user: ${student.email}`);

  console.log("\n🎉 Seeding complete!");
  console.log("   Default credentials:");
  console.log("   Admin:   admin@reclms.com   / Admin@123");
  console.log("   Teacher: teacher@reclms.com / Teacher@123");
  console.log("   Student: student@reclms.com / Student@123");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
