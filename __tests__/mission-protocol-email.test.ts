import { describe, it, expect } from "vitest";
import { getMissionProtocolEmailContent } from "@/lib/email-templates/mission-protocol";

describe("getMissionProtocolEmailContent", () => {
  it("annonce le profil quand le quiz a été passé", () => {
    const { text, html } = getMissionProtocolEmailContent({ name: "Awa Diallo", userClass: "BUILDER" });

    expect(text).toContain("BUILDER");
    expect(text).toMatch(/analyse/i);
    expect(html).toContain("/missions");
  });

  it.each([null, undefined, ""])(
    "n'annonce aucun profil ni analyse quand le quiz n'a pas été passé (%j)",
    (userClass) => {
      const { text, html, subject } = getMissionProtocolEmailContent({ name: "Awa Diallo", userClass });

      expect(text).not.toMatch(/profil/i);
      expect(text).not.toMatch(/analyse/i);
      expect(text).not.toContain("Bâtisseur");
      expect(text).toContain("Awa");
      expect(html).toContain("/missions");
      expect(subject).toContain("Awa");
    },
  );
});
