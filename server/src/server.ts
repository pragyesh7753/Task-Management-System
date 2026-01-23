import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
