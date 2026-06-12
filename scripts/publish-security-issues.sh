#!/usr/bin/env bash

# Script pour automatiser la création des issues de sécurité sur GitHub via la CLI 'gh'

echo "🚀 Démarrage du déploiement des issues de sécurité..."

# Vérification de l'installation de gh
if ! command -v gh &> /dev/null
then
    echo "❌ Erreur : La CLI GitHub 'gh' n'est pas installée."
    exit 1
fi

# Création des Milestones
echo "📅 Création des Milestones..."
gh milestone create --title "[SEC-M1] HARDENING CRITIQUE" --description "Remédiation des failles critiques mettant en péril l'accès global et les données sensibles."
gh milestone create --title "[SEC-M2] INTÉGRITÉ MÉTIER" --description "Amélioration de la logique métier et protection de la confidentialité des escouades."
gh milestone create --title "[SEC-M3] INFRA ET CONFORMITÉ" --description "Alignement sur les standards de sécurité et durcissement infrastructurel."

# Milestone 1 Issues
echo "🔧 Création des issues pour M1..."
gh issue create --title "[CRITIQUE] Réactivation du Middleware de Sécurité" \
    --body "Le middleware est actuellement inactif (nommé proxy.ts). Renommer en middleware.ts pour activer la protection globale." \
    --label "security,bug,priority:critical" \
    --milestone "[SEC-M1] HARDENING CRITIQUE"

gh issue create --title "[CRITIQUE] Colmatage de la fuite de secrets MFA/2FA" \
    --body "Les API de profil renvoient les champs twoFactorSecret. Utiliser une projection Prisma stricte pour filtrer la réponse JSON." \
    --label "security,bug,priority:critical" \
    --milestone "[SEC-M1] HARDENING CRITIQUE"

# Milestone 2 Issues
echo "🔧 Création des issues pour M2..."
gh issue create --title "[ÉLEVÉ] Protection des Escouades Privées" \
    --body "L'endpoint /api/squad/join ne vérifie pas isPrivate. Ajouter un contrôle d'accès strict." \
    --label "security,bug,priority:high" \
    --milestone "[SEC-M2] INTÉGRITÉ MÉTIER"

gh issue create --title "[ÉLEVÉ] Fix de la fraude à l'XP de revue" \
    --body "L'XP est accordée même en cas de rejet. Accorder l'XP uniquement si status == APPROVED." \
    --label "security,bug,priority:high" \
    --milestone "[SEC-M2] INTÉGRITÉ MÉTIER"

gh issue create --title "[MOYEN] Sécurisation contre l'injection XSS" \
    --body "Valider les liens de soumission avec Zod et sanitizer le rendu HTML." \
    --label "security,bug" \
    --milestone "[SEC-M2] INTÉGRITÉ MÉTIER"

# Milestone 3 Issues
echo "🔧 Création des issues pour M3..."
gh issue create --title "[MOYEN] Élimination de l'énumération utilisateur" \
    --body "Réduire les champs renvoyés par l'API admin/users au strict nécessaire." \
    --label "security,improvement" \
    --milestone "[SEC-M3] INFRA ET CONFORMITÉ"

echo "✅ Déploiement terminé. Vérifiez votre onglet Issues sur GitHub."
