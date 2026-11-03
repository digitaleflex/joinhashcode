# HashCode Playground

Un terrain de jeu pour coder en Python **directement dans le navigateur** : aucune installation, aucun serveur de calcul. Python tourne grâce à [Pyodide](https://pyodide.org) dans un *worker*, ce qui permet d'arrêter proprement une boucle infinie.

## Ce qu'il propose

| Fonction | Description |
|---|---|
| **Éditeur** | Coloration Python, numéros de ligne, fermeture automatique des parenthèses, Tab = 4 espaces, `Ctrl + /` pour commenter, `Ctrl + Entrée` pour exécuter |
| **Auto-complétion** | Mots-clés, fonctions intégrées (avec explication en français), tes propres noms, modèles (`for`, `def`, `if`…) et, après une exécution, les **vraies méthodes** d'un objet en tapant `objet.` (`Ctrl + Espace` pour l'ouvrir à la main) |
| **Erreurs expliquées** | Chaque erreur Python est traduite en français simple par Kodi, avec la ligne surlignée et un conseil |
| **Pas à pas** | Le code est rejoué ligne par ligne : ligne courante surlignée, variables (celles qui changent sont mises en valeur), valeur renvoyée par les fonctions, sortie au fil de l'eau, lecture automatique |
| **Défis** | 17 défis reliés aux missions des cours (HEF-000 à HEF-160), corrigés automatiquement par des tests, avec 3 indices progressifs puis la solution |
| **Chasse aux mutants** | Un défi où l'apprenant écrit lui-même les tests pour éliminer des versions buguées (HEF-110) |
| **Défis de performance** | Le code de départ est juste mais trop lent : il faut trouver une meilleure complexité (HEF-020, HEF-030) |
| **Progression** | XP (moins d'XP si on utilise des indices), niveaux, 11 badges, série de jours, brouillons sauvegardés — dans le navigateur, sans compte |
| **Guide** | 11 fiches des bases de Python, chacune ouvrable dans le bac à sable |
| **Bac à sable** | Code libre, avec champ « Entrées » pour `input()` |

## Lancer en local

Les *workers* ne fonctionnent pas en ouvrant le fichier directement : il faut un petit serveur. Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/playground/`. Une connexion Internet est nécessaire au premier chargement (Pyodide et l'éditeur viennent de CDN).

## Ajouter ou modifier un défi

Les défis sont écrits dans `defis_source.py`, jamais directement dans `defis.js`. Pour chaque défi : histoire, consigne, code de départ, tests (`assert`), 3 indices, solution.

```bash
python3 playground/defis_source.py
```

Le script vérifie que **la solution passe tous les tests**, que **le code de départ échoue** (sauf pour les défis de performance, où il est juste mais trop lent), et que le lien vers la mission du cours existe ; puis il régénère `defis.js`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html`, `style.css`, `app.js` | Interface |
| `worker.js` | Démarre Pyodide hors du fil principal |
| `runtime.py` | Moteur Python : exécution, pas à pas, tests, mutants, erreurs en français, auto-complétion |
| `defis_source.py` → `defis.js` | Défis et leur vérification |
| `guide.js` | Fiches du guide |

## Limites connues

- Bibliothèque standard de Python uniquement (pas de `pip install`).
- La progression est stockée dans le navigateur : elle ne suit pas l'apprenant sur un autre appareil, et disparaît si les données du site sont effacées.
- Le mode pas à pas s'arrête à 2 000 étapes.
- Premier chargement d'environ 10 Mo (Python compilé en WebAssembly), mis en cache ensuite.
