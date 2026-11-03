// Worker : exécute Python (Pyodide) hors du fil principal, pour qu'une boucle infinie ne fige jamais la page.
const PYODIDE = self.PYODIDE_BASE || 'https://cdn.jsdelivr.net/npm/pyodide@0.26.4/';
importScripts(PYODIDE + 'pyodide.js');
let py = null;
const pret = (async () => {
  py = await loadPyodide({ indexURL: PYODIDE });
  const src = await (await fetch('runtime.py')).text();
  py.runPython(src);
  postMessage({ type: 'pret' });
})().catch(e => postMessage({ type: 'echec', message: String(e) }));

onmessage = async (e) => {
  await pret;
  const { id, action, args } = e.data;
  try {
    const f = py.globals.get(action);
    const r = f(...args);
    f.destroy && f.destroy();
    postMessage({ type: 'resultat', id, data: JSON.parse(r) });
  } catch (err) {
    postMessage({ type: 'resultat', id, erreurInterne: String(err) });
  }
};
