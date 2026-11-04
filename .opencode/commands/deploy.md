---
description: Préflight puis déploiement image GHCR
---

Prépare et exécute un déploiement de JoinHashCode.

Préflight obligatoire :
1. CI verte sur le commit courant (GitHub Actions).
2. Image GHCR `ghcr.io/digitaleflex/joinhashcode:latest` disponible.
3. Aucune migration destructive en attente.

Puis :
- `./deploy.sh --image`
- vérifie `/api/status`, `/`, `/favicon.ico`, `/brand/hashcode-wordmark.png`
- vérifie le healthcheck du conteneur
- signale tout 404/500 ou conteneur unhealthy

Rollback : `IMAGE_TAG=<sha> ./deploy.sh --image`.
Ne déploie jamais sans confirmation explicite.
