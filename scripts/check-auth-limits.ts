import { prisma } from '../lib/prisma';

const CI = process.env.CI === 'true';

function warn(msg: string) {
  if (CI) console.log(`::warning::${msg}`);
  else console.warn(`⚠️  ${msg}`);
}

async function checkAuthLimits(): Promise<number> {
  let violations = 0;
  try {
    console.log('=== Better Auth Limits Audit (org: 1, members: 5) ===\n');

    const membersByUser = await prisma.member.groupBy({
      by: ['userId'],
      _count: { userId: true },
      having: { userId: { _count: { gt: 1 } } },
    });

    if (membersByUser.length === 0) {
      console.log('✅ No users with > 1 squad membership');
    } else {
      violations += membersByUser.length;
      for (const row of membersByUser) {
        const user = await prisma.user.findUnique({
          where: { id: row.userId },
          select: { email: true, name: true },
        });
        warn(`User "${user?.name}" (${user?.email}) is in ${row._count.userId} squads — org limit is now 1`);
      }
    }

    console.log('');

    const membersByOrg = await prisma.member.groupBy({
      by: ['organizationId'],
      _count: { organizationId: true },
      having: { organizationId: { _count: { gt: 5 } } },
    });

    if (membersByOrg.length === 0) {
      console.log('✅ No squads with > 5 members');
    } else {
      violations += membersByOrg.length;
      for (const row of membersByOrg) {
        const org = await prisma.organization.findUnique({
          where: { id: row.organizationId },
          select: { name: true, slug: true },
        });
        warn(`Squad "${org?.name}" (${org?.slug}) has ${row._count.organizationId} members — limit is now 5`);
      }
    }

    console.log(`\n=== ${violations === 0 ? 'All clear' : `${violations} violation(s) found — review before prod`} ===`);
  } catch (error) {
    console.error('DB error:', error);
  } finally {
    await prisma.$disconnect();
  }
  return violations;
}

checkAuthLimits().then((violations) => {
  // Warn but never block deploy — data state shouldn't gate CI
  process.exit(0);
});
