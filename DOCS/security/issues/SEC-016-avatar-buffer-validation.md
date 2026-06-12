# SEC-016 — Avatar bufferisé avant contrôle taille + pas de validation magic-bytes

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Disponibilité / validation d'entrée
- **Fichier** : `app/api/user/avatar/route.ts:18-41`

## Description

- `await req.formData()` bufferise tout le corps **avant** le contrôle de taille (`file.size > 2 Mo`) → un gros payload est entièrement chargé en mémoire avant rejet.
- Le type est validé via `file.type` (**fourni par le client**, falsifiable) ; aucune vérification des **magic bytes** du contenu réel.

## Impact

- Pression mémoire / DoS via uploads volumineux répétés.
- Fichier au contenu arbitraire servi avec une extension d'image (risque limité car servi statiquement, mais à durcir).

## Correctif recommandé

1. Imposer une **limite de taille de corps** au niveau plateforme (config route / reverse-proxy).
2. Valider les **magic bytes** après lecture du buffer :

```ts
const buffer = Buffer.from(await file.arrayBuffer());
const sig = buffer.subarray(0, 4).toString("hex");
const ok =
  sig.startsWith("ffd8ff") ||            // JPEG
  sig.startsWith("89504e47") ||          // PNG
  buffer.subarray(0, 4).toString() === "RIFF"; // WEBP (RIFF....WEBP)
if (!ok) return new NextResponse("Contenu de fichier invalide.", { status: 400 });
```

3. Rate-limiter l'endpoint (cf. SEC-005).

## Critères d'acceptation

- [ ] Validation par magic bytes (pas seulement `file.type`).
- [ ] Limite de taille appliquée avant traitement complet.
- [ ] Endpoint rate-limité.
