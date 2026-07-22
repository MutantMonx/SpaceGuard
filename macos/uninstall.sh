#!/usr/bin/env bash
# SpaceGuard macOS Automated Uninstaller
set -e

PLIST_LABEL="com.monx.spaceguard.daemon"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_LABEL}.plist"

echo "=== UNINSTALLING SPACEGUARD FROM macOS ==="

if [ -f "$PLIST_PATH" ]; then
  echo "[+] Unloading launchd daemon service..."
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
  rm -f "$PLIST_PATH"
fi

echo "[+] Removing launcher binary /usr/local/bin/spaceguard..."
sudo rm -f /usr/local/bin/spaceguard

echo "[+] Removing core installation files /usr/local/share/spaceguard..."
sudo rm -rf /usr/local/share/spaceguard

echo "✅ SpaceGuard has been completely uninstalled from your macOS system."
