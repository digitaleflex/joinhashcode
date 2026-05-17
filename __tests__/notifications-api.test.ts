import { expect, test, describe } from "vitest";
import { GET } from "../app/api/user/notifications/route";
import { NextRequest } from "next/server";

describe("Notifications API", () => {
  test("GET returns 401 if not authenticated", async () => {
    // This will fail because the route doesn't exist yet
    const req = new NextRequest("http://localhost/api/user/notifications");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
