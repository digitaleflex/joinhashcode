# 🎯 LAB #5 — TON PREMIER RAPPORT D'INVESTIGATION : ARNAQUE MOBILE MONEY

⏱️ 60 min · 📱 téléphone OK (tout se fait dans un navigateur) · NIVEAU : N0

---

## POURQUOI CE LAB

Chaque jour en zone UEMOA (Union Économique et Monétaire Ouest-Africaine —
14 pays, du Bénin à la Côte d'Ivoire), des milliers de personnes perdent de
l'argent dans des arnaques mobile money (Orange Money, MTN MoMo, Wave, Moov
Money…). Les banques et les opérateurs ont besoin de gens capables d'écrire ce
que les tribunaux et les services anti-fraude appellent un **rapport
d'investigation** : des faits, des preuves, une conclusion, des limites. C'est
le livrable le plus vendu en OSINT africain — et le premier contrat HashCode
ressemblera à ça.

---

## CE QUE TU APPRENDS

- Reconnaître le pattern (schéma récurrent) de l'arnaque au « gain » mobile money.
- Analyser un lien suspect SANS cliquer dessus — le réflexe pro.
- Extraire des indicateurs (éléments techniques à vérifier : URL, numéro, texte exact).
- Rédiger un rapport à 5 rubriques qui se tient face à un juriste.

---

## 🧨 LE PATTERN GÉNÉRIQUE — L'ARNAQUE AU « GAGNÉ »

Reconnais la séquence en 4 temps :

1. **L'hameçon** : SMS ou WhatsApp — « Félicitations, vous avez gagné XXX 000
   FCFA ! » — tombé du ciel, jamais de concours auquel tu as participé.
2. **L'urgence** : « Réclame dans les 24 h ou tu perds ».
3. **Le crochet** : un lien vers un « formulaire de réclamation », ou un
   « agent » à contacter sur WhatsApp.
4. **La facture** : « Paye seulement 1 500 FCFA de frais d'activation / de
   dossier / de timbre » — après le paiement, plus rien. Parfois on te demande
   aussi ton code de retrait : là, c'est ton propre compte qui est vidé.

**Les drapeaux rouges 🚩 à retenir :** urgence + frais à payer AVANT de
recevoir + domaine ressemblant à la marque mais faux + numéro WhatsApp
« agent » non officiel + fautes dans le texte + « transfert déjà fait,
confirme juste ».

---

## 🧪 LE CAS FICTIF DE CE LAB

> ⚠️ **Cas entièrement inventé pour l'entraînement.** Toute ressemblance avec
> une arnaque réelle est volontaire (c'est le but) — mais les personnes et
> numéros sont fictifs. Le lien utilise `example.com`, domaine réservé aux
> tests : zéro risque de toucher un vrai site.

**Le témoignage (reçu par « Awa D. », commerçante à Cotonou) :**

> « Le 12 du mois, j'ai reçu un SMS : *Félicitations ! Vous êtes notre 500 000ᵉ
> client. Gain de 250 000 FCFA. Réclamez ici : https://recompense-momo.example.com
> — valide dans 24h*. J'ai ouvert le lien : un formulaire demandait mon nom, mon
> numéro et 1 500 FCFA de "frais de dossier" à envoyer au +229 01 99 88 77 66
> (WhatsApp, photo de profil avec le logo Orange). J'ai payé les 1 500 FCFA par
> Orange Money. Depuis, plus de réponse. »

**Extrais les indicateurs avant tout :** l'URL, le numéro, le texte exact du
SMS, le canal de paiement, le montant, la date.

---

## ÉTAPES NUMÉROTÉES

### Étape 1 — Ta fiche d'indicateurs (10 min)

Dans un tableau, liste les 6 indicateurs du cas (ci-dessus). Pour chacun, note
l'action d'investigation possible. C'est ton plan de travail — un rapport sans
plan se voit.

### Étape 2 — Analyse le lien sans cliquer (15 min)

RÈGLE ABSOLUE : **on ne visite jamais un lien suspect avec son propre
compte/navigateur principal.** À la place :

a) **Réputation du lien** : VirusTotal — **https://www.virustotal.com/gui/home/url**
(gratuit). Onglet `URL` → colle `https://recompense-momo.example.com` →
`Search`. L'outil interroge ~90 antivirus d'un coup. Note le verdict
(ex. « 0/94 » = aucun moteur ne connaît — normal pour un domaine de test, et
aussi pour un domaine créé hier : note ça comme limite).

b) **Antiquité du domaine** : **https://lookup.icann.org** (WHOIS gratuit) →
`recompense-momo.example.com`. Compare avec un domaine officiel (tape
`orange.com`) : tu verras la date de création, le registrar, etc. Un domaine
qui revendique un concours mais créé la semaine même = drapeau rouge 🚩.

### Étape 3 — Cherche des traces (10 min)

Wayback Machine — **https://web.archive.org** → colle l'URL du faux site.
Aucune archive ? Note-le : un site d'arnaque vit souvent 48 h, le temps de
collecter, puis disparaît. Compare avec un vrai site : archivé depuis des années.

### Étape 4 — Confronte au pattern (10 min)

Repasse la liste des drapeaux rouges du pattern générique. Coche ceux présents
dans le cas. Tu viens de faire ce qu'on appelle du **matching de TTP**
(Tactics, Techniques and Procedures — les habitudes opérationnelles d'un
attaquant).

### Étape 5 — Rédige le rapport (15 min)

Gabarit ci-dessous. Ton : factuel, daté, sans émotion. Tu n'écris pas
« c'est une arnaque d'escrocs », tu écris « les éléments collectés sont
cohérents avec le pattern d'arnaque au faux gain, sans contre-preuve
identifiée ».

---

## 📦 LIVRABLE ATTENDU

Un **rapport d'investigation** (max 2 pages) avec les 5 rubriques imposées :

```
1. CONTEXTE — la victime (Awa D.), les faits, la date, le préjudice (3-5 lignes)
2. MÉTHODE — la liste des vérifications effectuées, dans l'ordre, avec l'outil
   utilisé pour chacune (sans cliquer sur le lien)
3. PREUVES — le tableau des indicateurs + le résultat de chaque vérification
   (VirusTotal, WHOIS, Wayback) + les drapeaux rouges cochés vs le pattern
4. CONCLUSION — verdict motivé : « arnaque de probabilité forte/moyable/faible »,
   ce qui fonde le verdict, et QUE faire (signaler à l'opérateur, porter
   plainte auprès de la brigade cyber de ton pays, alerter sa communauté)
5. LIMITES — ce qui manque pour être sûr (le faux site n'existe plus, le
   numéro est fictif, pas d'accès aux logs de l'opérateur mobile money…)
```

**Conforme si :** les 5 rubriques existent, chaque preuve est traçable (outil +
requête + date), la conclusion est nuancée (un probabilité, pas une certitude
absolue), et les limites contiennent au moins 2 éléments.

---

## ⭐ BONUS (optionnel)

- Écris en plus un **message d'alerte de 5 lignes** destiné aux clientes d'Awa
  (langage simple, pas de jargon, un seul message WhatsApp). C'est exactement le
  service « sensibilisation » que les PME achètent.
- Refais le pattern-match sur un SMS douteux que TU as reçu (sans cliquer
  jamais, bien sûr) et compare avec celui d'Awa.

---

## ⛔ JE BLOQUE ?

Poste ton tableau d'indicateurs (pas le rapport fini) dans le groupe pour un
relit par un pair ou un parrain — la relecture croisée, c'est déjà le métier.
**+2 points au répondeur.**

---

## 🔐 RAPPEL ÉTHIQUE

Jamais tu ne contactes l'« escroc » (ni SMS, ni WhatsApp, ni virement test) :
tu documentes, tu n'enquêtes pas en jouant avec le feu, et tu n'avertis pas le
suspect. Jamais tu ne publies le numéro ou le nom d'une personne réelle sans
cadre légal — signalement aux autorités d'abord (au Bénin : la Brigade
cybersécurité de la Police républicaine ; ailleurs : unités cyber et autorités
de protection des données de ton pays). Dans ce lab, tout est fictif et
l'URL est un domaine de test — mais cliquer dessus reste un mauvais réflexe à
prendre : la règle du métier, c'est l'analyse à distance (VirusTotal, WHOIS,
Wayback), jamais la visite directe.
