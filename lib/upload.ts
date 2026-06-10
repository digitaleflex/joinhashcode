import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function saveFile(
  buffer: ArrayBuffer,
  fileName: string,
  subDir: string
): Promise<string> {
  const dir = join(UPLOAD_DIR, subDir)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, fileName), Buffer.from(buffer))
  return `${BASE_URL}/uploads/${subDir}/${fileName}`
}
