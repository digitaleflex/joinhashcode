---
name: HashCode Deploy
description: Déployer JoinHashCode depuis l'image GHCR et vérifier la production
---

# Déploiement JoinHashCode

## Préflight
1. `git status -sb` : working tree propre, branche à jour.
2. CI verte sur le commit courant (`gh run list --workflow=ci.yml`).
3. Image disponible (`gh run list --workflow=deploy.yml`).
4. Aucune migration destructive en attente.

## Déploiement
```bash
./deploy.sh --image
```

Le script pull `ghcr.io/digitaleflex/joinhashcode:latest`, recrée le conteneur
et vérifie les assets statiques.

## Vérifications
- `docker inspect hashcode-web --format '{{.State.Health.Status}}'` → healthy
- `curl -s -o /dev/null -w "%{http_code}" https://joinhashcode.com/api/status` → 200
- `/`, `/favicon.ico`, `/brand/hashcode-wordmark.png` → 200

Après une recréation, Traefik peut répondre 404 pendant 20–30 s : attendre avant
de conclure à un échec.

## Rollback
```bash
IMAGE_TAG=<sha> ./deploy.sh --image
```

## Règles
- Ne jamais laisser un `npm run build` non déployé sur le VPS.
- Ne jamais supprimer les données ou volumes.
- Demander confirmation avant tout déploiement.
