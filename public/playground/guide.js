// Mémo Python pour débutants : chaque fiche peut être envoyée dans l'éditeur.
window.GUIDE = [
 {titre: "Afficher un message", texte: "print() affiche du texte dans la console.", code: "print(\"Bonjour HashBox !\")\nprint(\"2 + 3 =\", 2 + 3)\n"},
 {titre: "Variables", texte: "Une variable est une étiquette posée sur une valeur.", code: "nom = \"Kodi\"\nage = 21\nprint(f\"{nom} a {age} ans\")\nage = age + 1\nprint(age)\n"},
 {titre: "Conditions", texte: "if, elif, else : faire des choix. N'oublie pas les « : » et le décalage de 4 espaces.", code: "note = 14\nif note >= 16:\n    print(\"Excellent\")\nelif note >= 10:\n    print(\"Validé\")\nelse:\n    print(\"À retravailler\")\n"},
 {titre: "Boucle for", texte: "Répéter pour chaque élément. range(n) compte de 0 à n - 1.", code: "for i in range(5):\n    print(\"tour\", i)\n\nfor prenom in [\"Kodi\", \"Maya\", \"Sam\"]:\n    print(\"Salut\", prenom)\n"},
 {titre: "Boucle while", texte: "Répéter tant qu'une condition est vraie. Attention : la condition doit finir par devenir fausse !", code: "n = 1\nwhile n < 100:\n    n = n * 2\nprint(n)\n"},
 {titre: "Fonctions", texte: "def crée une fonction ; return renvoie le résultat.", code: "def carre(x):\n    return x * x\n\nprint(carre(7))\n"},
 {titre: "Listes", texte: "Une liste range des valeurs dans l'ordre. Les indices commencent à 0.", code: "scores = [12, 18, 9]\nscores.append(15)\nprint(scores[0], len(scores), sum(scores))\nprint(sorted(scores))\n"},
 {titre: "Dictionnaires", texte: "Un dictionnaire associe des clés à des valeurs.", code: "xp = {\"Kodi\": 120, \"Maya\": 300}\nxp[\"Sam\"] = 450\nfor nom, points in xp.items():\n    print(nom, points)\n"},
 {titre: "Ensembles", texte: "Un ensemble (set) ne garde aucun doublon et répond très vite à « est-ce que x est dedans ? ».", code: "vus = set()\nfor mot in \"le chat et le chien\".split():\n    vus.add(mot)\nprint(vus, \"chat\" in vus)\n"},
 {titre: "Lire une entrée", texte: "input() lit une ligne. Remplis le champ « Entrées » sous l'éditeur.", code: "prenom = input(\"Ton prénom ? \")\nprint(\"Bienvenue\", prenom)\n"},
 {titre: "Gérer une erreur", texte: "try / except intercepte une erreur au lieu d'arrêter le programme.", code: "try:\n    n = int(\"douze\")\nexcept ValueError:\n    print(\"Ce n'est pas un nombre !\")\n"},
];
