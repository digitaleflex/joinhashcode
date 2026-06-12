# SEC-009 — CSV / formula injection (export admin)

- **Gravité** : 🟡 Moyenne · **Priorité** : P2 · **Statut** : 🔴 OPEN
- **Catégorie** : Injection (OWASP A03)
- **Fichier** : `app/api/admin/users/export/route.ts:56-64`

## Description

Les valeurs string de l'export CSV sont seulement entourées de guillemets, jamais neutralisées. Un champ contrôlé par l'utilisateur (`pseudo`, `name`, `city`) commençant par `=`, `+`, `-`, `@` est interprété comme **formule** à l'ouverture du CSV dans Excel/Google Sheets.

```ts
if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`; // ⚠️ pas de neutralisation de formule
```

## Impact

Exécution de formule côté admin (exfiltration de données via `=IMPORTXML(...)`, `=HYPERLINK(...)`, voire exécution de commande selon la config) lorsqu'un administrateur ouvre l'export. Cible : les administrateurs.

## Scénario

Un utilisateur définit son pseudo `=cmd|'/c calc'!A1` (ou un payload d'exfiltration). L'admin exporte le CSV et l'ouvre → la formule s'exécute dans son tableur.

## Correctif recommandé

Préfixer d'une apostrophe toute cellule commençant par un caractère de formule :

```ts
function csvCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (val instanceof Date) return val.toISOString();
  if (typeof val !== "string") return String(val);
  // Neutraliser l'injection de formule
  const safe = /^[=+\-@\t\r]/.test(val) ? `'${val}` : val;
  return `"${safe.replace(/"/g, '""')}"`;
}
```

Appliquer aussi à l'export par utilisateur si un format CSV y est ajouté.

## Critères d'acceptation

- [ ] Une cellule commençant par `= + - @` est préfixée par `'`.
- [ ] Les guillemets restent correctement échappés.
- [ ] Test : pseudo malicieux exporté = inerte à l'ouverture tableur.
