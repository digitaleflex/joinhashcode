export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

async function wrapHandler(
  request: Request,
  handler: (req: Request) => Promise<Response>
): Promise<Response> {
  try {
    return await handler(request);
  } catch (error) {
    console.error("[auth/catch-all] Unhandled error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: "Internal Server Error", message, digest: message },
      { status: 500 }
    );
  }
}

export const GET = (request: Request) => wrapHandler(request, handlers.GET);
export const POST = (request: Request) => wrapHandler(request, handlers.POST);
