#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# sysctl_tuning.sh — Optimisations SRE du Kernel Linux
# Applique des paramètres d'urgence pour protéger le serveur des 
# pics de trafic (TCP, Swap, Fichiers ouverts).
# À exécuter en tant que root : sudo bash scripts/sysctl_tuning.sh
# ────────────────────────────────────────────────────────────────

set -e

echo "🚀 Début de l'optimisation sysctl SRE..."

CONF_FILE="/etc/sysctl.d/99-hashcode-perf.conf"

cat <<EOF > "$CONF_FILE"
# ────────────────────────────────────────────────────────────────
# Configuration optimisée pour HASHCODE (Next.js + PostgreSQL)
# Généré par sysctl_tuning.sh
# ────────────────────────────────────────────────────────────────

# 1. Optimisations Réseau (Traefik / TCP)
# Augmente la file d'attente globale des connexions en attente
net.core.somaxconn = 65535
# Augmente le backlog des connexions TCP entrantes
net.ipv4.tcp_max_syn_backlog = 16384
# Permet de recycler rapidement les sockets TIME_WAIT
net.ipv4.tcp_tw_reuse = 1
# Temps d'attente maximum pour garder un socket ouvert s'il est abandonné
net.ipv4.tcp_fin_timeout = 15

# 2. Optimisations Mémoire (Swap / NVMe)
# Préfère tuer des processus (OOM) plutôt que d'utiliser massivement le Swap.
# Un swap massif sur NVMe fige tout le serveur.
vm.swappiness = 10
# Assure que le cache des inodels/dentries n'est pas purgé trop vite
vm.vfs_cache_pressure = 50

# 3. Limites du système
# Augmente le nombre maximal de fichiers ouverts (important pour Node.js / BD)
fs.file-max = 2097152
EOF

echo "✅ Fichier de configuration créé dans $CONF_FILE"

# Recharger la configuration kernel en direct
sysctl -p "$CONF_FILE"

echo "✅ Paramètres appliqués avec succès au noyau en direct."
echo "Pour vérifier une valeur spécifique: sysctl net.core.somaxconn"
