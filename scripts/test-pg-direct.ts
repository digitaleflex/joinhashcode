import pg from 'pg'

const connectionString = 'postgresql://postgres:a4fd5ed7f5afd084edb8b23ceddb22143b6702dcf6ca03a5@127.0.0.1:5434/postgres'

async function main() {
  console.log('Testing connection to:', connectionString)
  const client = new pg.Client({
    connectionString,
  })

  try {
    await client.connect()
    console.log('Connected successfully!')
    const res = await client.query('SELECT COUNT(*) FROM "user"')
    console.log('User count:', res.rows[0].count)
    await client.end()
  } catch (err: any) {
    console.error('Connection failed:', err.message)
    if (err.stack) console.error(err.stack)
  }
}

main()
