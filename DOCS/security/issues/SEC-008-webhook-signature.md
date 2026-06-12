# SEC-008 — Webhook Resend : secret en URL, pas de signature

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Software/Data Integrity (OWASP A08) + Cryptographic Failures (A02)
- **Fichier** : `app/api/webhooks/resend/route.ts:11-14`

## Description

Le secret du webhook est transmis en **query string** (`?secret=...`) et aucune signature n'est vérifiée :

```ts
const secret = new URL(req.url).searchParams.get("secret");
if (secret !== process.env.WEBHOOK_SECRET) {
  return new NextResponse("Unauthorized", { status: 401 });
}
```

## Impact

- Le secret en URL apparaît dans les **access logs**, proxys, CDN, historiques → fuite probable.
- En cas de fuite, un attaquant forge des événements `email.bounced`/`email.complained` pour marquer arbitrairement des comptes (`emailStatus: BOUNCED`) → déni de service email ciblé.

## Correctif recommandé

Vérifier la **signature svix** envoyée par Resend (en-têtes `svix-id`, `svix-timestamp`, `svix-signature`) plutôt qu'un secret en URL :

```ts
import { Webhook } from "svix";

export async function POST(req: Request) {
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  let evt;
  try {
    evt = new Webhook(process.env.RESEND_WEBHOOK_SECRET!).verify(payload, headers);
  } catch {
    return new NextResponse("Invalid signature", { status: 401 });
  }
  // ... traiter evt
}
```

À défaut de svix : déplacer au minimum le secret dans un **en-tête** (`Authorization`) et non l'URL.

## Critères d'acceptation

- [ ] Signature vérifiée (ou secret en en-tête, jamais en URL).
- [ ] Payload non signé/invalide → 401.
- [ ] Le secret n'apparaît plus dans aucun log d'accès.
