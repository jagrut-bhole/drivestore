import { prisma } from "@/lib/prisma";

export async function checkDatabase() {
  const start = performance.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "healthy" as const,
      responseTimeMs: Math.round(performance.now() - start),
    };
  } catch {
    return {
      status: "unhealthy" as const,
      responseTimeMs: Math.round(performance.now() - start),
      message: "Database connection failed",
    };
  }
}

export async function checkReadiness() {
  const database = await checkDatabase();

  return {
    status: database.status,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.APP_VERSION ?? "unknown",
    environment: process.env.NODE_ENV ?? "development",
    services: {
      database,
    },
  };
}
