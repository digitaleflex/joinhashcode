# Spécification Technique : Badges & Technical Level - /dossier

**Date** : 2025-05-22
**Statut** : En attente d'approbation

## 1. Objectif
Améliorer la page `/dossier` (Dossier Personnel) en affichant visuellement les badges de l'utilisateur et son niveau technique (`technicalLevel`). Le style doit être "Cyber-Modern" avec une esthétique tactique.

## 2. Analyse Technique
- **Source de données** : Modèle `User` de Prisma.
    - `badges` : `String[]`
    - `technicalLevel` : `String?`
- **Composants cibles** : `app/dossier/page.tsx`
- **Design UI** : Glassmorphism, polices mono, majuscules, badges colorés ou états vides tactiques.

## 3. Modifications proposées

### A. Affichage du Technical Level (Section Header)
Juste en dessous du nom ou à côté de l'ID, nous ajouterons une distinction stylisée.
- **Label** : `CLASSE` ou `NIVEAU_TECHNIQUE`
- **Format** : `user.technicalLevel` en majuscules avec une bordure néon.
- **Emplacement** : Header de la page dossier, près du status "Actif".

### B. Section Badges & Distinctions
Ajout d'une nouvelle section sous "Neuro-Analysis Results" ou dans une colonne dédiée.
- **Titre** : `Distinctions_Système`
- **Affichage des badges** : 
    - Liste de badges horizontaux.
    - Utilisation du composant `Badge` de Shadcn avec un style custom.
- **État Vide Tactique** :
    - Si `user.badges` est vide, afficher un message : `[ AUCUN_INSIGNE_DÉTECTÉ ]` avec une opacité réduite.

## 4. Composants utilisés
- `Badge` (Shadcn/UI)
- `Card`, `CardContent` (Shadcn/UI)
- `Shield` ou `Medal` (Lucide React)
- `Empty` (Composant local si pertinent ou simple texte stylisé)

## 5. Architecture de Données
Aucune modification du schéma Prisma n'est nécessaire. Les champs existent déjà.

---
**Approbation requise avant implémentation.**
