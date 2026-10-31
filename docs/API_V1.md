# API v1 — Contrat d'intégration JoinHashCode

> Statut : proposition fondatrice à valider par review.  
> Version du document : 1.0.0  
> Date : 31 octobre 2026  
> Périmètre : contrats HTTP destinés aux applications et services externes (Learning, Labs, Reboot et futurs clients).

## 1. Décision d'architecture

Les nouvelles intégrations inter-applications passent par `/api/v1/*`.

Cette décision ne signifie **pas** que toutes les routes existantes doivent être déplacées immédiatement. Les routes historiques de `/api/*` restent en place tant qu'une migration explicite, testée et compatible avec leurs consommateurs n'est pas planifiée.

- `/api/v1/*` : API publique ou inter-applications, contrat stable et documenté.
- `/api/auth/*` : Better Auth, conservé tel quel. Ce n'est pas une API métier à versionner.
- `/api/admin/*`, `/api/internal/*`, routes UI et Server Actions : interfaces internes, non exposées comme contrats d'intégration par défaut.
- Les routes historiques restent compatibles ; aucun renommage massif ni redirection implicite.

Le versionnement porte sur le **contrat**, pas sur l'organisation interne des fichiers, les modèles Prisma ou les versions de Next.js.

## 2. Principes non négociables

1. **JoinHashCode est la source de vérité** des identités, profils communautaires, orientations, parcours, progression et evidences globales.
2. Learning possède ses contenus pédagogiques, inscriptions et progression pédagogique.
3. Labs possède l'exécution des environnements, les tentatives et les soumissions de labs.
4. Les applications ne lisent ni n'écrivent directement dans la base de données d'une autre application.
5. Les contrats exposent des DTO explicites ; ils ne retournent jamais des objets Prisma bruts.
6. Toute entrée externe est validée côté serveur (Zod ou validateur équivalent).
7. Les écritures sensibles sont authentifiées, autorisées, limitées en débit et idempotentes lorsque leur répétition peut créer un doublon ou un effet de bord.
8. Une intégration ne doit jamais importer les types, tables ou règles internes d'un autre produit.

## 3. Frontières de responsabilité

| Domaine | Source de vérité | Responsabilité de JoinHashCode |
|---|---|---|
| Identité et session | JoinHashCode / Better Auth | Authentifier l'utilisateur et exposer un identifiant stable |
| Profil membre | JoinHashCode | Profil déclaré, statut communautaire et préférences |
| Orientation | JoinHashCode | Spécialisation, objectifs et recommandations |
| Learning | Application Learning | Consommer les informations d'identité autorisées ; Learning garde ses contenus, inscriptions et progression pédagogique |
| Labs | Application Labs | Consommer l'identité et recevoir les résultats utiles ; Labs garde l'exécution et les soumissions |
| Evidence | JoinHashCode Core | Centraliser les preuves, leur validation et leur visibilité dans le portfolio |
| Événements d'intégration | Producteur de l'événement | Distribuer des notifications signées, sans transférer la propriété des données |

Le transfert d'un résultat de Learning ou Labs vers JoinHashCode ne donne pas à l'application source le droit de modifier directement le profil, l'orientation ou le statut d'un membre.

## 4. Conventions HTTP

- Base : `https://<host>/api/v1`
- Transport : HTTPS obligatoire hors environnement local.
- Format : JSON UTF-8.
- Dates : ISO 8601 UTC.
- Identifiants : opaques, stables, non séquentiels lorsque l'exposition publique le justifie.
- Noms : `camelCase` pour les propriétés JSON.
- Méthodes : GET sans effet de bord ; POST pour création/action ; PATCH pour modification partielle ; DELETE uniquement si la suppression est réellement prévue.
- Une réponse ne doit pas exposer stack trace, requête SQL, secrets, tokens, données privées d'un autre membre ou détails internes d'infrastructure.

### 4.1 Réponse de succès

Les nouvelles routes suivent cette enveloppe :

```json
{
  "data": {
    "id": "mem_01J...",
    "status": "active"
  },
  "meta": {
    "requestId": "req_01J..."
  }
}
```

Pour une collection paginée :

```json
{
  "data": [],
  "meta": {
    "requestId": "req_01J...",
    "pagination": {
      "nextCursor": null,
      "hasMore": false
    }
  }
}
```

La pagination par curseur est préférée à `offset` pour les collections susceptibles de croître. Les limites maximales doivent être documentées par endpoint.

### 4.2 Réponse d'erreur

Format commun inspiré de Problem Details (RFC 9457), avec un code métier stable :

```json
{
  "type": "https://joinhashcode.com/problems/validation-error",
  "title": "Validation failed",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "One or more fields are invalid.",
  "requestId": "req_01J...",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT"
    }
  ]
}
```

Codes HTTP usuels :

| HTTP | Usage |
|---|---|
| 400 | Requête mal formée |
| 401 | Authentification absente ou invalide |
| 403 | Identité reconnue, permission insuffisante |
| 404 | Ressource absente ou non visible par le demandeur |
| 409 | Conflit métier ou clé d'idempotence réutilisée avec un autre contenu |
| 422 | Données syntaxiquement valides mais contrat ou règle métier invalide |
| 429 | Limite de débit atteinte |
| 500 | Erreur interne non détaillée au client |
| 502 / 503 / 504 | Dépendance indisponible, service temporairement indisponible ou timeout |

Ne pas utiliser les messages d'erreur pour révéler si un email est inscrit ou non, sauf dans un parcours explicitement conçu pour cette divulgation.

## 5. Authentification et autorisation

### Utilisateur final

Les endpoints destinés à l'application web peuvent utiliser la session Better Auth existante et doivent vérifier l'autorisation côté serveur à chaque requête.

### Service à service

Les intégrations Learning, Labs et Reboot utilisent une identité de service distincte de la session navigateur :

- OAuth 2.0 Client Credentials de préférence, ou JWT signé à durée de vie courte si le déploiement l'exige ;
- secrets stockés exclusivement dans les variables d'environnement / coffre de secrets ;
- rotation et révocation possibles ;
- scopes minimaux par service et par action ;
- vérification de l'émetteur, de l'audience, de l'expiration et de la signature ;
- aucune clé API partagée en dur, dans le navigateur ou dans le dépôt.

Exemples de scopes à affiner avec les cas d'usage :

- `members:read`
- `members:write`
- `onboarding:write`
- `learning:status:read`
- `labs:results:write`
- `evidences:read`
- `evidences:submit`

Un scope ne remplace pas les règles métier : un service ne peut agir que dans le périmètre des ressources et finalités qui lui sont attribués.

## 6. Idempotence, intégrité et fiabilité

Pour les POST qui créent une ressource ou déclenchent un effet de bord, le client doit envoyer `Idempotency-Key` (valeur opaque, unique par opération logique).

Le serveur doit :
- associer la clé au client authentifié et à l'opération ;
- conserver le résultat pendant une durée documentée ;
- retourner le résultat initial en cas de répétition équivalente ;
- répondre `409 IDEMPOTENCY_KEY_REUSED` si la même clé est réutilisée avec un payload différent ;
- ne jamais supposer qu'un timeout signifie que l'opération a échoué.

Les opérations sensibles doivent être transactionnelles lorsque plusieurs écritures locales sont nécessaires. Les appels à des services externes ne doivent pas être exécutés dans une transaction DB longue.

## 7. Webhooks et événements

Les webhooks servent à notifier un changement ; ils ne remplacent pas une API de lecture ni une source de vérité.

Chaque événement comporte au minimum :

```json
{
  "id": "evt_01J...",
  "type": "labs.submission.reviewed",
  "version": "1",
  "occurredAt": "2026-10-31T12:00:00.000Z",
  "producer": "hashcode-labs",
  "data": {}
}
```

Exigences :
- signature HMAC ou mécanisme équivalent, avec horodatage et protection anti-rejeu ;
- identifiant d'événement unique ;
- retries avec backoff exponentiel et plafond documenté ;
- traitement idempotent côté consommateur ;
- journalisation des échecs et possibilité de rejouer un événement ;
- aucune donnée personnelle superflue dans le payload.

Les noms d'événements et leurs schémas seront documentés avant activation en production.

## 8. Ressources candidates de v1

Ces routes sont des propositions de contrat, **pas des endpoints déjà implémentés**. Elles seront livrées par lots, avec schémas, autorisations et tests propres à chaque ressource.

| Ressource | Endpoint candidat | Usage |
|---|---|---|
| Profil courant | `GET /members/me` | Lire le profil du membre authentifié |
| Profil courant | `PATCH /members/me` | Modifier les champs autorisés du profil |
| Session d'onboarding | `POST /onboarding/sessions` | Démarrer ou reprendre un onboarding |
| Conversion d'acquisition | `POST /integrations/acquisitions` | Recevoir un contrat AcquisitionContext versionné |
| Résultat de lab | `POST /integrations/labs/results` | Recevoir un résultat signé et idempotent |
| Evidence | `POST /evidences` | Soumettre une preuve à JoinHashCode |
| Evidence | `GET /evidences/{id}` | Lire une preuve selon les permissions |
| Santé API | `GET /health` | Vérifier la disponibilité de la couche API |

Les routes `/integrations/*` sont des frontières explicites : elles valident les contrats entrants et délèguent à des services applicatifs internes. Elles ne doivent pas devenir des accès CRUD génériques aux tables.

## 9. Versionnement et compatibilité

- La version majeure est dans le chemin : `/api/v1`.
- Ajout d'un champ optionnel, d'une route ou d'une valeur non bloquante : compatible, pas de nouvelle version majeure.
- Renommer/supprimer un champ, changer son type ou sa sémantique, modifier une règle d'autorisation ou rendre obligatoire un champ auparavant optionnel : changement cassant.
- Un changement cassant exige `/api/v2`, une période de coexistence et un plan de migration.
- Une version dépréciée doit annoncer sa date de fin, les consommateurs concernés et la migration attendue.
- Ne jamais faire dépendre un consommateur du schéma Prisma ou de l'ordre des propriétés JSON.

Les contrats sont testés contre des exemples et schémas versionnés. Les tests de compatibilité doivent être exécutés en CI avant fusion.

## 10. Organisation du code cible

L'organisation exacte suivra les conventions déjà présentes dans le dépôt. Cible indicative :

```text
app/api/v1/
  health/route.ts
  members/me/route.ts
  onboarding/sessions/route.ts
  integrations/
    acquisitions/route.ts
    labs/results/route.ts
  evidences/
    route.ts
    [id]/route.ts

lib/api/
  auth/
  errors/
  http/
  rate-limit/

lib/api/v1/
  contracts/
  schemas/
  services/

docs/
  API_V1.md
  openapi/
    v1.yaml
```

Les handlers Next.js doivent rester minces : authentification → validation → autorisation → service applicatif → réponse normalisée. La logique métier ne doit pas être dupliquée dans les route handlers.

## 11. OpenAPI et qualité

La spécification OpenAPI 3.1 est la référence machine-readable à maintenir avec les routes livrées. Le dépôt possède déjà une commande `pnpm generate:openapi` ; son implémentation et ses sorties doivent être auditées avant de devenir un gate CI.

Chaque endpoint livré doit avoir :
- schéma d'entrée et de sortie ;
- documentation auth/scopes et erreurs ;
- tests unitaires de validation et tests d'intégration ;
- test d'accès non autorisé ;
- test d'idempotence pour les écritures concernées ;
- limite de débit et limites de payload ;
- exemples anonymisés ;
- métriques/logs avec request ID, sans secrets ni données personnelles inutiles.

## 12. Plan de livraison

1. **Fondation** : conventions, erreurs, request ID, auth service-to-service, rate limiting et OpenAPI vérifiée.
2. **Identité / membres** : endpoints strictement nécessaires, sans exposer le modèle User/Member brut.
3. **Acquisition / onboarding** : contrat AcquisitionContext indépendant du schéma Reboot ; traiter notamment l'issue #394.
4. **Learning / Labs / Evidence** : intégrations par événements et endpoints ciblés, sans accès direct aux bases des applications.
5. **Compatibilité CI** : tests de contrats, tests de non-régression et stratégie de dépréciation.

Chaque étape doit être une PR limitée, vérifiable et réversible. Pas de migration globale des routes historiques.

## 13. Hors périmètre de cette fondation

- Construire un API Gateway ou introduire des microservices sans besoin mesuré.
- Déplacer toutes les routes historiques vers `/api/v1`.
- Remplacer Better Auth ou versionner son endpoint.
- Exposer les modèles Prisma comme DTO.
- Ajouter une couche de messaging complexe avant d'avoir des événements et consommateurs réels.
- Implémenter toutes les ressources candidates dans une seule PR.

---

**Règle de livraison :** aucun endpoint ne doit être annoncé comme disponible tant que son handler, ses contrôles de sécurité, ses tests et sa documentation ne sont pas présents dans le dépôt.
