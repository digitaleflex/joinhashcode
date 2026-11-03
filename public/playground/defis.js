// Généré par defis_source.py — ne pas modifier à la main.
window.DEFIS = [
 {
  "id": "bonjour",
  "module": "HEF-000",
  "mission": "01-Course/chapters/01-Problem-Framing.md",
  "niveau": 1,
  "xp": 10,
  "titre": "Bonjour HashBox",
  "histoire": "Kodi commence son premier jour chez HashBox. Maya lui demande une petite fonction pour accueillir chaque nouveau membre.",
  "consigne": "Écris la fonction `saluer(nom)` qui **renvoie** (avec `return`, pas `print`) le texte `Bonjour, <nom> ! Bienvenue chez HashBox.`",
  "depart": "def saluer(nom):\n    # écris ton code ici\n    pass\n\n\nprint(saluer(\"Léo\"))\n",
  "tests": [
   {
    "nom": "saluer('Léo')",
    "code": "assert saluer('Léo') == 'Bonjour, Léo ! Bienvenue chez HashBox.', f\"Obtenu : {saluer('Léo')!r}\""
   },
   {
    "nom": "saluer('Maya')",
    "code": "assert saluer('Maya') == 'Bonjour, Maya ! Bienvenue chez HashBox.'"
   }
  ],
  "indices": [
   "Une fonction renvoie une valeur avec le mot-clé `return`.",
   "Assemble le texte avec une f-string : `f\"Bonjour, {nom} ...\"`.",
   "`return f\"Bonjour, {nom} ! Bienvenue chez HashBox.\"`"
  ],
  "solution": "def saluer(nom):\n    return f\"Bonjour, {nom} ! Bienvenue chez HashBox.\"\n",
  "lienMission": "../01-Foundations/HEF-000-Engineering-Mindset/01-Course/chapters/01-Problem-Framing.md"
 },
 {
  "id": "panier",
  "module": "HEF-000",
  "mission": "01-Course/chapters/04-Hypothesis-Driven-Debugging.md",
  "niveau": 1,
  "xp": 15,
  "titre": "Le bug du panier",
  "histoire": "Un membre se plaint : avec deux articles en promotion, le total est faux. Sam suspecte la fonction ci-dessous. À toi d'enquêter avec le mode « pas à pas ».",
  "consigne": "Corrige `total_panier(prix, remise)` : elle doit appliquer la remise (en %) **une seule fois** sur la somme des prix, et arrondir à 2 décimales.",
  "depart": "def total_panier(prix, remise):\n    total = 0\n    for p in prix:\n        total = total + p\n        total = total * (1 - remise / 100)\n    return round(total, 2)\n\n\nprint(total_panier([10, 20], 10))   # attendu : 27.0\n",
  "tests": [
   {
    "nom": "deux articles, 10 %",
    "code": "assert total_panier([10, 20], 10) == 27.0, f'Obtenu {total_panier([10, 20], 10)}, attendu 27.0'"
   },
   {
    "nom": "sans remise",
    "code": "assert total_panier([5, 5, 5], 0) == 15"
   },
   {
    "nom": "panier vide",
    "code": "assert total_panier([], 50) == 0"
   }
  ],
  "indices": [
   "Lance « Pas à pas » et regarde `total` à chaque tour de boucle.",
   "La remise est appliquée à chaque article : combien de fois devrait-elle l'être ?",
   "Sors la ligne de la remise de la boucle (enlève son décalage)."
  ],
  "solution": "def total_panier(prix, remise):\n    total = 0\n    for p in prix:\n        total = total + p\n    total = total * (1 - remise / 100)\n    return round(total, 2)\n",
  "lienMission": "../01-Foundations/HEF-000-Engineering-Mindset/01-Course/chapters/04-Hypothesis-Driven-Debugging.md"
 },
 {
  "id": "maximum",
  "module": "HEF-010",
  "mission": "01-Course/chapters/02-variables-conditions-boucles.md",
  "niveau": 1,
  "xp": 15,
  "titre": "Le plus grand score",
  "histoire": "Léo veut afficher le meilleur score du quiz de la semaine. Interdiction d'utiliser `max()` : Sam veut voir l'algorithme.",
  "consigne": "Écris `plus_grand(scores)` qui renvoie la plus grande valeur d'une liste non vide, **sans** utiliser `max()` ni `sorted()`.",
  "depart": "def plus_grand(scores):\n    pass\n",
  "tests": [
   {
    "nom": "cas simple",
    "code": "assert plus_grand([3, 9, 2]) == 9"
   },
   {
    "nom": "nombres négatifs",
    "code": "assert plus_grand([-5, -2, -9]) == -2, 'Attention si tu pars de 0 !'"
   },
   {
    "nom": "un seul élément",
    "code": "assert plus_grand([7]) == 7"
   },
   {
    "nom": "pas de max()",
    "code": "assert 'max(' not in __source__ and 'sorted(' not in __source__, 'max() et sorted() sont interdits ici'"
   }
  ],
  "indices": [
   "Garde en mémoire « le meilleur vu jusqu'ici ».",
   "Initialise-le avec le PREMIER élément, pas avec 0 (pense aux nombres négatifs).",
   "Parcours la liste ; si un élément est plus grand que le meilleur, il le remplace."
  ],
  "solution": "def plus_grand(scores):\n    meilleur = scores[0]\n    for s in scores:\n        if s > meilleur:\n            meilleur = s\n    return meilleur\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/02-variables-conditions-boucles.md"
 },
 {
  "id": "voyelles",
  "module": "HEF-010",
  "mission": "01-Course/chapters/02-variables-conditions-boucles.md",
  "niveau": 1,
  "xp": 15,
  "titre": "Compter les voyelles",
  "histoire": "Maya prépare un jeu de mots pour la communauté et a besoin de compter les voyelles dans des phrases.",
  "consigne": "Écris `compter_voyelles(texte)` qui compte les voyelles `a e i o u y`, en majuscules comme en minuscules.",
  "depart": "def compter_voyelles(texte):\n    pass\n",
  "tests": [
   {
    "nom": "bonjour",
    "code": "assert compter_voyelles('bonjour') == 3"
   },
   {
    "nom": "majuscules",
    "code": "assert compter_voyelles('HASHBOX') == 2"
   },
   {
    "nom": "vide",
    "code": "assert compter_voyelles('') == 0"
   },
   {
    "nom": "avec y",
    "code": "assert compter_voyelles('Python') == 2"
   }
  ],
  "indices": [
   "Parcours le texte caractère par caractère.",
   "Utilise `.lower()` pour ne pas traiter les majuscules à part.",
   "`if c in 'aeiouy': compteur += 1`"
  ],
  "solution": "def compter_voyelles(texte):\n    n = 0\n    for c in texte.lower():\n        if c in 'aeiouy':\n            n += 1\n    return n\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/02-variables-conditions-boucles.md"
 },
 {
  "id": "hashbox",
  "module": "HEF-010",
  "mission": "01-Course/chapters/02-variables-conditions-boucles.md",
  "niveau": 1,
  "xp": 20,
  "titre": "Hash, Box, HashBox !",
  "histoire": "Le jeu d'échauffement préféré de l'équipe : on compte, et on remplace certains nombres par des mots.",
  "consigne": "Écris `hashbox(n)` qui renvoie `\"HashBox\"` si n est divisible par 3 **et** par 5, `\"Hash\"` si divisible par 3, `\"Box\"` si divisible par 5, sinon le nombre sous forme de texte.",
  "depart": "def hashbox(n):\n    pass\n\n\nfor i in range(1, 16):\n    print(hashbox(i))\n",
  "tests": [
   {
    "nom": "3",
    "code": "assert hashbox(3) == 'Hash'"
   },
   {
    "nom": "10",
    "code": "assert hashbox(10) == 'Box'"
   },
   {
    "nom": "15",
    "code": "assert hashbox(15) == 'HashBox', 'Teste d’abord le cas le plus précis !'"
   },
   {
    "nom": "7",
    "code": "assert hashbox(7) == '7', 'Le nombre doit être renvoyé en texte : str(n)'"
   }
  ],
  "indices": [
   "Le reste d'une division s'obtient avec `%` : `n % 3 == 0`.",
   "L'ordre des `if` compte : 15 est divisible par 3, par 5… et par les deux.",
   "Commence par tester `n % 15 == 0`."
  ],
  "solution": "def hashbox(n):\n    if n % 15 == 0:\n        return 'HashBox'\n    if n % 3 == 0:\n        return 'Hash'\n    if n % 5 == 0:\n        return 'Box'\n    return str(n)\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/02-variables-conditions-boucles.md"
 },
 {
  "id": "palindrome",
  "module": "HEF-010",
  "mission": "01-Course/chapters/03-fonctions-invariants-contrats.md",
  "niveau": 2,
  "xp": 20,
  "titre": "Le palindrome",
  "histoire": "Léo a découvert que « Ésope reste ici et se repose » se lit dans les deux sens (sans accents ni espaces). Il veut un détecteur.",
  "consigne": "Écris `est_palindrome(texte)` : vrai si le texte se lit pareil dans les deux sens, en ignorant majuscules, espaces et ponctuation (les lettres accentuées sont déjà remplacées dans les tests).",
  "depart": "def est_palindrome(texte):\n    pass\n",
  "tests": [
   {
    "nom": "kayak",
    "code": "assert est_palindrome('kayak') is True"
   },
   {
    "nom": "phrase",
    "code": "assert est_palindrome('Esope reste ici et se repose') is True"
   },
   {
    "nom": "ponctuation",
    "code": "assert est_palindrome('Engage le jeu, que je le gagne !') is True"
   },
   {
    "nom": "pas un palindrome",
    "code": "assert est_palindrome('HashBox') is False"
   }
  ],
  "indices": [
   "Nettoie d'abord le texte : ne garde que les lettres, en minuscules.",
   "`c.isalnum()` dit si un caractère est une lettre ou un chiffre.",
   "Compare le texte nettoyé à son inverse : `propre[::-1]`."
  ],
  "solution": "def est_palindrome(texte):\n    propre = ''.join(c.lower() for c in texte if c.isalnum())\n    return propre == propre[::-1]\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/03-fonctions-invariants-contrats.md"
 },
 {
  "id": "dichotomie",
  "module": "HEF-010",
  "mission": "01-Course/chapters/05-recherche.md",
  "niveau": 2,
  "xp": 30,
  "titre": "La recherche éclair",
  "histoire": "La liste des 100 000 membres est triée par numéro. Chercher un par un prend trop de temps : Sam propose de couper la liste en deux à chaque étape.",
  "consigne": "Écris `recherche(liste, cible)` qui renvoie l'**indice** de `cible` dans la liste triée, ou `-1` si elle est absente, par **recherche dichotomique** (pas de `.index()` ni de `in`).",
  "depart": "def recherche(liste, cible):\n    gauche, droite = 0, len(liste) - 1\n    # à toi\n    return -1\n",
  "tests": [
   {
    "nom": "trouvé",
    "code": "assert recherche([1, 3, 5, 7, 9], 7) == 3"
   },
   {
    "nom": "absent",
    "code": "assert recherche([1, 3, 5, 7, 9], 4) == -1"
   },
   {
    "nom": "liste vide",
    "code": "assert recherche([], 4) == -1"
   },
   {
    "nom": "bords",
    "code": "assert recherche([2, 4, 6], 2) == 0 and recherche([2, 4, 6], 6) == 2"
   },
   {
    "nom": "grande liste",
    "code": "L = list(range(0, 2_000_000, 2)); assert recherche(L, 1_999_998) == 999_999 and recherche(L, 7) == -1"
   }
  ],
  "indices": [
   "Tant que `gauche <= droite`, regarde l'élément du milieu : `milieu = (gauche + droite) // 2`.",
   "Si l'élément du milieu est trop petit, la cible est à droite : `gauche = milieu + 1`.",
   "Sinon, s'il est trop grand : `droite = milieu - 1`. S'il est égal : `return milieu`."
  ],
  "solution": "def recherche(liste, cible):\n    gauche, droite = 0, len(liste) - 1\n    while gauche <= droite:\n        milieu = (gauche + droite) // 2\n        if liste[milieu] == cible:\n            return milieu\n        if liste[milieu] < cible:\n            gauche = milieu + 1\n        else:\n            droite = milieu - 1\n    return -1\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/05-recherche.md"
 },
 {
  "id": "insertion",
  "module": "HEF-010",
  "mission": "01-Course/chapters/06-tris-fondamentaux.md",
  "niveau": 2,
  "xp": 30,
  "titre": "Le tri des cartes",
  "histoire": "Kodi trie les inscriptions comme on range des cartes à jouer : on prend chaque carte et on la glisse à sa place parmi celles déjà triées.",
  "consigne": "Écris `tri_insertion(liste)` qui renvoie une **nouvelle** liste triée par ordre croissant, sans utiliser `sorted()` ni `.sort()`, et sans modifier la liste reçue.",
  "depart": "def tri_insertion(liste):\n    resultat = list(liste)   # copie : on ne touche pas à l'original\n    # à toi\n    return resultat\n",
  "tests": [
   {
    "nom": "cas simple",
    "code": "assert tri_insertion([5, 2, 9, 1]) == [1, 2, 5, 9]"
   },
   {
    "nom": "doublons",
    "code": "assert tri_insertion([3, 1, 3, 2]) == [1, 2, 3, 3]"
   },
   {
    "nom": "vide",
    "code": "assert tri_insertion([]) == []"
   },
   {
    "nom": "original intact",
    "code": "L = [3, 1, 2]; tri_insertion(L); assert L == [3, 1, 2], 'La liste reçue a été modifiée'"
   },
   {
    "nom": "interdits",
    "code": "assert 'sorted(' not in __source__ and '.sort(' not in __source__, 'sorted() et .sort() sont interdits ici'"
   }
  ],
  "indices": [
   "Pour chaque position i à partir de 1, prends `cle = resultat[i]`.",
   "Décale vers la droite les éléments plus grands que `cle` situés avant i.",
   "Boucle `while j >= 0 and resultat[j] > cle:` puis place `cle` en `j + 1`."
  ],
  "solution": "def tri_insertion(liste):\n    resultat = list(liste)\n    for i in range(1, len(resultat)):\n        cle = resultat[i]\n        j = i - 1\n        while j >= 0 and resultat[j] > cle:\n            resultat[j + 1] = resultat[j]\n            j -= 1\n        resultat[j + 1] = cle\n    return resultat\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/06-tris-fondamentaux.md"
 },
 {
  "id": "recursif",
  "module": "HEF-010",
  "mission": "01-Course/chapters/04-recursion.md",
  "niveau": 2,
  "xp": 25,
  "titre": "Les poupées russes",
  "histoire": "Maya range des boîtes dans des boîtes. Pour compter tous les objets, il faut ouvrir chaque boîte… qui peut contenir d'autres boîtes.",
  "consigne": "Écris la fonction **récursive** `compter(boite)` : une boîte est une liste qui contient des nombres (des objets) ou d'autres listes (des boîtes). Renvoie le nombre total d'objets.",
  "depart": "def compter(boite):\n    total = 0\n    for element in boite:\n        pass  # un objet ? une boîte ?\n    return total\n",
  "tests": [
   {
    "nom": "plate",
    "code": "assert compter([1, 2, 3]) == 3"
   },
   {
    "nom": "imbriquée",
    "code": "assert compter([1, [2, 3], [[4], 5]]) == 5"
   },
   {
    "nom": "boîtes vides",
    "code": "assert compter([[], [[]], 7]) == 1"
   },
   {
    "nom": "vide",
    "code": "assert compter([]) == 0"
   }
  ],
  "indices": [
   "`isinstance(element, list)` dit si l'élément est une boîte.",
   "Si c'est une boîte, son nombre d'objets est… `compter(element)` !",
   "Sinon, c'est un objet : ajoute 1."
  ],
  "solution": "def compter(boite):\n    total = 0\n    for element in boite:\n        if isinstance(element, list):\n            total += compter(element)\n        else:\n            total += 1\n    return total\n",
  "lienMission": "../01-Foundations/HEF-010-Algorithms/01-Course/chapters/04-recursion.md"
 },
 {
  "id": "parentheses",
  "module": "HEF-020",
  "mission": "01-Course/chapters/03-piles-et-files.md",
  "niveau": 2,
  "xp": 30,
  "titre": "Parenthèses équilibrées",
  "histoire": "L'éditeur de HashBox doit signaler les parenthèses mal fermées. Sam : « C'est un travail pour une pile. »",
  "consigne": "Écris `equilibre(texte)` : vrai si chaque `(`, `[`, `{` est fermé par le bon symbole, dans le bon ordre. Les autres caractères sont ignorés.",
  "depart": "def equilibre(texte):\n    pile = []\n    paires = {')': '(', ']': '[', '}': '{'}\n    # à toi\n    return True\n",
  "tests": [
   {
    "nom": "simple",
    "code": "assert equilibre('(a + b) * [c]') is True"
   },
   {
    "nom": "imbriqué",
    "code": "assert equilibre('{[()()]}') is True"
   },
   {
    "nom": "mauvais ordre",
    "code": "assert equilibre('([)]') is False"
   },
   {
    "nom": "non fermé",
    "code": "assert equilibre('((x)') is False"
   },
   {
    "nom": "fermeture en trop",
    "code": "assert equilibre('x)') is False"
   },
   {
    "nom": "vide",
    "code": "assert equilibre('') is True"
   }
  ],
  "indices": [
   "Une ouvrante : on l'empile avec `pile.append(c)`.",
   "Une fermante : la pile doit être non vide et son sommet doit être l'ouvrante correspondante (`pile.pop()`).",
   "À la fin, la pile doit être vide."
  ],
  "solution": "def equilibre(texte):\n    pile = []\n    paires = {')': '(', ']': '[', '}': '{'}\n    for c in texte:\n        if c in '([{':\n            pile.append(c)\n        elif c in paires:\n            if not pile or pile.pop() != paires[c]:\n                return False\n    return not pile\n",
  "lienMission": "../01-Foundations/HEF-020-Data-Structures/01-Course/chapters/03-piles-et-files.md"
 },
 {
  "id": "mots",
  "module": "HEF-020",
  "mission": "01-Course/chapters/04-tables-de-hachage.md",
  "niveau": 2,
  "xp": 25,
  "titre": "Les mots les plus fréquents",
  "histoire": "Maya veut savoir de quoi parlent les messages de la communauté : quels mots reviennent le plus ?",
  "consigne": "Écris `frequences(texte)` qui renvoie un **dictionnaire** {mot: nombre d'apparitions}, en minuscules. Les mots sont séparés par des espaces.",
  "depart": "def frequences(texte):\n    compte = {}\n    # à toi\n    return compte\n",
  "tests": [
   {
    "nom": "simple",
    "code": "assert frequences('le chat et le chien') == {'le': 2, 'chat': 1, 'et': 1, 'chien': 1}"
   },
   {
    "nom": "majuscules",
    "code": "assert frequences('Code code CODE') == {'code': 3}"
   },
   {
    "nom": "vide",
    "code": "assert frequences('') == {}"
   }
  ],
  "indices": [
   "`texte.lower().split()` donne la liste des mots.",
   "Pour chaque mot, augmente son compteur.",
   "`compte[mot] = compte.get(mot, 0) + 1`"
  ],
  "solution": "def frequences(texte):\n    compte = {}\n    for mot in texte.lower().split():\n        compte[mot] = compte.get(mot, 0) + 1\n    return compte\n",
  "lienMission": "../01-Foundations/HEF-020-Data-Structures/01-Course/chapters/04-tables-de-hachage.md"
 },
 {
  "id": "doublons",
  "module": "HEF-020",
  "mission": "01-Course/chapters/05-ensembles-et-dictionnaires.md",
  "niveau": 2,
  "xp": 25,
  "titre": "Les inscriptions en double",
  "histoire": "Des membres se sont inscrits deux fois au même atelier. Il faut garder la première inscription de chacun, dans l'ordre d'arrivée.",
  "consigne": "Écris `sans_doublons(inscrits)` qui renvoie la liste sans doublons, **en gardant l'ordre** de première apparition. Elle doit rester rapide sur 200 000 noms.",
  "depart": "def sans_doublons(inscrits):\n    resultat = []\n    for nom in inscrits:\n        if nom not in resultat:\n            resultat.append(nom)\n    return resultat\n",
  "tests": [
   {
    "nom": "ordre gardé",
    "code": "assert sans_doublons(['léo', 'maya', 'léo', 'sam']) == ['léo', 'maya', 'sam']"
   },
   {
    "nom": "vide",
    "code": "assert sans_doublons([]) == []"
   },
   {
    "nom": "200 000 noms",
    "code": "#lourd\nimport time; L = [f'm{i % 100000}' for i in range(200000)]; t = time.time(); r = sans_doublons(L); d = time.time() - t; assert len(r) == 100000; assert d < 1.5, f'{d:.1f} s : « nom not in resultat » parcourt toute la liste à chaque fois (O(n²))'"
   }
  ],
  "indices": [
   "Le code de départ est correct mais lent : `nom not in resultat` parcourt toute la liste.",
   "Un ensemble (`set`) répond à « est-ce que j'ai déjà vu ce nom ? » en temps constant.",
   "Garde un `vus = set()` à côté de la liste résultat."
  ],
  "solution": "def sans_doublons(inscrits):\n    vus = set()\n    resultat = []\n    for nom in inscrits:\n        if nom not in vus:\n            vus.add(nom)\n            resultat.append(nom)\n    return resultat\n",
  "lienMission": "../01-Foundations/HEF-020-Data-Structures/01-Course/chapters/05-ensembles-et-dictionnaires.md"
 },
 {
  "id": "labyrinthe",
  "module": "HEF-020",
  "mission": "01-Course/chapters/09-parcours-dfs-bfs.md",
  "niveau": 3,
  "xp": 40,
  "titre": "Le labyrinthe de HashBox",
  "histoire": "Le robot de livraison de HashBox doit traverser l'entrepôt. `#` est un mur, `.` un couloir. Il part de S et doit atteindre E.",
  "consigne": "Écris `plus_court(grille)` qui renvoie le nombre minimal de pas (haut, bas, gauche, droite) de S à E, ou `-1` si c'est impossible. Utilise un **parcours en largeur** avec une file (`collections.deque`).",
  "depart": "from collections import deque\n\n\ndef plus_court(grille):\n    lignes = [list(l) for l in grille]\n    # trouve S, puis explore en largeur\n    return -1\n\n\nG = [\n    'S.#.....',\n    '.##.###.',\n    '....#E..',\n]\nprint(plus_court(G))\n",
  "tests": [
   {
    "nom": "exemple",
    "code": "G = ['S.#.....', '.##.###.', '....#E..']; assert plus_court(G) == 15, f'Obtenu {plus_court(G)}'"
   },
   {
    "nom": "impossible",
    "code": "assert plus_court(['S#E']) == -1"
   },
   {
    "nom": "voisins",
    "code": "assert plus_court(['SE']) == 1"
   }
  ],
  "indices": [
   "Repère S : parcours les lignes et les colonnes.",
   "File de départ : `deque([(ligne_S, col_S, 0)])` et un ensemble `vus`.",
   "À chaque sortie de file, essaie les 4 voisins dans la grille, pas des murs, pas déjà vus, avec distance + 1. Si c'est E, renvoie la distance."
  ],
  "solution": "from collections import deque\n\n\ndef plus_court(grille):\n    for i, l in enumerate(grille):\n        if 'S' in l:\n            depart = (i, l.index('S'))\n    file = deque([(depart[0], depart[1], 0)])\n    vus = {depart}\n    while file:\n        i, j, d = file.popleft()\n        if grille[i][j] == 'E':\n            return d\n        for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            a, b = i + di, j + dj\n            if 0 <= a < len(grille) and 0 <= b < len(grille[a]) and grille[a][b] != '#' and (a, b) not in vus:\n                vus.add((a, b))\n                file.append((a, b, d + 1))\n    return -1\n",
  "lienMission": "../01-Foundations/HEF-020-Data-Structures/01-Course/chapters/09-parcours-dfs-bfs.md"
 },
 {
  "id": "deux_sommes",
  "module": "HEF-030",
  "mission": "01-Course/chapters/05-complexite-des-structures.md",
  "niveau": 3,
  "xp": 40,
  "titre": "Deux sommes en un éclair",
  "histoire": "Pour une promotion, Maya cherche deux articles dont les prix font exactement le budget. Il y a 100 000 articles : la solution « tester toutes les paires » ne finira jamais.",
  "consigne": "Écris `deux_sommes(prix, budget)` qui renvoie `True` s'il existe deux articles **différents** dont la somme vaut `budget`. Vise une solution en **O(n)**.",
  "depart": "def deux_sommes(prix, budget):\n    for i in range(len(prix)):\n        for j in range(i + 1, len(prix)):\n            if prix[i] + prix[j] == budget:\n                return True\n    return False\n",
  "tests": [
   {
    "nom": "oui",
    "code": "assert deux_sommes([4, 9, 2, 7], 11) is True"
   },
   {
    "nom": "non",
    "code": "assert deux_sommes([1, 2, 3], 10) is False"
   },
   {
    "nom": "pas le même article deux fois",
    "code": "assert deux_sommes([5], 10) is False and deux_sommes([5, 5], 10) is True"
   },
   {
    "nom": "100 000 articles",
    "code": "#lourd\nimport time; P = list(range(1, 100001)); t = time.time(); r = deux_sommes(P, 300000); d = time.time() - t; assert r is False; assert d < 1.5, f'{d:.1f} s : trop lent'"
   }
  ],
  "indices": [
   "Pour chaque prix p, le partenaire idéal vaut `budget - p`.",
   "Un ensemble des prix déjà vus permet de savoir en temps constant si ce partenaire existe.",
   "Teste le partenaire AVANT d'ajouter p à l'ensemble : ainsi un article ne se compte pas deux fois."
  ],
  "solution": "def deux_sommes(prix, budget):\n    vus = set()\n    for p in prix:\n        if budget - p in vus:\n            return True\n        vus.add(p)\n    return False\n",
  "delai": 10,
  "lienMission": "../01-Foundations/HEF-030-Complexity/01-Course/chapters/05-complexite-des-structures.md"
 },
 {
  "id": "html",
  "module": "HEF-100",
  "mission": "01-Course/chapters/06-securite-web-et-api.md",
  "niveau": 2,
  "xp": 30,
  "titre": "Le message piégé",
  "histoire": "Un petit malin a écrit `<script>alert('piraté')</script>` dans son pseudo. Sur la page des membres, le script s'exécute ! Il faut neutraliser les caractères dangereux avant l'affichage.",
  "consigne": "Écris `echapper(texte)` qui remplace `&` par `&amp;`, `<` par `&lt;`, `>` par `&gt;`, `\"` par `&quot;` et `'` par `&#x27;`. Sans utiliser le module `html`.",
  "depart": "def echapper(texte):\n    return texte\n",
  "tests": [
   {
    "nom": "script",
    "code": "assert echapper('<script>') == '&lt;script&gt;'"
   },
   {
    "nom": "esperluette d'abord",
    "code": "assert echapper('a&b<c') == 'a&amp;b&lt;c', 'Remplace & EN PREMIER, sinon tu abîmes les &lt; déjà produits'"
   },
   {
    "nom": "guillemets",
    "code": "assert echapper('\"x\" \\'y\\'') == '&quot;x&quot; &#x27;y&#x27;'"
   },
   {
    "nom": "texte normal",
    "code": "assert echapper('Bonjour Léo') == 'Bonjour Léo'"
   },
   {
    "nom": "sans module html",
    "code": "assert 'import html' not in __source__ and 'from html' not in __source__, 'Fais-le toi-même, sans le module html'"
   }
  ],
  "indices": [
   "`texte.replace(a, b)` remplace toutes les occurrences.",
   "L'ordre compte : si tu remplaces `<` par `&lt;` puis `&` par `&amp;`, tu obtiens `&amp;lt;`.",
   "Commence par `&`, puis les autres."
  ],
  "solution": "def echapper(texte):\n    texte = texte.replace('&', '&amp;')\n    texte = texte.replace('<', '&lt;').replace('>', '&gt;')\n    return texte.replace('\"', '&quot;').replace(\"'\", '&#x27;')\n",
  "lienMission": "../03-Engineering/HEF-100-Security/01-Course/chapters/06-securite-web-et-api.md"
 },
 {
  "id": "mutants",
  "module": "HEF-110",
  "mission": "01-Course/chapters/09-flakiness-et-qualite-des-suites.md",
  "niveau": 3,
  "xp": 40,
  "titre": "Chasseur de mutants",
  "histoire": "Sam a caché 4 bugs (des « mutants ») dans des copies de la fonction `prix_ttc`. Tes tests doivent tous les attraper… tout en passant sur la bonne version.",
  "consigne": "La fonction `prix_ttc(ht, taux)` (déjà fournie, invisible) renvoie `round(ht * (1 + taux / 100), 2)` et lève `ValueError` si `ht` est négatif. Écris des fonctions `test_…` avec des `assert` qui éliminent les 4 mutants.",
  "depart": "# prix_ttc(ht, taux) est déjà définie.\n\ndef test_cas_simple():\n    assert prix_ttc(100, 20) == 120.0\n\n# Ajoute d'autres tests : arrondi, taux nul, montant négatif…\n",
  "tests": [],
  "mode": "mutants",
  "reference": "def prix_ttc(ht, taux):\n    if ht < 0:\n        raise ValueError('montant négatif')\n    return round(ht * (1 + taux / 100), 2)\n",
  "mutants": [
   {
    "nom": "oubli de l'arrondi",
    "code": "def prix_ttc(ht, taux):\n    if ht < 0:\n        raise ValueError('montant négatif')\n    return ht * (1 + taux / 100)\n"
   },
   {
    "nom": "taux appliqué en soustraction",
    "code": "def prix_ttc(ht, taux):\n    if ht < 0:\n        raise ValueError('montant négatif')\n    return round(ht * (1 - taux / 100), 2) if taux != 20 else round(ht * 1.2, 2)\n"
   },
   {
    "nom": "montant négatif accepté",
    "code": "def prix_ttc(ht, taux):\n    return round(ht * (1 + taux / 100), 2)\n"
   },
   {
    "nom": "zéro refusé",
    "code": "def prix_ttc(ht, taux):\n    if ht <= 0:\n        raise ValueError('montant négatif')\n    return round(ht * (1 + taux / 100), 2)\n"
   }
  ],
  "indices": [
   "Un mutant survit quand aucun test ne regarde l'endroit où il diffère. Lis chaque nom de mutant.",
   "Teste un taux autre que 20 %, un résultat qui doit être arrondi (par exemple 19.99 à 5.5 %), et `ht = 0`.",
   "Pour vérifier une erreur : `try: prix_ttc(-1, 20)` puis `assert False` ; `except ValueError: pass`."
  ],
  "solution": "def test_cas_simple():\n    assert prix_ttc(100, 20) == 120.0\n\ndef test_autre_taux():\n    assert prix_ttc(100, 5.5) == 105.5\n\ndef test_arrondi():\n    assert prix_ttc(19.99, 5.5) == 21.09\n\ndef test_zero():\n    assert prix_ttc(0, 20) == 0\n\ndef test_negatif():\n    try:\n        prix_ttc(-1, 20)\n        assert False, 'aurait dû lever ValueError'\n    except ValueError:\n        pass\n",
  "lienMission": "../03-Engineering/HEF-110-Testing/01-Course/chapters/09-flakiness-et-qualite-des-suites.md"
 },
 {
  "id": "ia_moyenne",
  "module": "HEF-160",
  "mission": "01-Course/chapters/08-verification-humaine-et-tests.md",
  "niveau": 2,
  "xp": 30,
  "titre": "Le code de l'IA",
  "histoire": "Kodi a demandé à une IA une fonction de médiane pour les notes des quiz. Le code a l'air propre… mais Sam n'intègre rien sans vérification.",
  "consigne": "Corrige `mediane(notes)` générée par l'IA : elle doit gérer les listes de taille paire (moyenne des deux valeurs centrales), **ne pas modifier** la liste reçue, et lever `ValueError` pour une liste vide.",
  "depart": "def mediane(notes):\n    # Code généré par une IA : à vérifier !\n    notes.sort()\n    return notes[len(notes) // 2]\n",
  "tests": [
   {
    "nom": "impaire",
    "code": "assert mediane([3, 1, 2]) == 2"
   },
   {
    "nom": "paire",
    "code": "assert mediane([4, 1, 3, 2]) == 2.5, 'Taille paire : moyenne des deux valeurs du milieu'"
   },
   {
    "nom": "liste intacte",
    "code": "L = [3, 1, 2]; mediane(L); assert L == [3, 1, 2], '.sort() modifie la liste de l’appelant : utilise sorted()'"
   },
   {
    "nom": "vide",
    "code": "ok = False\ntry:\n    mediane([])\nexcept ValueError:\n    ok = True\nassert ok, 'Une liste vide doit lever ValueError'"
   }
  ],
  "indices": [
   "`sorted(notes)` renvoie une copie triée sans toucher à l'original.",
   "Si `n % 2 == 0`, la médiane est la moyenne de `s[n//2 - 1]` et `s[n//2]`.",
   "Commence par `if not notes: raise ValueError('liste vide')`."
  ],
  "solution": "def mediane(notes):\n    if not notes:\n        raise ValueError('liste vide')\n    s = sorted(notes)\n    n = len(s)\n    if n % 2:\n        return s[n // 2]\n    return (s[n // 2 - 1] + s[n // 2]) / 2\n",
  "lienMission": "../04-Advanced/HEF-160-AI-Human-Augmentation/01-Course/chapters/08-verification-humaine-et-tests.md"
 }
];
