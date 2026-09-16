# Audit — Cross-Feature Consistency

Ne teste pas les modules isolément uniquement. Vérifie les chaînes:

Registration → Onboarding → Quiz → Profile → Mission → Submission → Review → XP → Badge → Public Profile

Mission → Submission → Notification → Review → Revision → Approval → XP

Profile → Squad → Invitation → Membership → Collaboration → Reward

Account deletion → Mission data → Activity logs → Public profile → Sessions

Cherche les bugs où un module réussit mais ses effets secondaires échouent.

Exemples:
- mission APPROVED mais XP absent
- XP présent mais mission toujours SUBMITTED
- compte banni mais API accessible
- compte supprimé mais données ré-identifiables
- badge acquis mais prérequis incohérents

Classer les incohérences par P0/P1/P2/P3.
