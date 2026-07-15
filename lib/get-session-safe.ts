import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSessionSafe() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
}
