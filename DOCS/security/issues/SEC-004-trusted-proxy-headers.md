# SEC-004 — IP spoofable (`trustedProxyHeaders`)

- **Gravité** : 🟠 Élevée · **Priorité** : P1 · **Statut** : ✅ DONE
- **Catégorie** : Authentication Failures (OWASP A07)
- **Fichier** : `lib/auth.ts:153`

## Description

`advanced.trustedProxyHeaders: true` fait confiance **inconditionnellement** à `X-Forwarded-For`. Si le conteneur Docker est joignable autrement que par le reverse-proxy de confiance (ou si le proxy ne réécrit pas l'en-tête), un attaquant forge son IP à chaque requête.

## Impact

Le rate-limiting par IP (OTP, sign-in) devient inopérant → **brute-force OTP** et **credential stuffing** redeviennent réalistes. Même problème dans `app/api/contact/route.ts:37` (`x-forwarded-for[0]` brut).

## Correctif recommandé

1. **Garantir au niveau réseau** que seul le reverse-proxy peut atteindre le conteneur (binder sur l'IP interne / réseau Docker, firewall VPS) — ne jamais exposer le port 3000 publiquement.
2. Ne faire confiance qu'au **dernier hop** (IP injectée par votre proxy), pas à la valeur fournie par le client. Si le proxy ajoute un en-tête dédié (ex. `X-Real-IP` côté Nginx), s'appuyer dessus.
3. Pour `contact`, dériver l'IP de manière fiable (en-tête posé par le proxy) plutôt que le premier élément arbitraire de `x-forwarded-for`.

```ts
// Exemple : ne garder que l'IP la plus à droite ajoutée par le proxy de confiance
function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const parts = xff.split(",").map(s => s.trim()).filter(Boolean);
  return parts.at(-1) ?? "unknown"; // dernier hop = posé par notre proxy
}
```

## Critères d'acceptation

- [ ] Le port applicatif n'est pas exposé directement sur Internet (vérif `docker ps` / firewall).
- [ ] Spoofer `X-Forwarded-For` ne réinitialise pas les compteurs de rate-limit.
- [ ] `contact` dérive l'IP de façon non falsifiable.
- [ ] Documenter l'hypothèse « tout trafic passe par le proxy » dans le README infra.
