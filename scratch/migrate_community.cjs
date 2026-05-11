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
      -- Update User
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS "level" INTEGER NOT NULL DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "experience" INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "profile_class" TEXT,
      ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'MEMBER';

      -- Create Guild
      CREATE TABLE IF NOT EXISTS "guild" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "slug" TEXT NOT NULL,
        "requiredLevel" INTEGER NOT NULL DEFAULT 1,
        "isPrivate" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "guild_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "guild_slug_key" ON "guild"("slug");

      -- Create GuildMember
      CREATE TABLE IF NOT EXISTS "guild_member" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "guildId" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'MEMBER',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "guild_member_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "guild_member_userId_guildId_key" ON "guild_member"("userId", "guildId");

      -- Add Foreign Keys if they don't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'guild_member_userId_fkey') THEN
          ALTER TABLE "guild_member" ADD CONSTRAINT "guild_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'guild_member_guildId_fkey') THEN
          ALTER TABLE "guild_member" ADD CONSTRAINT "guild_member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;

    `);
    
    console.log("Database updated successfully");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
