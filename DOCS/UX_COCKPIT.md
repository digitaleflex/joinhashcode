# 🕹️ Cockpit UX & Documentation Pédagogique

Ce document centralise l'architecture et les standards d'aide contextuelle mis en œuvre pour garantir une clarté totale de l'application HASHCODE.

## 🌟 Philosophie Pédagogique
L'application repose sur un moteur d'évolution complexe (Vibrance, Drift, Confiance). Pour éviter toute frustration, **aucune métrique ne doit être affichée sans explication**.

## 🛠️ Composants d'Aide

### 1. Tooltips Stratégiques (`Tooltip`)
- **Usage :** Expliquer le "Pourquoi" technique ou stratégique derrière chaque donnée.
- **Accessibilité Mobile :** Sur mobile (`md:hidden`), une icône `Info` est systématiquement ajoutée à côté du label pour permettre l'ouverture du tooltip au toucher.
- **Localisation :**
    - **Dashboard :** Niveau, Série, XP, Connectivité.
    - **Dossier :** Activité, Confiance, Vecteurs (Builder, Creator, etc.).
    - **Missions :** Types de mission, Difficultés, Récompenses.

### 2. Visites Guidées (`TourButton` & `driver.js`)
- **Déclenchement Manuel :** Bouton `HelpCircle` dans la barre supérieure.
- **Auto-Onboarding :** Déclenchement automatique pour les nouveaux membres (XP = 0) lors du montage du Dashboard.
- **Persistance :** Utilisation du `localStorage` (`tour_completed_<path>`) pour s'assurer que le guide ne s'affiche qu'une seule fois par session/page.

### 3. Calibration Neurale (Quiz)
- **Bandeau d'Introduction :** Souligne l'importance de l'identité de build dès le départ.
- **Résultats Documentés :** Chaque score de résultat dispose d'une bulle d'aide expliquant le profil détecté.

## 🧪 Protocole de Validation
Toute modification UX doit être vérifiée selon les critères suivants :
1. **Contraste & Lisibilité :** Les tooltips utilisent le thème `zinc-900` avec bordure `white/10` pour une immersion maximale.
2. **Réactivité :** Le délai de déclenchement est fixé à `0ms` (configuré dans `TooltipProvider`).
3. **Touch-First :** Présence visuelle d'un déclencheur sur mobile.

---
*Dernière mise à jour : Juin 2026*
