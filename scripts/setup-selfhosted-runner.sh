#!/usr/bin/env bash
set -euo pipefail

echo "=== Installing GitHub self-hosted runner ==="
echo "Run this ONCE on the VPS."

# Create runner dir
mkdir -p /home/gh-runner && cd /home/gh-runner

# Download latest runner
LATEST=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep "browser_download_url" | grep "linux-x64" | cut -d'"' -f4)
echo "Downloading: $LATEST"
curl -Lo runner.tar.gz "$LATEST"
tar xzf runner.tar.gz

# Prompt for token — get this from:
# https://github.com/digitaleflex/joinhashcode/settings/actions/runners/new?arch=x64&os=linux
read -rp "GitHub Actions runner registration token: " TOKEN

./config.sh \
  --url https://github.com/digitaleflex/joinhashcode \
  --token "$TOKEN" \
  --name "hashcode-vps" \
  --labels "self-hosted" \
  --work "/home/gh-runner/work" \
  --unattended

sudo ./svc.sh install
sudo ./svc.sh start

echo "=== Done ==="
echo "Verify: sudo ./svc.sh status"