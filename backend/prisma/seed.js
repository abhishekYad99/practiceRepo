/* Seeds a demo user with a few tasks and documents.
 * Run with: npm run db:seed  (from backend/, or `npm run db:seed` at the root)
 * Requires a working DATABASE_URL and an applied migration.
 */
const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const demo = await prisma.user.upsert({
    where: { email: "demo@workspace.dev" },
    update: {},
    create: { name: "Demo User", email: "demo@workspace.dev", password },
  });

  const teammate = await prisma.user.upsert({
    where: { email: "teammate@workspace.dev" },
    update: {},
    create: { name: "Sam Teammate", email: "teammate@workspace.dev", password },
  });

  // Only seed tasks if the demo user has none yet.
  const existing = await prisma.task.count({ where: { ownerId: demo.id } });
  if (existing === 0) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.task.createMany({
      data: [
        { title: "Set up mock API", description: "Wire the base URL", priority: "High", status: "Completed", dueDate: today, ownerId: demo.id },
        { title: "Build Task table", priority: "Medium", status: "In Progress", dueDate: today, ownerId: demo.id, assignedToId: teammate.id },
        { title: "Design dashboard cards", priority: "Low", status: "Pending", dueDate: today, ownerId: demo.id },
        { title: "Add form validation", priority: "High", status: "Pending", dueDate: tomorrow, ownerId: demo.id },
      ],
    });

    await prisma.document.createMany({
      data: [
        { name: "Project Brief", category: "Report", fileType: "PDF", uploadedById: demo.id },
        { name: "API Contract", category: "Contract", fileType: "DOCX", uploadedById: demo.id },
      ],
    });
  }

  console.log("Seed complete. Login with demo@workspace.dev / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
