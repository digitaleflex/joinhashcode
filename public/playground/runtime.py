"""Moteur Python du playground HashCode (exécuté dans Pyodide, dans un worker)."""
import builtins, io, json, keyword, sys, traceback, types, contextlib

FICHIER = "<ton code>"
NS = {"__name__": "__main__"}          # espace de noms conservé pour l'auto-complétion
MAX_ETAPES = 2000
MAX_SORTIE = 20000


# ---------------------------------------------------------------- entrées / sorties
class _Entrees:
    def __init__(self, lignes):
        self.lignes = list(lignes)
    def __call__(self, invite=""):
        print(invite, end="")
        if not self.lignes:
            raise EOFError("input() n'a plus de données : ajoute une ligne dans « Entrées ».")
        v = self.lignes.pop(0)
        print(v)
        return v


class _Sortie(io.StringIO):
    def write(self, s):
        if self.tell() > MAX_SORTIE:
            raise RuntimeError("Trop de texte affiché (plus de 20 000 caractères) : une boucle qui affiche sans fin ?")
        return super().write(s)


# ---------------------------------------------------------------- erreurs en français
def _ligne_de(exc):
    if isinstance(exc, SyntaxError) and exc.filename == FICHIER:
        return exc.lineno
    tb = exc.__traceback__
    ligne = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == FICHIER:
            ligne = tb.tb_lineno
        tb = tb.tb_next
    return ligne


def expliquer(exc):
    t = type(exc).__name__
    msg = str(exc)
    conseils = {
        "NameError": ("Python ne connaît pas ce nom.", "Vérifie l'orthographe (majuscules comprises) et que la variable est définie AVANT d'être utilisée."),
        "SyntaxError": ("Python ne comprend pas la phrase : la grammaire du code est incorrecte.", "Cherche un « : » oublié après if/for/def, une parenthèse ou un guillemet non fermé."),
        "IndentationError": ("Le décalage des lignes (l'indentation) est incorrect.", "Après une ligne qui finit par « : », les lignes du bloc doivent être décalées de 4 espaces, toutes pareil."),
        "TabError": ("Tabulations et espaces mélangés.", "Utilise uniquement des espaces (la touche Tab de l'éditeur en met 4)."),
        "TypeError": ("Une opération reçoit une valeur du mauvais type.", "Par exemple « 3 » + 4 : convertis avec int() ou str(). Vérifie aussi le nombre d'arguments d'une fonction."),
        "ZeroDivisionError": ("Division par zéro.", "Avant de diviser, vérifie que le diviseur n'est pas 0 (une liste vide ?)."),
        "IndexError": ("Tu demandes une case qui n'existe pas dans la liste.", "Les indices vont de 0 à len(liste) - 1. Une liste vide n'a aucune case."),
        "KeyError": ("Cette clé n'existe pas dans le dictionnaire.", "Utilise « cle in dico » pour vérifier, ou dico.get(cle, valeur_par_defaut)."),
        "AttributeError": ("Cet objet n'a pas cette méthode ou cet attribut.", "Vérifie le type de l'objet : une liste n'a pas les mêmes méthodes qu'un texte. Astuce : tape « objet. » pour voir les propositions."),
        "ValueError": ("Le type est bon mais la valeur ne convient pas.", "Par exemple int(\"abc\") : le texte ne représente pas un nombre."),
        "RecursionError": ("La fonction s'appelle elle-même sans jamais s'arrêter.", "Vérifie le cas de base de ta fonction récursive : il doit être atteint à chaque appel."),
        "EOFError": ("input() attend une donnée qui n'existe pas.", "Ajoute une ligne par appel à input() dans le champ « Entrées »."),
        "AssertionError": ("Une vérification (assert) a échoué.", "La valeur obtenue n'est pas celle attendue : relis la consigne et teste ta fonction à la main."),
        "UnboundLocalError": ("Une variable locale est utilisée avant d'avoir reçu une valeur.", "Dans une fonction, donne une valeur à la variable avant de la lire, ou passe-la en paramètre."),
        "ModuleNotFoundError": ("Ce module n'est pas disponible ici.", "Le playground propose la bibliothèque standard de Python (math, random, collections…)."),
    }
    titre, conseil = conseils.get(t, ("Ton programme s'est arrêté sur une erreur.", "Lis le message, regarde la ligne indiquée, et teste une petite partie du code."))
    return {"type": t, "message": msg, "ligne": _ligne_de(exc), "titre": titre, "conseil": conseil}


# ---------------------------------------------------------------- aperçu des variables
def _apercu(v, prof=0):
    try:
        if isinstance(v, (int, float, bool, type(None))):
            return repr(v)
        if isinstance(v, str):
            return repr(v if len(v) <= 60 else v[:57] + "…")
        if isinstance(v, (list, tuple, set, frozenset)) and prof < 2:
            elems = list(v)[:12]
            corps = ", ".join(_apercu(e, prof + 1) for e in elems) + (", …" if len(v) > 12 else "")
            o, f = {list: "[]", tuple: "()", set: "{}", frozenset: "{}"}[type(v)]
            return f"{o}{corps}{f}"
        if isinstance(v, dict) and prof < 2:
            items = list(v.items())[:10]
            return "{" + ", ".join(f"{_apercu(k, 2)}: {_apercu(x, prof + 1)}" for k, x in items) + (", …" if len(v) > 10 else "") + "}"
        if isinstance(v, types.FunctionType):
            return f"fonction {v.__name__}()"
        r = repr(v)
        return r if len(r) <= 80 else r[:77] + "…"
    except Exception:
        return "<?>"


def _variables(ns):
    out = []
    for k, v in ns.items():
        if k.startswith("__") or isinstance(v, types.ModuleType) or k in ("input",):
            continue
        out.append({"nom": k, "type": type(v).__name__, "valeur": _apercu(v)})
    return out


def _nouvel_espace(entrees):
    ns = {"__name__": "__main__", "input": _Entrees(entrees)}
    return ns


# ---------------------------------------------------------------- exécuter
def executer(code, entrees_json="[]"):
    global NS
    ns = _nouvel_espace(json.loads(entrees_json))
    sortie = _Sortie()
    res = {"ok": True, "sortie": "", "erreur": None, "variables": []}
    try:
        compile_ = compile(code, FICHIER, "exec")
        with contextlib.redirect_stdout(sortie), contextlib.redirect_stderr(sortie):
            exec(compile_, ns)
    except BaseException as e:  # noqa
        res["ok"] = False
        res["erreur"] = expliquer(e)
    res["sortie"] = sortie.getvalue()
    res["variables"] = _variables(ns)
    NS = ns
    return json.dumps(res)


# ---------------------------------------------------------------- pas à pas
class _Stop(Exception):
    pass


def tracer(code, entrees_json="[]"):
    ns = _nouvel_espace(json.loads(entrees_json))
    sortie = _Sortie()
    etapes = []
    res = {"ok": True, "etapes": etapes, "erreur": None, "tronque": False}

    def trace(frame, event, arg):
        if frame.f_code.co_filename != FICHIER:
            return trace
        if event in ("line", "return"):
            if len(etapes) >= MAX_ETAPES:
                res["tronque"] = True
                raise _Stop()
            loc = frame.f_locals
            fonction = frame.f_code.co_name
            vars_ = _variables(loc) if fonction != "<module>" else _variables(ns)
            etape = {"ligne": frame.f_lineno, "fonction": "programme principal" if fonction == "<module>" else fonction + "()",
                     "variables": vars_, "sortie": sortie.getvalue(), "evenement": event}
            if event == "return" and fonction != "<module>":
                etape["retour"] = _apercu(arg)
            etapes.append(etape)
        return trace

    try:
        c = compile(code, FICHIER, "exec")
        with contextlib.redirect_stdout(sortie), contextlib.redirect_stderr(sortie):
            sys.settrace(trace)
            try:
                exec(c, ns)
            finally:
                sys.settrace(None)
    except _Stop:
        pass
    except BaseException as e:  # noqa
        res["ok"] = False
        res["erreur"] = expliquer(e)
    res["sortieFinale"] = sortie.getvalue()
    return json.dumps(res)


# ---------------------------------------------------------------- tests des défis
def tester(code, tests_json, options_json="{}"):
    tests = json.loads(tests_json)
    opts = json.loads(options_json)
    resultats = []
    sortie = _Sortie()
    res = {"ok": True, "resultats": resultats, "erreur": None, "sortie": ""}

    def charger(impl, user):
        ns = _nouvel_espace(opts.get("entrees", []))
        ns["__source__"] = user
        with contextlib.redirect_stdout(sortie):
            if impl:
                exec(compile(impl, "<référence>", "exec"), ns)
            exec(compile(user, FICHIER, "exec"), ns)
        return ns

    # Mode « chasse aux mutants » : le code de l'apprenant contient des tests
    if opts.get("mode") == "mutants":
        try:
            ns = charger(opts["reference"], code)
        except BaseException as e:  # noqa
            res["ok"] = False; res["erreur"] = expliquer(e); res["sortie"] = sortie.getvalue(); return json.dumps(res)
        fonctions = [k for k, v in ns.items() if k.startswith("test") and callable(v)]
        if not fonctions:
            resultats.append({"nom": "Écris au moins une fonction test_…", "ok": False, "detail": "Exemple : def test_cas_simple(): assert ma_fonction(2) == 4"})
            res["ok"] = False; return json.dumps(res)
        def lancer(espace):
            for f in fonctions:
                with contextlib.redirect_stdout(sortie):
                    espace[f]()
        try:
            lancer(ns)
            resultats.append({"nom": f"Tes {len(fonctions)} test(s) passent sur le code correct", "ok": True})
        except BaseException as e:  # noqa
            ex = expliquer(e)
            resultats.append({"nom": "Tes tests doivent passer sur le code correct", "ok": False, "detail": f"{ex['type']} : {ex['message']}"})
        for i, mut in enumerate(opts.get("mutants", []), 1):
            try:
                espace = charger(mut["code"], code)
                lancer(espace)
                resultats.append({"nom": f"Mutant {i} : {mut['nom']}", "ok": False, "detail": "Ce mutant a survécu : aucun de tes tests ne détecte ce bug."})
            except BaseException:  # noqa
                resultats.append({"nom": f"Mutant {i} : {mut['nom']}", "ok": True, "detail": "Éliminé 💥"})
        res["ok"] = all(r["ok"] for r in resultats)
        res["sortie"] = sortie.getvalue()
        return json.dumps(res)

    try:
        ns = charger(None, code)
    except BaseException as e:  # noqa
        res["ok"] = False; res["erreur"] = expliquer(e); res["sortie"] = sortie.getvalue(); return json.dumps(res)
    for t in tests:
        try:
            with contextlib.redirect_stdout(sortie):
                exec(compile(t["code"], "<test>", "exec"), ns)
            resultats.append({"nom": t["nom"], "ok": True})
        except AssertionError as e:
            resultats.append({"nom": t["nom"], "ok": False, "detail": str(e) or t.get("indice", "Résultat différent de celui attendu.")})
        except BaseException as e:  # noqa
            ex = expliquer(e)
            resultats.append({"nom": t["nom"], "ok": False, "detail": f"{ex['type']} : {ex['message']} — {ex['titre']}"})
    res["ok"] = all(r["ok"] for r in resultats)
    res["sortie"] = sortie.getvalue()
    return json.dumps(res)


# ---------------------------------------------------------------- auto-complétion
MODULES_CONNUS = ["math", "random", "collections", "itertools", "functools", "string", "statistics", "heapq", "bisect", "re", "json", "datetime", "time", "operator"]


def completer(expression, prefixe):
    """Propositions pour « expression.prefixe » (expression = nom ou suite d'attributs, sans appel)."""
    import importlib
    props = []
    try:
        if expression:
            parties = expression.split(".")
            if not all(p.isidentifier() for p in parties):
                return json.dumps([])
            if parties[0] in NS:
                obj = NS[parties[0]]
            elif parties[0] in MODULES_CONNUS:
                obj = importlib.import_module(parties[0])
            elif parties[0] in ("str", "list", "dict", "set", "int", "float", "tuple"):
                obj = getattr(builtins, parties[0])
            else:
                return json.dumps([])
            for p in parties[1:]:
                obj = getattr(obj, p)
            for nom in dir(obj):
                if nom.startswith("_") or not nom.startswith(prefixe):
                    continue
                try:
                    v = getattr(obj, nom)
                    doc = (getattr(v, "__doc__", "") or "").strip().split("\n")[0][:90]
                    genre = "méthode" if callable(v) else "attribut"
                except Exception:
                    doc, genre = "", "attribut"
                props.append({"texte": nom, "genre": genre, "doc": doc})
        else:
            for nom, v in NS.items():
                if nom.startswith("_") or not nom.startswith(prefixe) or nom == "input":
                    continue
                props.append({"texte": nom, "genre": "variable", "doc": _apercu(v)})
    except Exception:
        pass
    return json.dumps(props[:80])
