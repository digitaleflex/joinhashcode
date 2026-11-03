/* HashCode Playground — interface. Python tourne dans worker.js (Pyodide). */
(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const md = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const DEFIS = window.DEFIS || [];
const MODULES = { 'HEF-000': "Mentalité d'ingénieur", 'HEF-010': 'Algorithmes', 'HEF-020': 'Structures de données', 'HEF-030': 'Complexité', 'HEF-100': 'Sécurité', 'HEF-110': 'Tests et qualité', 'HEF-160': 'IA et augmentation humaine' };
const PERSOS = ['kodi', 'maya', 'sam', 'leo'];

/* ------------------------------------------------------------------ progression (stockée dans le navigateur) */
const CLE = 'hashcode-playground-v1';
let P = { xp: 0, faits: {}, indices: {}, badges: [], jours: [], brouillons: {}, stats: { exec: 0, pas: 0 } };
try { const s = localStorage.getItem(CLE); if (s) P = Object.assign(P, JSON.parse(s)); } catch (e) { /* navigation privée : progression non sauvegardée */ }
const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(P)); } catch (e) { } };
const NIVEAUX = ['Apprenti·e', 'Explorateur·rice', 'Bâtisseur·se', 'Ingénieur·e', 'Architecte', 'Légende HashCode'];
const BADGES = [
  { id: 'premier_pas', e: '👣', nom: 'Premiers pas', desc: 'Exécuter ton premier programme' },
  { id: 'premier_defi', e: '🎯', nom: 'Premier défi', desc: 'Réussir un défi' },
  { id: 'sans_indice', e: '🧠', nom: 'Sans filet', desc: 'Réussir un défi sans aucun indice' },
  { id: 'detective', e: '🔎', nom: 'Détective', desc: 'Utiliser le mode pas à pas' },
  { id: 'cinq', e: '⭐', nom: 'Cinq sur cinq', desc: 'Réussir 5 défis' },
  { id: 'dix', e: '🌟', nom: 'Dix de der', desc: 'Réussir 10 défis' },
  { id: 'tous', e: '🏆', nom: 'Grand chelem', desc: 'Réussir tous les défis' },
  { id: 'rapide', e: '⚡', nom: 'Éclair', desc: 'Réussir un défi de performance' },
  { id: 'chasseur', e: '🧬', nom: 'Chasseur de mutants', desc: 'Éliminer tous les mutants' },
  { id: 'gardien', e: '🛡️', nom: 'Gardien', desc: 'Réussir le défi de sécurité' },
  { id: 'serie3', e: '🔥', nom: 'En feu', desc: "Coder 3 jours d'affilée" },
];
const aujourdhui = () => new Date().toISOString().slice(0, 10);
function serie() {
  const j = new Set(P.jours); let n = 0; const d = new Date();
  while (j.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function marquerJour() { const a = aujourdhui(); if (!P.jours.includes(a)) { P.jours.push(a); P.jours = P.jours.slice(-60); } if (serie() >= 3) gagner('serie3'); }
function gagner(id) {
  if (P.badges.includes(id)) return;
  P.badges.push(id); sauver(); majBarre();
  const b = BADGES.find(x => x.id === id); toast(`${b.e} Badge débloqué : ${b.nom} !`);
}
function ajouterXP(n) { P.xp += n; sauver(); majBarre(); }
function majBarre() {
  const niv = Math.floor(P.xp / 100); const dans = P.xp % 100;
  $('niveau').textContent = `Niv. ${niv + 1} · ${NIVEAUX[Math.min(niv, NIVEAUX.length - 1)]}`;
  $('xpBarre').style.width = dans + '%'; $('xpTexte').textContent = `${P.xp} XP`;
  $('serie').textContent = `🔥 ${serie()}`; $('nbBadges').textContent = P.badges.length;
}
function demander(question, oui = 'Oui') {
  return new Promise(ok => {
    const d = $('dlgConfirm'); $('dlgQuestion').textContent = question; $('dlgOui').textContent = oui;
    const fin = (v) => { d.close(); $('dlgOui').onclick = $('dlgNon').onclick = null; ok(v); };
    $('dlgOui').onclick = () => fin(true); $('dlgNon').onclick = () => fin(false); d.showModal();
  });
}
function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }

/* ------------------------------------------------------------------ moteur Python dans un worker */
let worker, pretPython, nId = 0; const attentes = new Map();
function demarrer() {
  worker = new Worker('worker.js');
  pretPython = new Promise((ok, ko) => {
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'pret') { ok(); etat('Python prêt ✔'); }
      else if (m.type === 'echec') { ko(m.message); etat('Python n\'a pas pu démarrer (connexion ?)'); }
      else if (m.type === 'resultat') { const a = attentes.get(m.id); if (a) { attentes.delete(m.id); clearTimeout(a.t); m.erreurInterne ? a.ko(m.erreurInterne) : a.ok(m.data); } }
    };
  });
}
function appeler(action, args, delai = 6000) {
  return pretPython.then(() => new Promise((ok, ko) => {
    const id = ++nId;
    const t = setTimeout(() => {
      attentes.delete(id); worker.terminate(); etat('Redémarrage de Python…'); demarrer();
      ko({ delai: true });
    }, delai);
    attentes.set(id, { ok, ko, t });
    worker.postMessage({ id, action, args });
  }));
}
const etat = (t) => { $('etat').textContent = t; };

/* ------------------------------------------------------------------ éditeur et auto-complétion */
const MOTS = ['False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'];
const INTEGREES = { print: 'affiche des valeurs', len: 'nombre d\'éléments', range: 'suite de nombres : range(début, fin, pas)', input: 'lit une ligne saisie', int: 'convertit en entier', float: 'convertit en nombre à virgule', str: 'convertit en texte', list: 'crée une liste', dict: 'crée un dictionnaire', set: 'crée un ensemble', tuple: 'crée un n-uplet', sorted: 'copie triée', sum: 'somme', min: 'plus petit', max: 'plus grand', abs: 'valeur absolue', round: 'arrondi', enumerate: 'paires (indice, élément)', zip: 'parcourt plusieurs listes ensemble', map: 'applique une fonction', filter: 'garde les éléments qui passent un test', isinstance: 'vérifie un type', type: 'type d\'une valeur', reversed: 'parcours à l\'envers', any: 'au moins un vrai ?', all: 'tous vrais ?', bool: 'convertit en booléen', ord: 'code d\'un caractère', chr: 'caractère d\'un code' };
const EXTRAITS = [
  { t: 'for', aff: 'for … in range(…):', code: 'for i in range(10):\n    ' },
  { t: 'for', aff: 'for … in liste:', code: 'for element in liste:\n    ' },
  { t: 'def', aff: 'def fonction(…):', code: 'def ma_fonction(parametre):\n    return parametre' },
  { t: 'if', aff: 'if … else', code: 'if condition:\n    pass\nelse:\n    pass' },
  { t: 'while', aff: 'while …:', code: 'while condition:\n    ' },
  { t: 'try', aff: 'try / except', code: 'try:\n    pass\nexcept ValueError:\n    pass' },
];
function rendre(el, self, d) {
  el.innerHTML = `${esc(d.displayText || d.text)}<span class="hint-genre">${esc(d.genre || '')}</span>`;
  if (d.doc) el.title = d.doc;
}
function completer(cm, callback) {
  const cur = cm.getCursor(); const ligne = cm.getLine(cur.line).slice(0, cur.ch);
  const pt = ligne.match(/([A-Za-z_][\w.]*)\.(\w*)$/);
  if (pt) {
    const from = CodeMirror.Pos(cur.line, cur.ch - pt[2].length);
    appeler('completer', [pt[1], pt[2]], 2500).then(liste => {
      if (!liste.length) return callback(null);
      callback({ list: liste.map(p => ({ text: p.texte + (p.genre === 'méthode' ? '()' : ''), displayText: p.texte, genre: p.genre, doc: p.doc, render: rendre })), from, to: cur });
    }).catch(() => callback(null));
    return;
  }
  const m = ligne.match(/[A-Za-z_]\w*$/); if (!m) return callback(null);
  const pre = m[0]; const from = CodeMirror.Pos(cur.line, cur.ch - pre.length);
  const vus = new Set(); const liste = [];
  const ajout = (o) => { const k = o.displayText || o.text; if (vus.has(k) || o.text === pre) return; vus.add(k); liste.push(o); };
  EXTRAITS.filter(x => x.t.startsWith(pre)).forEach(x => ajout({ text: x.code, displayText: x.aff, genre: 'modèle', render: rendre }));
  const idents = new Set((cm.getValue().match(/[A-Za-z_]\w*/g) || []));
  [...idents].filter(x => x.startsWith(pre) && x !== pre && !MOTS.includes(x)).sort().forEach(x => ajout({ text: x, genre: 'ton code', render: rendre }));
  Object.keys(INTEGREES).filter(x => x.startsWith(pre)).forEach(x => ajout({ text: x, genre: 'fonction', doc: INTEGREES[x], render: rendre }));
  MOTS.filter(x => x.startsWith(pre)).forEach(x => ajout({ text: x, genre: 'mot-clé', render: rendre }));
  callback(liste.length ? { list: liste.slice(0, 40), from, to: cur } : null);
}
completer.async = true;

const cm = CodeMirror.fromTextArea($('code'), {
  mode: 'python', theme: 'material-darker', lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
  autoCloseBrackets: true, matchBrackets: true, styleActiveLine: true, lineWrapping: false,
  extraKeys: {
    'Tab': (c) => c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    '),
    'Shift-Tab': (c) => c.indentSelection('subtract'),
    'Ctrl-Enter': () => executer(), 'Cmd-Enter': () => executer(),
    'Ctrl-Space': (c) => c.showHint({ hint: completer, completeSingle: false }),
    'Ctrl-/': 'toggleComment', 'Cmd-/': 'toggleComment',
  },
});
cm.on('inputRead', (c, ch) => {
  if (ch.origin !== '+input') return;
  const t = ch.text.join('');
  const avant = c.getLine(c.getCursor().line).slice(0, c.getCursor().ch);
  if (t === '.' || (/\w/.test(t) && /[A-Za-z_]\w$/.test(avant))) c.showHint({ hint: completer, completeSingle: false });
});
let lignesMarquees = [];
function marquer(ligne, classe) { if (ligne == null) return; const h = cm.addLineClass(ligne - 1, 'background', classe); lignesMarquees.push({ h, classe }); }
function effacerMarques() { lignesMarquees.forEach(({ h, classe }) => cm.removeLineClass(h, 'background', classe)); lignesMarquees = []; }
cm.on('change', () => { effacerMarques(); if (courant) { P.brouillons[courant.id || 'sable'] = cm.getValue(); sauverBrouillon(); } });
let tBrouillon; const sauverBrouillon = () => { clearTimeout(tBrouillon); tBrouillon = setTimeout(sauver, 600); };

/* ------------------------------------------------------------------ Kodi */
function kodi(texte, perso = 'kodi') {
  $('bulle').innerHTML = md(texte);
  const img = $('kodi').querySelector('img'); img.src = `../10-Assets/personnages/${perso}.svg`; img.alt = perso;
}

/* ------------------------------------------------------------------ panneaux */
document.querySelectorAll('[data-panneau]').forEach(b => b.onclick = () => panneau(b.dataset.panneau));
function panneau(nom) {
  document.querySelectorAll('[data-panneau]').forEach(b => b.classList.toggle('actif', b.dataset.panneau === nom));
  ['console', 'tests', 'pas', 'vars'].forEach(p => $('p-' + p).classList.toggle('cache', p !== nom));
}
document.querySelectorAll('[data-vue]').forEach(b => b.onclick = () => {
  document.querySelectorAll('[data-vue]').forEach(x => x.classList.toggle('actif', x === b));
  ['defis', 'guide', 'sable'].forEach(v => $('vue-' + v).classList.toggle('cache', v !== b.dataset.vue));
});

/* ------------------------------------------------------------------ liste des défis et guide */
function etoiles(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
function listeDefis() {
  const v = $('vue-defis'); v.innerHTML = '';
  const fait = Object.keys(P.faits).length;
  v.insertAdjacentHTML('beforeend', `<p class="vide">${fait} / ${DEFIS.length} défis réussis</p>`);
  let mod = null;
  DEFIS.forEach(d => {
    if (d.module !== mod) { mod = d.module; v.insertAdjacentHTML('beforeend', `<div class="module">${d.module} · ${esc(MODULES[d.module] || '')}</div>`); }
    const b = document.createElement('button');
    b.className = 'item-defi' + (P.faits[d.id] ? ' fait' : '') + (courant && courant.id === d.id ? ' actif' : '');
    b.innerHTML = `<span class="statut">${P.faits[d.id] ? '✓' : ''}</span><span class="t">${esc(d.titre)}<br><span class="etoiles">${etoiles(d.niveau)}</span></span><span class="x">+${d.xp} XP</span>`;
    b.onclick = () => ouvrir(d); v.appendChild(b);
  });
}
function guide() {
  const v = $('vue-guide'); v.className = 'vue guide' + ($('vue-guide').classList.contains('cache') ? ' cache' : '');
  v.innerHTML = '<p>Les bases de Python en fiches. « Essayer » ouvre l\'exemple dans le bac à sable.</p>';
  (window.GUIDE || []).forEach(g => {
    const s = document.createElement('div');
    s.innerHTML = `<h3>${esc(g.titre)}</h3><p>${md(g.texte)}</p><pre>${esc(g.code)}</pre>`;
    const b = document.createElement('button'); b.className = 'btn petit'; b.textContent = 'Essayer ▶';
    b.onclick = () => { ouvrirSable(g.code); executer(); }; s.appendChild(b); v.appendChild(s);
  });
}

/* ------------------------------------------------------------------ ouvrir un défi / le bac à sable */
let courant = null; let indicesMontres = 0;
function ouvrir(d) {
  courant = d; indicesMontres = P.indices[d.id] || 0;
  const perso = PERSOS[DEFIS.indexOf(d) % 4];
  $('carteDefi').innerHTML = `<div class="meta">${d.module} · ${esc(MODULES[d.module] || '')} · ${etoiles(d.niveau)} · +${d.xp} XP${P.faits[d.id] ? ' · ✓ réussi' : ''}</div>
    <h1>${esc(d.titre)}</h1>
    <div class="histoire"><img src="../10-Assets/personnages/${perso}.svg" alt="${perso}"><div>${md(d.histoire)}</div></div>
    <div class="consigne">🎯 ${md(d.consigne)}</div>
    <div id="indicesVus"></div>
    <p class="vide" style="margin:8px 0 0">📖 Pour réviser : <a href="${esc(d.lienMission)}" target="_blank" rel="noopener">la mission du cours</a></p>`;
  cm.setValue(P.brouillons[d.id] || d.depart); cm.clearHistory(); cm.focus();
  ['btnVerifier', 'btnIndice'].forEach(b => $(b).classList.remove('cache'));
  majIndices(); $('tests').innerHTML = '<p class="vide">Clique sur « Vérifier » pour lancer les tests du défi.</p>';
  listeDefis(); kodi(d.mode === 'mutants' ? 'Ici, c\'est toi qui écris les tests ! Chaque mutant est une version buguée de la fonction : un bon test la fait échouer.' : 'Lis la consigne, écris ton code, puis « Exécuter » pour essayer et « Vérifier » pour lancer les tests.', perso);
  history.replaceState(null, '', '#' + d.id);
}
function ouvrirSable(code) {
  courant = { id: 'sable' };
  $('carteDefi').innerHTML = '<div class="meta">BAC À SABLE</div><h1>Code librement</h1><p class="vide">Pas de consigne, pas de correction. Astuce : après une exécution, tape le nom d\'une variable suivi d\'un point pour voir ce qu\'elle sait faire.</p>';
  cm.setValue(code || P.brouillons.sable || '# Écris ton code ici, puis Ctrl + Entrée\nprint("Bonjour HashBox !")\n'); cm.focus();
  ['btnVerifier', 'btnIndice', 'btnSolution'].forEach(b => $(b).classList.add('cache'));
  listeDefis(); history.replaceState(null, '', '#sable');
}
$('ouvrirSable').onclick = () => ouvrirSable();

function majIndices() {
  const d = courant; if (!d || !d.indices) return;
  $('btnIndice').textContent = indicesMontres >= 3 ? '💡 Indices (3/3)' : `💡 Indice ${indicesMontres + 1}/3`;
  $('btnIndice').disabled = indicesMontres >= 3;
  $('indicesVus').innerHTML = d.indices.slice(0, indicesMontres).map((h, i) => `<div class="consigne" style="margin-top:6px">💡 <b>Indice ${i + 1}</b> — ${md(h)}</div>`).join('');
  $('btnSolution').classList.toggle('cache', indicesMontres < 3);
}
$('btnIndice').onclick = () => {
  if (!courant || indicesMontres >= 3) return;
  indicesMontres++; P.indices[courant.id] = indicesMontres; sauver(); majIndices();
  kodi(indicesMontres < 3 ? 'Un indice, pas la réponse : essaie de l\'appliquer avant d\'en demander un autre.' : 'Dernier indice ! La solution est disponible si tu bloques vraiment… mais essaie encore une fois.');
};
$('btnSolution').onclick = async () => {
  if (!courant.solution) return;
  if (!await demander('Afficher la solution ? Tu gagneras moins d\'XP pour ce défi.', 'Afficher')) return;
  cm.setValue(courant.solution); P.indices[courant.id] = 4; sauver();
  kodi('Lis la solution ligne par ligne, puis lance « Pas à pas » pour bien la comprendre. Ensuite, essaie de la réécrire de mémoire !');
};
$('btnReset').onclick = async () => {
  if (!courant) return;
  if (!await demander('Revenir au code de départ ? Ton code actuel sera perdu.', 'Revenir au départ')) return;
  const code = courant.depart || ''; delete P.brouillons[courant.id]; cm.setValue(code); sauver();
};

/* ------------------------------------------------------------------ exécuter */
const entrees = () => JSON.stringify($('entrees').value ? $('entrees').value.split('\n') : []);
function occuper(b) { ['btnExecuter', 'btnPas', 'btnVerifier'].forEach(x => $(x).disabled = b); }
function afficherErreur(err, cible = $('erreur')) {
  if (!err) { cible.innerHTML = ''; return; }
  marquer(err.ligne, 'ligne-erreur');
  cible.innerHTML = `<div class="carte-erreur"><b>${esc(err.titre)}</b>${err.ligne ? ` <span class="vide">(ligne ${err.ligne})</span>` : ''}
    <div class="conseil">💡 ${esc(err.conseil)}</div><div class="tech mono">${esc(err.type)} : ${esc(err.message)}</div></div>`;
  kodi(`Pas de panique ! ${err.titre} ${err.ligne ? `Regarde la ligne ${err.ligne}.` : ''}`);
}
function tableVars(vars, prec) {
  if (!vars || !vars.length) return '<p class="vide">Aucune variable.</p>';
  const avant = new Map((prec || []).map(v => [v.nom, v.valeur]));
  return `<table class="vars"><tr><th>Nom</th><th>Type</th><th>Valeur</th></tr>${vars.map(v => `<tr class="${prec && avant.get(v.nom) !== v.valeur ? 'change' : ''}"><td class="mono">${esc(v.nom)}</td><td>${esc(v.type)}</td><td class="v">${esc(v.valeur)}</td></tr>`).join('')}</table>`;
}
function messageDelai() {
  return { titre: 'Ton programme tourne depuis trop longtemps.', conseil: 'Une boucle while qui ne s\'arrête jamais ? Ou un algorithme trop lent pour cette quantité de données. Python a été redémarré.', type: 'Délai dépassé', message: 'arrêt automatique', ligne: null };
}
async function executer() {
  occuper(true); effacerMarques(); panneau('console'); $('sortie').textContent = ''; $('erreur').innerHTML = ''; etat('Exécution…');
  try {
    const r = await appeler('executer', [cm.getValue(), entrees()]);
    $('sortie').textContent = r.sortie || (r.ok ? '(rien n\'a été affiché : utilise print() pour voir un résultat)' : '');
    afficherErreur(r.erreur); $('vars').innerHTML = tableVars(r.variables);
    P.stats.exec++; marquerJour(); gagner('premier_pas'); sauver();
    if (r.ok) { etat('Terminé ✔'); if (!courant || courant.id === 'sable') kodi('Bien joué ! Regarde l\'onglet « Variables » pour voir ce que ton programme a créé.'); }
    else etat('Erreur');
  } catch (e) { afficherErreur(e && e.delai ? messageDelai() : { titre: 'Erreur interne du playground', conseil: String(e), type: '', message: '', ligne: null }); etat('Arrêté'); }
  occuper(false);
}
$('btnExecuter').onclick = executer;

/* ------------------------------------------------------------------ pas à pas */
let etapes = [], pos = 0, lecture = null;
async function pasAPas() {
  occuper(true); effacerMarques(); panneau('pas'); etat('Enregistrement des étapes…');
  try {
    const r = await appeler('tracer', [cm.getValue(), entrees()], 8000);
    etapes = r.etapes; pos = 0; $('pasCurseur').max = Math.max(0, etapes.length - 1);
    P.stats.pas++; gagner('detective'); marquerJour(); sauver();
    if (!etapes.length) { $('pasInfo').innerHTML = '<span class="vide">Aucune étape : le code est vide ou contient une erreur de syntaxe.</span>'; }
    afficherEtape();
    if (r.erreur) { afficherErreur(r.erreur, $('pasVars')); }
    etat(r.tronque ? `${etapes.length} étapes (limite atteinte)` : `${etapes.length} étapes`);
    kodi('Avance étape par étape avec ▶. La ligne surlignée en vert est celle qui va s\'exécuter ; les variables qui changent sont mises en valeur.');
  } catch (e) { afficherErreur(e && e.delai ? messageDelai() : null, $('pasVars')); etat('Arrêté'); }
  occuper(false);
}
function afficherEtape() {
  effacerMarques(); if (!etapes.length) return;
  const e = etapes[pos], prec = pos > 0 ? etapes[pos - 1] : null;
  marquer(e.ligne, 'ligne-courante'); cm.scrollIntoView({ line: e.ligne - 1, ch: 0 }, 80);
  $('pasCurseur').value = pos;
  $('pasInfo').innerHTML = `Étape <b>${pos + 1}</b> / ${etapes.length} · ligne <b>${e.ligne}</b> · dans <b>${esc(e.fonction)}</b>${e.retour !== undefined ? ` · renvoie <code class="mono">${esc(e.retour)}</code>` : ''}`;
  $('pasVars').innerHTML = tableVars(e.variables, prec && prec.fonction === e.fonction ? prec.variables : null);
  $('pasSortie').textContent = e.sortie || '';
}
const aller = (n) => { if (!etapes.length) return; pos = Math.max(0, Math.min(etapes.length - 1, n)); afficherEtape(); };
$('btnPas').onclick = pasAPas;
$('pasDebut').onclick = () => aller(0); $('pasFin').onclick = () => aller(etapes.length - 1);
$('pasPrec').onclick = () => aller(pos - 1); $('pasSuiv').onclick = () => aller(pos + 1);
$('pasCurseur').oninput = (e) => aller(+e.target.value);
$('pasLecture').onclick = () => {
  if (lecture) { clearInterval(lecture); lecture = null; $('pasLecture').textContent = '⏵'; return; }
  $('pasLecture').textContent = '⏸';
  lecture = setInterval(() => { if (pos >= etapes.length - 1) { clearInterval(lecture); lecture = null; $('pasLecture').textContent = '⏵'; return; } aller(pos + 1); }, 550);
};

/* ------------------------------------------------------------------ vérifier un défi */
async function verifier() {
  const d = courant; if (!d || !d.tests) return;
  occuper(true); effacerMarques(); panneau('tests'); $('tests').innerHTML = '<p class="vide">Tests en cours…</p>'; etat('Vérification…');
  const opts = d.mode === 'mutants' ? { mode: 'mutants', reference: d.reference, mutants: d.mutants } : {};
  try {
    const r = await appeler('tester', [cm.getValue(), JSON.stringify(d.tests), JSON.stringify(opts)], (d.delai || 6) * 1000);
    marquerJour();
    let h = '';
    if (r.erreur) { h += '<div id="errTests"></div>'; }
    const nOk = r.resultats.filter(x => x.ok).length;
    h = `<div class="bilan ${r.ok ? 'ok' : ''}">${r.ok ? '🎉 Défi réussi !' : `${nOk} / ${r.resultats.length || '?'} tests réussis`}</div>` + h;
    h += r.resultats.map(t => `<div class="test"><span class="i">${t.ok ? '✅' : '❌'}</span><div><div>${esc(t.nom)}</div>${t.detail ? `<div class="d">${esc(t.detail)}</div>` : ''}</div></div>`).join('');
    $('tests').innerHTML = h;
    if (r.erreur) afficherErreur(r.erreur, $('errTests'));
    if (r.ok) reussite(d); else { etat('Pas encore…'); if (!r.erreur) kodi(`Presque ! ${nOk} test(s) sur ${r.resultats.length} passent. Lis le premier test qui échoue : il te dit ce qui est attendu.`); }
  } catch (e) {
    $('tests').innerHTML = '';
    afficherErreur(e && e.delai ? { titre: 'Ta solution est trop lente (ou ne s\'arrête pas).', conseil: d.id === 'deux_sommes' || d.id === 'doublons' ? 'Le test sur une grande quantité de données a dépassé le temps limite : cherche une approche plus efficace (un ensemble ?).' : 'Vérifie que tes boucles se terminent.', type: 'Délai dépassé', message: 'arrêt automatique', ligne: null } : null, $('tests'));
    etat('Arrêté');
  }
  occuper(false);
}
$('btnVerifier').onclick = verifier;
function reussite(d) {
  etat('Réussi ✔'); confettis();
  const deja = !!P.faits[d.id];
  if (!deja) {
    const ind = P.indices[d.id] || 0;
    const gain = ind >= 4 ? Math.round(d.xp / 4) : Math.round(d.xp * (1 - 0.15 * ind));
    P.faits[d.id] = { date: aujourdhui(), indices: ind }; ajouterXP(gain);
    toast(`+${gain} XP`);
    gagner('premier_defi');
    if (ind === 0) gagner('sans_indice');
    const n = Object.keys(P.faits).length;
    if (n >= 5) gagner('cinq'); if (n >= 10) gagner('dix'); if (n >= DEFIS.length) gagner('tous');
    if (d.id === 'deux_sommes' || d.id === 'doublons') gagner('rapide');
    if (d.mode === 'mutants') gagner('chasseur');
    if (d.module === 'HEF-100') gagner('gardien');
    kodi(`Bravo ! Tu gagnes ${gain} XP${ind ? ` (${ind >= 4 ? 'solution affichée' : ind + ' indice(s) utilisé(s)'})` : ' — sans aucun indice, chapeau !'}. On enchaîne avec le défi suivant ?`);
  } else kodi('Toujours réussi ! Tu peux essayer une version plus courte ou plus rapide de ta solution.');
  sauver(); listeDefis();
}

/* ------------------------------------------------------------------ badges, confettis */
$('btnBadges').onclick = () => {
  $('listeBadges').innerHTML = BADGES.map(b => `<div class="badge ${P.badges.includes(b.id) ? 'gagne' : ''}"><span class="e">${b.e}</span><div><b>${esc(b.nom)}</b><small>${esc(b.desc)}</small></div></div>`).join('');
  $('dlgBadges').showModal();
};
function confettis() {
  const c = $('confettis'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#cffa2d', '#ffffff', '#6aa3ff', '#ffb54d', '#ff6b6b'];
  const parts = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 3, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
  let t = 0;
  (function f() {
    x.clearRect(0, 0, c.width, c.height);
    parts.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.a += .2; x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6); x.restore(); });
    if (++t < 110) requestAnimationFrame(f); else x.clearRect(0, 0, c.width, c.height);
  })();
}

/* ------------------------------------------------------------------ démarrage */
demarrer(); majBarre(); guide(); listeDefis();
const h = location.hash.slice(1);
const d0 = DEFIS.find(x => x.id === h);
if (h === 'sable') ouvrirSable(); else ouvrir(d0 || DEFIS.find(x => !P.faits[x.id]) || DEFIS[0]);
addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id === 'sable') ouvrirSable(); else { const d = DEFIS.find(x => x.id === id); if (d && (!courant || courant.id !== id)) ouvrir(d); } });
window.__playground = { appeler, cm, P };   // pour les tests automatisés
})();
