import { prisma } from '../lib/prisma';

async function promoteToAdmin() {
  const email = 'eflexcloud@gmail.com';
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    
    console.log(`🟢 SUCCESS: ${user.email} has been promoted to ADMIN.`);
    console.log(`User ID: ${user.id}`);
  } catch (error) {
    console.error(`🔴 ERROR: Could not promote ${email} to ADMIN.`, error);
  } finally {
    process.exit(0);
  }
}

promoteToAdmin();
