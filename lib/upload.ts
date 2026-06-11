import { writeFile, mkdir, realpath } from "fs/promises"
import { join, basename, sep } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

const SAFE_SUBDIR = /^[a-zA-Z0-9_-]+$/

export async function saveFile(
  buffer: ArrayBuffer,
  fileName: string,
  subDir: string
): Promise<string> {
  if (!SAFE_SUBDIR.test(subDir)) {
    throw new Error("Invalid subDir")
  }

  const safeFileName = basename(fileName)
  const dir = join(UPLOAD_DIR, subDir)
  await mkdir(dir, { recursive: true })

  const resolvedDir = await realpath(dir)
  const resolvedUploadDir = await realpath(UPLOAD_DIR)
  if (!resolvedDir.startsWith(resolvedUploadDir + sep)) {
    throw new Error("Path traversal detected")
  }

  await writeFile(join(resolvedDir, safeFileName), Buffer.from(buffer))
  return `/uploads/${subDir}/${safeFileName}`
}
