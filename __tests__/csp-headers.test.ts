import { describe, it, expect } from "vitest";
import nextConfig from "../next.config.mjs";

/**
 * Garde-fou de l'allowlist CSP (#442) : chaque domaine externe doit
 * correspondre à un usage réel, et les directives sensibles restent fermées.
 */
async function getCsp(): Promise<Map<string, string[]>> {
  const rules = await nextConfig.headers!();
  const html = rules.find((r) => r.source === "/(.*)");
  const header = html?.headers.find((h) => h.key === "Content-Security-Policy");
  expect(header).toBeDefined();
  return new Map(
    header!.value.split(";").map((d) => {
      const [name, ...sources] = d.trim().split(/\s+/);
      return [name, sources] as const;
    }),
  );
}

describe("Content-Security-Policy", () => {
  it("garde les directives de cloisonnement fermées", async () => {
    const csp = await getCsp();
    expect(csp.get("default-src")).toEqual(["'self'"]);
    expect(csp.get("object-src")).toEqual(["'none'"]);
    expect(csp.get("frame-src")).toEqual(["'self'"]);
    expect(csp.get("frame-ancestors")).toEqual(["'self'"]);
    expect(csp.get("base-uri")).toEqual(["'self'"]);
    expect(csp.get("form-action")).toEqual(["'self'"]);
  });

  it("limite les CDN aux versions épinglées du playground Python", async () => {
    const csp = await getCsp();
    const pyodide = "https://cdn.jsdelivr.net/npm/pyodide@0.26.4/";
    const codemirror = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/";
    expect(csp.get("script-src")).toContain(pyodide);
    expect(csp.get("script-src")).toContain(codemirror);
    expect(csp.get("connect-src")).toContain(pyodide);
    for (const directive of ["script-src", "style-src", "connect-src", "font-src"]) {
      expect(csp.get(directive)).not.toContain("https://cdn.jsdelivr.net");
      expect(csp.get(directive)).not.toContain("https://cdnjs.cloudflare.com");
    }
  });

  it("n'autorise aucun wildcard ni domaine sans schéma", async () => {
    const csp = await getCsp();
    for (const [directive, sources] of csp) {
      for (const source of sources) {
        if (source.startsWith("'") || source.endsWith(":")) continue;
        expect(source, `${directive} ${source}`).toMatch(/^https:\/\/[a-z0-9.-]+(\/|$)/);
        expect(source, `${directive} ${source}`).not.toContain("*");
      }
    }
  });

  it("aligne img-src sur images.remotePatterns", async () => {
    const csp = await getCsp();
    const hosts = (nextConfig.images?.remotePatterns ?? []).map((p) =>
      typeof p === "object" && !(p instanceof URL) ? `${p.protocol}://${p.hostname}` : String(p),
    );
    expect(hosts.length).toBeGreaterThan(0);
    for (const host of hosts) expect(csp.get("img-src")).toContain(host);
  });
});
