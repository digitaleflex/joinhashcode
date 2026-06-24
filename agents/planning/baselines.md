# Infrastructure Baselines

> **Host:** axiom | **OS:** Ubuntu 22.04, kernel 6.8.0-124-generic, x86_64
> **Uptime:** 4d 21h (last boot ~Jun 19) | **Cores:** 2 vCPU

## CPU

- **Load avg (1/5/15):** 1.27 / 2.26 / 2.66
- **Peak observé:** load > 2.5 sur idle partiel (dockerd + 2 instances opencode consomment ~80% CPU)
- **Processeurs lourds:** dockerd (48%), opencode x2 (59% + 16%), next-server (3%)

## RAM

- **Total:** 7.8 GiB
- **Used:** 2.9 GiB (37%)
- **Available:** 4.9 GiB (63%)
- **Swap:** 2.0 GiB total, 1.4 GiB used (70%)
- **Détail Docker:** hashcode-web 136MiB, db 54MiB, traefik 52MiB, github-runner 45MiB, channel-market-app 30MiB

## Disk

- **Device:** /dev/sda1, 96G total, 67G used (**70% full**), 30G available
- **IOPS (sda):** r/s=7, w/s=28, rkB/s=4, wkB/s=256, await=11ms, svctm=0.5ms, %util=0.5%

## Network

- **IP:** 72.60.46.122/24 (eth0)
- **Traefik:** 531MB RX / 345MB TX (depuis démarrage)
- **Docker bridge:** 172.25.0.1/16

## Valeurs cibles

- **CPU load:** ≤ 1.0 (idle), ≤ 2.0 (sous charge normale)
- **RAM disponible:** ≥ 2 GiB
- **Disk usage:** ≤ 75% (alerte à 80%)
- **Disk IOPS await:** ≤ 20ms
- **Swap used:** ≤ 500 MiB

## Seuils d'alerte

- **Warning:**
  - CPU load > 3.0 sur 5 min
  - Disk usage > 80%
  - RAM available < 1 GiB
  - Swap > 1 GiB
- **Critique:**
  - CPU load > 5.0 sur 5 min
  - Disk usage > 90%
  - RAM available < 512 MiB
  - Swap > 1.5 GiB
  - IOPS await > 50ms

## Notes

- Swap utilisé à 70% (1.4/2.0 GiB) — principalement dû aux 2 instances opencode (805MiB + 555MiB RSS).
- Disk à 70% — surveiller l'évolution, prévoir extension ou cleanup des images Docker inutilisées.
- Traefik en `unhealthy` (healthcheck ping non configuré) — non bloquant.
- PgBouncer inutilisé (SCRAM + auth incompatible) — connecté directement à `db:5432`.
