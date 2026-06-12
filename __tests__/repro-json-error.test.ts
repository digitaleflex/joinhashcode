import { describe, it, expect } from 'vitest';

describe('JSON Parsing Error Reproduction', () => {
  it('should fail to parse a plain text response as JSON', () => {
    const plainTextResponse = "Unauthorized";
    
    expect(() => JSON.parse(plainTextResponse)).toThrow();
  });

  it('should succeed to parse a JSON response with message key', () => {
    const jsonResponse = JSON.stringify({ message: "Unauthorized" });
    
    const parsed = JSON.parse(jsonResponse);
    expect(parsed).toEqual({ message: "Unauthorized" });
    expect(parsed.message).toBe("Unauthorized");
  });
});
