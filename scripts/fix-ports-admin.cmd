@echo off
REM ============================================================
REM  HashCode - libere les ports PostgreSQL/PgBouncer bloques
REM  par les plages d'exclusion Windows (Hyper-V / WSL2)
REM
REM  A EXECUTER EN TANT QU'ADMINISTRATEUR :
REM    clic droit sur ce fichier -> "Executer en tant qu'administrateur"
REM
REM  Probleme : la plage 5430-5529 est reservee par Windows, ce qui
REM  bloque 5433 (PostgreSQL) et 5435 (PgBouncer). Docker echoue avec
REM  "bind: Une tentative d'acces a un socket de maniere interdite".
REM
REM  Ce script reserve CES DEUX PORTS DE FACON PERMANENTE pour HashCode,
REM  afin qu'Hyper-V/WSL ne les reprennent plus jamais apres un reboot.
REM ============================================================

net session >nul 2>&1
if %errorLevel% neq 0 (
  echo.
  echo  ERREUR : ce script doit etre lance EN TANT QU'ADMINISTRATEUR.
  echo  Clic droit sur le fichier -^> "Executer en tant qu'administrateur"
  echo.
  pause
  exit /b 1
)

echo.
echo [1/4] Arret du NAT Windows (winnat)...
net stop winnat

echo.
echo [2/4] Reservation permanente du port 5433 (PostgreSQL)...
netsh int ipv4 add excludedportrange protocol=tcp startport=5433 numberofports=1 store=persistent

echo.
echo [3/4] Reservation permanente du port 5435 (PgBouncer)...
netsh int ipv4 add excludedportrange protocol=tcp startport=5435 numberofports=1 store=persistent

echo.
echo [4/4] Redemarrage du NAT Windows...
net start winnat

echo.
echo === Verification : les ports doivent apparaitre avec un * ===
netsh interface ipv4 show excludedportrange protocol=tcp | findstr /C:"5433" /C:"5435"

echo.
echo ============================================================
echo  TERMINE. Relance la stack DB avec :
echo    docker compose -f compose.db.yml --env-file ^<chemin^> up -d db pgbouncer
echo  (ou demande a EURINHASH de le faire)
echo ============================================================
pause
