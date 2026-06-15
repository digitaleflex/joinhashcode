import { describe, it, expect } from "vitest";
import { sanitizeMetadata } from "../lib/logger";

describe("Logger Security Sanitization", () => {
  it("should mask sensitive keys at top level", () => {
    const data = {
      email: "test@example.com",
      token: "secret-token-123",
      username: "john_doe",
      role: "ADMIN"
    };

    const sanitized = sanitizeMetadata(data);

    expect(sanitized.email).toBe("[MASKED]");
    expect(sanitized.token).toBe("[MASKED]");
    expect(sanitized.username).toBe("john_doe");
    expect(sanitized.role).toBe("ADMIN");
  });

  it("should mask sensitive keys in nested objects", () => {
    const data = {
      user: {
        id: "123",
        email: "test@example.com",
        credentials: {
          password: "password123",
          apiKey: "key-456"
        }
      },
      action: "LOGIN"
    };

    const sanitized = sanitizeMetadata(data);

    expect(sanitized.user.email).toBe("[MASKED]");
    expect(sanitized.user.credentials.password).toBe("[MASKED]");
    expect(sanitized.user.credentials.apiKey).toBe("[MASKED]");
    expect(sanitized.user.id).toBe("123");
    expect(sanitized.action).toBe("LOGIN");
  });

  it("should mask keys regardless of casing", () => {
    const data = {
      EMAIL: "upper@test.com",
      SessionToken: "abc",
      id_token: "def"
    };

    const sanitized = sanitizeMetadata(data);

    expect(sanitized.EMAIL).toBe("[MASKED]");
    expect(sanitized.SessionToken).toBe("[MASKED]");
    expect(sanitized.id_token).toBe("[MASKED]");
  });

  it("should handle arrays and mask sensitive elements", () => {
    const data = {
      users: [
        { email: "u1@t.com", name: "U1" },
        { email: "u2@t.com", name: "U2" }
      ]
    };

    const sanitized = sanitizeMetadata(data);

    expect(sanitized.users[0].email).toBe("[MASKED]");
    expect(sanitized.users[1].email).toBe("[MASKED]");
    expect(sanitized.users[0].name).toBe("U1");
  });
});
