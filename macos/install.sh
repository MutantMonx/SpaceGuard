#!/usr/bin/env bash
# SpaceGuard macOS Automated Installer v1.2.0
# Installs SpaceGuard daemon, CLI, and launchd background agent on macOS

set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
CYAN="\033[0;36m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${CYAN}${BOLD}=== SPACEGUARD macOS AUTOMATED INSTALLER (v1.2.0) ===${RESET}"

# 1. Check operating system
if [[ "$(uname)" != "Darwin" ]]; then
  echo -e "${RED}[!] Error: This installer is designed specifically for macOS (Darwin).${RESET}"
  exit 1
fi

ARCH="$(uname -m)"
echo -e "${GREEN}[+] Detected macOS (${ARCH})${RESET}"

# 2. Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}[!] Node.js not found. Checking for Homebrew...${RESET}"
  if command -v brew &> /dev/null; then
    echo -e "${GREEN}[+] Installing Node.js via Homebrew...${RESET}"
    brew install node
  else
    echo -e "${RED}[!] Error: Node.js and Homebrew are missing. Please install Homebrew from https://brew.sh or Node.js from https://nodejs.org${RESET}"
    exit 1
  fi
fi

NODE_VER="$(node -v)"
echo -e "${GREEN}[+] Using Node.js version ${NODE_VER}${RESET}"

# 3. Target Installation Directories
INSTALL_DIR="/usr/local/share/spaceguard"
BIN_DIR="/usr/local/bin"
PLIST_LABEL="com.monx.spaceguard.daemon"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_LABEL}.plist"

echo -e "${CYAN}[1/4] Preparing installation target: ${INSTALL_DIR}...${RESET}"
sudo mkdir -p "$INSTALL_DIR"
sudo mkdir -p "$BIN_DIR"

# 4. Clone / Copy SpaceGuard code
if [ -f "package.json" ] && [ -f "server.ts" ]; then
  echo -e "${GREEN}[+] Copying local repository files to ${INSTALL_DIR}...${RESET}"
  sudo cp -R . "$INSTALL_DIR/"
else
  echo -e "${GREEN}[+] Downloading SpaceGuard source from repository...${RESET}"
  TMP_DIR="$(mktemp -d)"
  git clone --depth 1 https://github.com/MutantMonx/SpaceGuard.git "$TMP_DIR/spaceguard"
  sudo cp -R "$TMP_DIR/spaceguard/"* "$INSTALL_DIR/"
  rm -rf "$TMP_DIR"
fi

# 5. Build SpaceGuard for production
echo -e "${CYAN}[2/4] Installing dependencies & building production bundle...${RESET}"
cd "$INSTALL_DIR"
sudo npm install --quiet
sudo npm run build

# 6. Create macOS wrapper binary
echo -e "${CYAN}[3/4] Creating CLI wrapper binary at ${BIN_DIR}/spaceguard...${RESET}"
cat << 'EOF' | sudo tee "$BIN_DIR/spaceguard" > /dev/null
#!/usr/bin/env bash
export NODE_ENV=production
export PORT=3000

if [ "$1" == "--version" ] || [ "$1" == "-v" ]; then
  echo "SpaceGuard Core v1.2.0 (macOS Darwin)"
  exit 0
fi

if [ "$1" == "clean-mac" ]; then
  echo "🧹 Cleaning macOS caches (Homebrew, Xcode, User Trash)..."
  rm -rf ~/Library/Caches/Homebrew/* 2>/dev/null || true
  rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
  rm -rf ~/.Trash/* 2>/dev/null || true
  echo "✅ macOS Caches cleared successfully!"
  exit 0
fi

exec node /usr/local/share/spaceguard/dist/server.cjs "$@"
EOF

sudo chmod 755 "$BIN_DIR/spaceguard"

# 7. Configure launchd daemon
echo -e "${CYAN}[4/4] Configuring launchd daemon background service...${RESET}"
mkdir -p "$HOME/Library/LaunchAgents"

cat << EOF > "$PLIST_PATH"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${BIN_DIR}/spaceguard</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>${INSTALL_DIR}</string>
    <key>StandardOutPath</key>
    <string>/tmp/spaceguard.stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/spaceguard.stderr.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key>
        <string>production</string>
        <key>PORT</key>
        <string>3000</string>
        <key>PATH</key>
        <string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
</dict>
</plist>
EOF

# Unload previous service if exists, then load
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH" 2>/dev/null || true

echo -e "${GREEN}${BOLD}=== SPACEGUARD macOS INSTALLATION COMPLETE! ===${RESET}"
echo -e "• Daemon service loaded: ${PLIST_LABEL}"
echo -e "• Web Dashboard available at: ${CYAN}http://localhost:3000${RESET}"
echo -e "• CLI tool installed: ${CYAN}spaceguard status${RESET}"
echo -e "• Native macOS cache purge command: ${CYAN}spaceguard clean-mac${RESET}"
