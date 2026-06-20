import { after } from "next/server";

/**
 * Executes a callback after the HTTP response is sent in Next.js 15.
 * In a test environment (Vitest/Jest), it runs synchronously to ensure
 * mock assertions and state expectations pass.
 */
export async function safeAfter(fn: () => any | Promise<any>) {
  if (process.env.NODE_ENV === "test") {
    try {
      await fn();
    } catch (err) {
      console.error("🔴 [safeAfter] Synchronous execution error during test:", err);
    }
  } else if (typeof after === "function") {
    after(fn);
  } else {
    // Fallback if after is not available in non-test node environments
    Promise.resolve().then(fn).catch((err) => {
      console.error("🔴 [safeAfter] Asynchronous execution error:", err);
    });
  }
}
