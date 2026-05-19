import { PrismaClient } from '../generated/prisma';

async function main() {
  const prisma = new PrismaClient();
  console.log('🚀 Démarrage du blindage de la base de données...');

  const tables = [
    'user', 'session', 'account', 'verification', 'quiz_result', 
    'guild_member', 'guild', 'daily_checkin', 'mission', 
    'notification', 'beta_feedback', 'contact_message', 
    'mission_submission', 'mission_review'
  ];

  try {
    for (const table of tables) {
      console.log(`🔒 Activation RLS pour la table: ${table}`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
    }

    console.log('🛡️  Révocation des accès aux colonnes sensibles...');
    try {
      await prisma.$executeRawUnsafe('REVOKE SELECT ON "account" FROM anon, authenticated;');
    } catch (e) {
      console.warn('⚠️ Note: Échec de la révocation sur "account" (peut-être déjà fait ou permissions restreintes)');
    }
    
    try {
      await prisma.$executeRawUnsafe('REVOKE SELECT ON "session" FROM anon, authenticated;');
    } catch (e) {
      console.warn('⚠️ Note: Échec de la révocation sur "session" (peut-être déjà fait ou permissions restreintes)');
    }

    console.log('✅ Base de données blindée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration de sécurité:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
