#!/usr/bin/env node
/**
 * Script de configuration PostgreSQL de production.
 * Vérifie la santé de la connexion et affiche les métriques clés.
 * 
 * Usage : node scripts/check-db-health.js
 */

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5435/hashcode_dev",
  max: 3,
  connectionTimeoutMillis: 5000,
});

async function checkDbHealth() {
  const client = await pool.connect();
  try {
    // Connexions actives
    const { rows: connRows } = await client.query(`
      SELECT count(*) as active_connections, 
             max(state) as state
      FROM pg_stat_activity 
      WHERE datname = current_database()
      GROUP BY state
    `);

    // Taille de la base de données
    const { rows: sizeRows } = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
    `);

    // Tables les plus volumineuses
    const { rows: tableRows } = await client.query(`
      SELECT schemaname, tablename, 
             pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
             pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY size_bytes DESC 
      LIMIT 10
    `);

    // Index inutilisés (potentiel nettoyage)
    const { rows: unusedIdx } = await client.query(`
      SELECT indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) as index_size
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0 AND pg_relation_size(indexrelid) > 8192
      ORDER BY pg_relation_size(indexrelid) DESC
      LIMIT 10
    `);

    console.log("\n🗄️  === Santé PostgreSQL ===\n");
    console.log("📊 Taille de la base :", sizeRows[0]?.db_size);
    console.log("\n🔗 Connexions actives :");
    connRows.forEach(r => console.log(`  ${r.state}: ${r.active_connections}`));
    
    console.log("\n📋 Top 10 tables (par taille) :");
    tableRows.forEach(r => console.log(`  ${r.tablename}: ${r.total_size}`));
    
    if (unusedIdx.length > 0) {
      console.log("\n⚠️  Index non utilisés :");
      unusedIdx.forEach(r => console.log(`  ${r.indexrelname}: ${r.index_size} (${r.idx_scan} scans)`));
    } else {
      console.log("\n✅ Tous les index sont utilisés.");
    }

    console.log("\n✅ Base de données opérationnelle.\n");
  } finally {
    client.release();
    await pool.end();
  }
}

checkDbHealth().catch(err => {
  console.error("❌ Erreur de connexion DB :", err.message);
  process.exit(1);
});
