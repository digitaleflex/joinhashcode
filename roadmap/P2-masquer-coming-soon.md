# P2 — Masquer les missions "Coming Soon" de la liste principale

**Priorité :** 🔴 Critique  
**Effort estimé :** ~1h  
**Pourquoi c'est important :** Actuellement ~70% des missions affichées sont floues avec un overlay "Bientôt". Ça donne une impression de produit inachevé et crée du bruit cognitif. Un utilisateur qui voit 15 missions dont 10 inaccessibles est découragé.

---

## Contexte

- **Fichier principal :** `components/missions/missions-list.tsx`
- Les missions dans `lib/missions.ts` ont un champ `comingSoon: true`
- Actuellement elles sont affichées avec un `blur` et un badge "Bientôt"
- Le rendu est dans le 3e groupe : `Missions en Déploiement`

---

## Ce qu'il faut faire

### Option retenue : Section "Roadmap" discrète en bas de page

Ne pas supprimer totalement les missions coming soon — elles montrent la vision du produit. Mais les séparer clairement et les afficher de façon beaucoup plus sobre, sans prendre autant de place.

### Étape 1 — Dans `components/missions/missions-list.tsx`

**Trouver le groupe "comingSoon"** et remplacer son rendu :

**AVANT (rendu actuel) :**
```tsx
// Section entière avec cartes floues, overlay, etc.
{comingSoonMissions.length > 0 && (
  <section>
    <h2>Missions en Déploiement</h2>
    {comingSoonMissions.map(mission => (
      <div className="... blur-sm ...">
        {/* carte complète floue */}
      </div>
    ))}
  </section>
)}
```

**APRÈS (nouveau rendu sobre) :**
```tsx
{comingSoonMissions.length > 0 && (
  <section className="mt-10 pt-8 border-t border-white/5">
    {/* Titre minimaliste */}
    <div className="flex items-center gap-3 mb-5">
      <div className="size-1.5 rounded-full bg-zinc-600 animate-pulse" />
      <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-600">
        En développement — {comingSoonMissions.length} missions à venir
      </h2>
    </div>

    {/* Liste compacte, pas de cartes complètes */}
    <div className="flex flex-wrap gap-2">
      {comingSoonMissions.map(mission => (
        <div
          key={mission.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-white/5"
        >
          <span className="size-1 rounded-full bg-zinc-700" />
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">
            {mission.title}
          </span>
          <span className="text-[8px] font-mono text-zinc-700 ml-1">
            +{mission.xp} XP
          </span>
        </div>
      ))}
    </div>
  </section>
)}
```

### Étape 2 — S'assurer que la section principale ne contient QUE les missions disponibles

En haut du composant, vérifier que le filtrage est correct :

```ts
// Dans missions-list.tsx — au début du composant
const availableMissions = missions.filter(m => !m.comingSoon && userCanAccess(m))
const lockedMissions = missions.filter(m => !m.comingSoon && !userCanAccess(m))
const comingSoonMissions = missions.filter(m => m.comingSoon)
```

S'assurer que `comingSoonMissions` n'apparaît PAS dans les deux premiers groupes.

### Étape 3 — Supprimer les styles `blur` et les overlays

Rechercher dans tout le composant :
- `blur-sm`, `blur-md` → supprimer sur les cartes coming soon (elles ont maintenant leur propre rendu simple)
- Overlay "Bientôt" avec backdrop → supprimer
- `pointer-events-none` sur les cartes floues → plus nécessaire

---

## Résultat attendu

**Avant :** Liste avec 5 missions normales + 10 cartes complètes floues en dessous  
**Après :** Liste avec 5 missions normales propres + une ligne de chips discrets "10 missions en développement" tout en bas

---

## Fichiers touchés
- `components/missions/missions-list.tsx` — uniquement ce fichier
