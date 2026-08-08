import cluster from 'node:cluster'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const numWorkers = Math.min(
  Math.max(parseInt(process.env.WEB_CONCURRENCY, 10) || os.cpus().length, 1),
  4
)

if (cluster.isPrimary) {
  console.log(`[cluster] primary ${process.pid} — forking ${numWorkers} workers`)
  for (let i = 0; i < numWorkers; i++) cluster.fork()

  cluster.on('exit', (worker, code) => {
    console.log(`[cluster] worker ${worker.process.pid} exited (code ${code}), respawning`)
    cluster.fork()
  })
} else {
  const serverPath = path.join(process.cwd(), '.next', 'standalone', 'server.js')
  console.log(`[cluster] worker ${process.pid} booting ${serverPath}`)
  await import(pathToFileURL(serverPath).href)
}