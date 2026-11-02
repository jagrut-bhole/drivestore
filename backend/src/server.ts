import "dotenv/config";

import { buildServer } from "./app";

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
  const server = await buildServer();

  try {
    await server.listen({
      port: PORT,
      host: HOST
    });

    server.log.info(`DriveStore backend running on port http://localhost:${PORT}`);
  } catch (error) {
    server.log.error(error);
    await server.close();
    process.exit(1);
  }
}

startServer(); 