const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
console.log('Models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
process.exit(0);
