/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Shield, FileText, Settings, Heart } from 'lucide-react';

interface PackagingViewProps {
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
}

const DEBIAN_CONTROL = `Source: spaceguard
Section: admin
Priority: optional
Maintainer: Kali Contributor <contrib@kali.org>
Build-Depends: debhelper-compat (= 13), python3-all, python3-setuptools
Standards-Version: 4.6.2
Homepage: https://github.com/kali/spaceguard

Package: spaceguard
Architecture: all
Depends: \${python3:Depends}, \${misc:Depends}, python3-gi, python3-sqlite3, gir1.2-ayatanaappindicator3-0.1, gir1.2-gtk-3.0, sqlite3
Description: Lightweight disk space optimizer and daemon for Debian/Kali
 SpaceGuard periodically monitors root mountpoints, synchronizes package sizes
 from dpkg status with physical disk usage, and recommends safe garbage 
 collection targets. Includes CLI terminal controls and system tray overlays.`;

const DEBIAN_RULES = `#!/usr/bin/make -f
# debian/rules for spaceguard system optimizer

%:
	dh $@ --with python3

override_dh_auto_install:
	dh_auto_install
	# Install systemd user service unit
	install -D -m 644 debian/spaceguard.service debian/spaceguard/usr/lib/systemd/user/spaceguard.service
	# Install tray indicator desktop launcher
	install -D -m 644 spaceguard.desktop debian/spaceguard/etc/xdg/autostart/spaceguard.desktop
	# Create logging directory
	install -d -m 755 debian/spaceguard/var/log/spaceguard/`;

const SYSTEMD_SERVICE = `[Unit]
Description=SpaceGuard Lightweight Disk Space Monitor and Optimizer Daemon
After=graphical-session.target
PartOf=graphical-session.target

[Service]
Type=simple
ExecStart=/usr/bin/spaceguard --daemon
Restart=always
RestartSec=5
# Limit resources securely (< 80 MB Resident memory)
MemoryMax=80M
MemoryHigh=60M
CPUQuota=5%

[Install]
WantedBy=default.target`;

export default function PackagingView({ variant }: PackagingViewProps) {
  const panelStyle = () => {
    switch (variant) {
      case 'Forge':
        return 'bg-[#0c1015] border-[#1a1f26] text-[#ff3e3e] font-mono';
      case 'Atlas':
        return 'bg-[#0c1015] border-[#1a1f26] text-white font-mono';
      case 'Pulse':
        return 'bg-[#0c1015] border-[#1a1f26] text-[#00f2ff] font-mono';
      case 'Zen':
        return 'bg-[#0c1015] border-[#1a1f26] text-[#f2a100] font-mono';
    }
  };

  const getAccentHex = () => {
    switch (variant) {
      case 'Forge': return 'text-[#ff3e3e]';
      case 'Atlas': return 'text-white';
      case 'Pulse': return 'text-[#00f2ff]';
      case 'Zen': return 'text-[#f2a100]';
    }
  };

  return (
    <div id="packaging-suite-card" className="p-4 rounded-none border bg-[#080b0f] border-[#1a1f26]">
      <div className="pb-3 border-b border-[#1a1f26] mb-4">
        <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${getAccentHex()}`}>
          <FileText className="w-4 h-4" />
          Debian & Kali Linux Packaging Suite (Build configs)
        </h3>
        <p className="text-xs opacity-50">Struktura paczkowania systemowego .deb do instalacji w systemach Debian/Kali z demonem systemd.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Control File */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <FileText className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[11px] font-bold uppercase tracking-wider">debian/control</span>
          </div>
          <pre className={`p-3 rounded-none text-[10px] leading-relaxed overflow-x-auto max-h-[250px] border ${panelStyle()}`}>
            {DEBIAN_CONTROL}
          </pre>
        </div>

        {/* Rules File */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <Settings className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[11px] font-bold uppercase tracking-wider">debian/rules</span>
          </div>
          <pre className={`p-3 rounded-none text-[10px] leading-relaxed overflow-x-auto max-h-[250px] border ${panelStyle()}`}>
            {DEBIAN_RULES}
          </pre>
        </div>

        {/* Systemd Service */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <Terminal className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[11px] font-bold uppercase tracking-wider">debian/spaceguard.service</span>
          </div>
          <pre className={`p-3 rounded-none text-[10px] leading-relaxed overflow-x-auto max-h-[250px] border ${panelStyle()}`}>
            {SYSTEMD_SERVICE}
          </pre>
        </div>
      </div>
    </div>
  );
}
