#!/bin/bash
set -e

echo "=== ROZPOCZĘCIE PROCESU PACZKOWANIA DEBIAN (SpaceGuard) ==="

# 1. Budowanie aplikacji za pomocą npm run build
echo "[1/6] Kompilacja kodu produkcyjnego React + Node..."
npm run build

# 2. Tworzenie czystej struktury katalogu budowania deb
BUILD_DIR="spaceguard-deb-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/DEBIAN"
mkdir -p "$BUILD_DIR/usr/share/spaceguard/dist"
mkdir -p "$BUILD_DIR/usr/bin"
mkdir -p "$BUILD_DIR/etc/systemd/system"

# 3. Kopiowanie skompilowanych plików
echo "[2/6] Kopiowanie skompilowanych zasobów do katalogu dystrybucyjnego..."
cp -r dist/* "$BUILD_DIR/usr/share/spaceguard/dist/"
cp package.json "$BUILD_DIR/usr/share/spaceguard/"

# 4. Tworzenie binarki rozruchowej (wrapper launcher)
echo "[3/6] Tworzenie skryptu uruchomieniowego /usr/bin/spaceguard..."
cat << 'EOF' > "$BUILD_DIR/usr/bin/spaceguard"
#!/bin/bash
export NODE_ENV=production
# Uruchomienie zoptymalizowanego i w pełni skompilowanego serwera
exec node /usr/share/spaceguard/dist/server.cjs
EOF
chmod 755 "$BUILD_DIR/usr/bin/spaceguard"

# 5. Tworzenie pliku usługi Systemd
echo "[4/6] Tworzenie jednostki usługi systemd dla demona..."
cat << 'EOF' > "$BUILD_DIR/etc/systemd/system/spaceguard.service"
[Unit]
Description=SpaceGuard Disk Monitor and Live System Audit Daemon
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/usr/share/spaceguard
ExecStart=/usr/bin/spaceguard
Restart=always
RestartSec=5
# Limity zasobów dla bezpieczeństwa i stabilności systemu
MemoryMax=150M
CPUQuota=10%

[Install]
WantedBy=multi-user.target
EOF

# 6. Tworzenie metadanych DEBIAN (control, postinst, prerm)
echo "[5/6] Generowanie metadanych instalatora dpkg..."

# Plik control
cat << 'EOF' > "$BUILD_DIR/DEBIAN/control"
Package: spaceguard
Version: 1.2.0
Section: admin
Priority: optional
Architecture: amd64
Maintainer: SpaceGuard Contributor <contrib@spaceguard.org>
Depends: nodejs (>= 16)
Description: SpaceGuard - Disk space optimizer and real-time live system audit daemon
 SpaceGuard monitors root mountpoints, synchronizes package sizes
 from dpkg status with physical disk usage, and recommends safe garbage
 collection targets. Includes CLI terminal controls and system tray overlays.
EOF

# Skrypt post-instalacyjny (postinst)
cat << 'EOF' > "$BUILD_DIR/DEBIAN/postinst"
#!/bin/sh
set -e
if [ "$1" = "configure" ]; then
    echo "Konfigurowanie usługi SpaceGuard..."
    systemctl daemon-reload || true
    systemctl enable spaceguard.service || true
    systemctl restart spaceguard.service || true
    echo "Usługa SpaceGuard została pomyślnie uruchomiona w tle!"
fi
exit 0
EOF
chmod 755 "$BUILD_DIR/DEBIAN/postinst"

# Skrypt przed-deinstalacyjny (prerm)
cat << 'EOF' > "$BUILD_DIR/DEBIAN/prerm"
#!/bin/sh
set -e
if [ "$1" = "remove" ] || [ "$1" = "deconfigure" ]; then
    echo "Zatrzymywanie usługi SpaceGuard przed usunięciem pakietu..."
    systemctl stop spaceguard.service || true
    systemctl disable spaceguard.service || true
fi
exit 0
EOF
chmod 755 "$BUILD_DIR/DEBIAN/prerm"

# 7. Budowanie pakietu debianowego przy użyciu dpkg-deb
echo "[6/6] Konsolidacja struktury i budowanie paczki .deb przy użyciu dpkg-deb..."
mkdir -p pkg
dpkg-deb --build "$BUILD_DIR" pkg/spaceguard_1.2.0_amd64.deb

# Czyszczenie katalogów tymczasowych
rm -rf "$BUILD_DIR"

# Tworzenie absolutnego katalogu /pkg jeśli to możliwe (dla wygody usera)
if mkdir -p /pkg 2>/dev/null; then
  cp pkg/spaceguard_1.2.0_amd64.deb /pkg/spaceguard_1.2.0_amd64.deb || true
  echo "Utworzono oraz skopiowano dodatkowo do absolutnej ścieżki /pkg/spaceguard_1.2.0_amd64.deb"
fi

echo "=== PACZKOWANIE ZAKOŃCZONE SUKCESEM! ==="
echo "Paczka znajduje się w: pkg/spaceguard_1.2.0_amd64.deb"
