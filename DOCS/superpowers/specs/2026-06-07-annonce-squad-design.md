# Design Doc : Alerte Tactique (Annonce Squad)

## Goal
Améliorer la visibilité des annonces épinglées par le leader de l'escouade pour assurer que tous les membres reçoivent les communications critiques sans délai.

## Architecture
- **Composant :** Modification du composant `SquadJourney` (`components/dashboard/squad-journey.tsx`).
- **Logique :** Utilisation de la condition `squad?.announcement` pour le rendu conditionnel.
- **Style :** Vanilla CSS (Tailwind classes) pour le style "Cyber-Modern".

## Components
- **Container :** `div` avec `bg-primary/5`, `border-primary` (2px), `rounded-2xl`, `animate-pulse` (très lente).
- **Icône :** `Megaphone` (Lucide React) avec `text-primary` et effet `drop-shadow`.
- **Texte :** Titre "ANNONCE ÉPINGLÉE" (`font-mono`, `text-primary`, `text-xs`) et corps de texte (`text-base`, `text-white`, `font-sans`).

## Data Flow
- Données transmises via le prop `squad` depuis `app/squad/page.tsx`.
- Mise à jour optimiste déjà en place dans `SquadJourney` lors de la sauvegarde dans `OrgSettingsForm`.

## Error Handling
- Si `announcement` est vide ou null, le bloc ne s'affiche pas (aucun espace vide ne doit être laissé).

## Testing
- **Visual Testing :** Vérifier l'affichage sur mobile et desktop.
- **Unit Testing :** Vérifier que le bloc n'apparaît pas si `announcement` est vide.
