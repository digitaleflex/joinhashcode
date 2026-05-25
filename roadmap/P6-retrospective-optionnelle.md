# P6 — Rendre la rétrospective optionnelle (étape 2)

**Priorité :** 🟡 Important  
**Effort estimé :** ~1h  
**Pourquoi c'est important :** Après avoir soumis son travail (étape 1), l'utilisateur se retrouve bloqué sur un formulaire de rétrospective obligatoire (difficulté, rating, feedback) avant de "finaliser". C'est une friction inutile qui peut décourager. Le feedback est précieux — mais il doit être optionnel et asynchrone.

---

## Contexte

- **Fichier :** `app/missions/[id]/mission-submission-form.tsx`
- Le formulaire est en 2 étapes :
  - **Étape 1** : contenu de la soumission (lien / texte)
  - **Étape 2** : rétrospective (difficulté 1-5, rating 1-5, feedback texte, suggestions)
- Actuellement, l'étape 1 soumet à l'API (`POST /api/missions`) et affiche automatiquement l'étape 2
- L'utilisateur doit compléter l'étape 2 pour "finaliser"

---

## Ce qu'il faut faire

### Changement de logique

L'étape 1 reste la soumission réelle. **Après succès de l'étape 1, la mission est considérée comme soumise.** L'étape 2 devient une invite optionnelle qui peut être ignorée.

### Étape 1 — Modifier le flux post-soumission dans `mission-submission-form.tsx`

Trouver le handler de l'étape 1 (probablement `handleSubmitStep1` ou similaire). Après succès de l'API :

**AVANT :**
```ts
// Après succès API step 1
setStep(2) // force vers étape 2
```

**APRÈS :**
```ts
// Après succès API step 1
setSubmitSuccess(true) // nouvel état : soumission réussie
setShowRetroPrompt(true) // invite optionnelle
```

### Étape 2 — Ajouter l'état intermédiaire de succès

Ajouter les états suivants dans le composant :

```ts
const [submitSuccess, setSubmitSuccess] = useState(false)
const [showRetroPrompt, setShowRetroPrompt] = useState(false)
```

### Étape 3 — Créer l'écran de succès avec invite optionnelle

Remplacer le passage automatique à l'étape 2 par cet écran :

```tsx
{submitSuccess && (
  <div className="space-y-6 text-center">
    {/* Confirmation */}
    <div className="flex flex-col items-center gap-4">
      <div className="size-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center">
        <Check className="size-8 text-emerald-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">Mission soumise ✓</h3>
        <p className="text-xs text-zinc-400 font-light max-w-xs">
          Ta soumission est en file d'attente. Un reviewer va l'examiner sous 48h.
        </p>
      </div>
    </div>

    {/* Invite rétrospective */}
    <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl text-left space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-3.5 text-primary shrink-0" />
        <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
          Partage ton expérience — optionnel
        </p>
      </div>
      <p className="text-[9px] text-zinc-500 leading-relaxed">
        Tes retours aident à améliorer les missions pour tous les membres.
        Ça prend 30 secondes.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setShowRetroPrompt(true)}
          className="flex-1 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/20 transition-all"
        >
          Donner mon avis
        </button>
        <button
          onClick={() => router.push("/missions")}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 text-[10px] font-bold hover:text-white transition-all"
        >
          Plus tard
        </button>
      </div>
    </div>
  </div>
)}
```

### Étape 4 — Afficher l'étape 2 uniquement si l'utilisateur accepte

```tsx
{showRetroPrompt && !submitSuccess && (
  // Formulaire de rétrospective existant (étape 2)
  // Le bouton "Finaliser" soumet la rétrospective via PATCH /api/missions/[id]/retrospective (voir note ci-dessous)
  // ou peut rester sur le même endpoint si l'API le supporte
)}
```

### Note sur l'API

L'étape 2 actuelle appelle probablement le même endpoint que l'étape 1 ou un endpoint de mise à jour. Vérifier dans `mission-submission-form.tsx` quel endpoint est appelé à l'étape 2.

Si l'étape 2 met à jour la soumission existante (PATCH), pas de changement côté API. Si elle crée un nouvel objet, conserver le comportement.

**Import à ajouter si pas encore présent :**
```ts
import { MessageSquare, Check } from "lucide-react"
```

---

## Résultat attendu

**Avant :** Soumission → automatiquement forcé sur formulaire feedback → doit tout remplir  
**Après :** Soumission → écran de confirmation → invite "Donner mon avis" ou "Plus tard"

---

## Fichiers touchés
- `app/missions/[id]/mission-submission-form.tsx` — uniquement ce fichier
