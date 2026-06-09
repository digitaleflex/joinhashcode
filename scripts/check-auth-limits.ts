import { prisma } from '../lib/prisma';

async function checkAuthLimits() {
  try {
    console.log('=== Better Auth Limits Audit ===\n');

    // Users with more than 1 squad membership
    const membersByUser = await prisma.member.groupBy({
      by: ['userId'],
      _count: { userId: true },
      having: { userId: { _count: { gt: 1 } } },
    });

    if (membersByUser.length === 0) {
      console.log('✅ No users with > 1 squad membership');
    } else {
      console.log(`⚠️  ${membersByUser.length} user(s) with > 1 squad membership:`);
      for (const row of membersByUser) {
        const user = await prisma.user.findUnique({
          where: { id: row.userId },
          select: { email: true, name: true },
        });
        console.log(`   [${row._count.userId} squads] ${user?.name} (${user?.email})`);
      }
    }

    console.log('');

    // Squads with more than 5 members
    const membersByOrg = await prisma.member.groupBy({
      by: ['organizationId'],
      _count: { organizationId: true },
      having: { organizationId: { _count: { gt: 5 } } },
    });

    if (membersByOrg.length === 0) {
      console.log('✅ No squads with > 5 members');
    } else {
      console.log(`⚠️  ${membersByOrg.length} squad(s) with > 5 members:`);
      for (const row of membersByOrg) {
        const org = await prisma.organization.findUnique({
          where: { id: row.organizationId },
          select: { name: true, slug: true },
        });
        console.log(`   [${row._count.organizationId} members] ${org?.name} (slug: ${org?.slug})`);
      }
    }

    console.log('\n=== End Audit ===');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkAuthLimits();
