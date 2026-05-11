const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgres://postgres:nZB79v957fsAj4cU@db.emthjsmrqubwxedweubh.supabase.co:5432/postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to DB");
    
    await client.query(`
      ALTER TABLE quiz_result 
      ADD COLUMN IF NOT EXISTS average_response_time INTEGER,
      ADD COLUMN IF NOT EXISTS detailed_response_times JSONB;
    `);
    
    console.log("Database updated successfully");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
