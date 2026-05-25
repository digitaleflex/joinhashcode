import { prisma } from '../lib/prisma';

async function listAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MODERATOR']
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });
    
    console.log('--- HASHCODE ADMINS ---');
    if (admins.length === 0) {
      console.log('No admins found.');
    } else {
      admins.forEach(a => {
        console.log(`[${a.role}] ${a.name} (${a.email}) - ID: ${a.id}`);
      });
    }
    console.log('-----------------------');
  } catch (error) {
    console.error('Error listing admins:', error);
  } finally {
    process.exit(0);
  }
}

listAdmins();
