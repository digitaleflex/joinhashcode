export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

async function wrapHandler(
  request: Request,
  handler: (req: Request) => Promise<Response>
): Promise<Response> {
  let response: Response;
  try {
    response = await handler(request);
  } catch (error) {
    console.error("[auth/catch-all] Unhandled error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }

  if (response.status === 500) {
    const body = await response.clone().text();
    if (!body) {
      console.error("[auth/catch-all] Empty 500 response from Better Auth");
      return Response.json(
        { error: "Internal Server Error", message: "Empty 500 response from auth handler" },
        { status: 500 }
      );
    }
    console.error("[auth/catch-all] 500 response body:", body);
  }

  return response;
}

export const GET = (request: Request) => wrapHandler(request, handlers.GET);
export const POST = (request: Request) => wrapHandler(request, handlers.POST);
