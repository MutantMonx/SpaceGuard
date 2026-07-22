# SpaceGuard 🛡️

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Debian%20%7C%20Kali%20Linux%20%7C%20Ubuntu-purple.svg)](https://www.debian.org/)
[![Architecture](https://img.shields.io/badge/Architecture-amd64%20%7C%20arm64-green.svg)]()
[![Language](https://img.shields.io/badge/Language-TypeScript%20%7C%20React%20%7C%20Node.js-3178C6.svg)]()
[![Release](https://img.shields.io/badge/Version-1.2.0-brightgreen.svg)](https://github.com/MutantMonx/SpaceGuard/releases)

> **Lightweight Disk Space & Comprehensive Dependency Optimizer for Debian and Kali Linux Systems**
> **Created by [monx.one](https://monx.one/)**

SpaceGuard is an intelligent, low-footprint system utility designed specifically for Debian, Kali Linux, and Ubuntu environments. Built on a strict **"Monitor Everything"** policy, SpaceGuard captures and categorizes 100% of data occupying disk storage — including APT packages, custom binary downloads (`wget`/`curl`), Docker & Podman container layers, system caches, user trash bins, and external USB ingests.

---

## 🌟 Key Features

### 🗺️ Interactive Disk Space Map & Treemap
- **Folder & Application Modes:** Switch seamlessly between directory hierarchy breakdown (`/usr`, `/var`, `/home`, `/opt`, `/tmp`, `/lib`, `/etc`) and granular application/download tiles.
- **Hover & Metrics Summary:** View exact disk footprint (MB/GB), percentage of used storage, path location, first discovered date, and last access date on hover.
- **Contextual Actions:** Right-click any tile to copy paths, inspect dependencies in the D3 graph, quick-clean/purge resources, or add items to the protected safeguard exclude list.

### 🔍 Deep Scan & Live Resource Audit
- **Factual Disk State Audit:** Scans system packages (`dpkg`), `/var/cache/apt/archives`, user Trash bins, custom downloads, and USB ingests.
- **Container Runtime Scrapers:** Detects dangling Docker & Podman overlay images (`/var/lib/docker/overlay2`), exited containers, and unused pods.
- **Zero-Wait Ingestion:** Immediately indexes pre-existing tools and downloads on filled disks without waiting for background event triggers.

### 🕸️ Interactive Dependency Graph (D3-Powered)
- **Shared Library Linkage Visualization:** Displays real-time relationships between installed software and `.so` shared libraries (`libc6`, `libssl3`, `libcrypto.so`, etc.).
- **Impact Simulation:** Visualizes cascading dependency removals before executing destructive commands.

### 📦 Custom Download & Footprint Tracker
- **Outside-APT Ingestion:** Tracks tools installed manually via `wget`, `curl`, `git clone`, or custom scripts in `/opt` and `/usr/local/bin`.
- **Collaborator Dependency Mapping:** Links standalone security tools with their system library dependencies.

### ⚡ Low-Resource Daemon Architecture
- **Ultra-Compact Footprint:** Resident memory footprint maintained strictly below **40 MB RAM**.
- **CLI & REST API Integration:** Full headless control via `spaceguard` CLI binary or JSON REST API endpoints (`/api/packages`, `/api/containers`, `/api/diskmap`, `/api/cli`).

### 🎨 Customizable Cyberpunk Console Themes & Multilingual UI
- **4 Custom Engine Themes:**
  - `U1 Forge` (Kali Dark Crimson)
  - `U2 Atlas` (Silver Monolith)
  - `U3 Pulse` (Cyan Geometric Balance)
  - `U4 Zen` (Amber Clean Orbit)
- **Multilingual Support:** English (Default) and Polish (PL) with instant UI switching and persistent local storage preferences.

---

## 📸 Screenshots & Architecture

```
+-------------------------------------------------------------------------------+
| SPACEGUARD v1.2.0                 [ 🌐 EN | PL ] [ U1 | U2 | U3 | U4 ]         |
+-------------------------------------------------------------------------------+
| DISK UTILIZATION (/)   | TRASH CAPACITY   | APT CACHE SIZE   | DAEMON MONITOR  |
| 53.4 GB / 60 GB (89%)  | 1240 MB          | 2450 MB          | ~38.2 MB RAM    |
+-------------------------------------------------------------------------------+
| [1. Package Manager] [2. CLI Console] [3. Dep Graph] [4. Logo] [5. Debian .deb] |
+-------------------------------------------------------------------------------+
```

---

## 🚀 Quick Installation

### Method 1: Install Pre-built `.deb` Package (Recommended)

Download the pre-compiled `.deb` package directly from the repo:

```bash
# Download the package
wget https://github.com/MutantMonx/SpaceGuard/raw/main/pkg/spaceguard_1.2.0_amd64.deb

# Install via dpkg
sudo dpkg -i spaceguard_1.2.0_amd64.deb

# Resolve any missing dependencies automatically
sudo apt-get install -f
```

---

### Method 2: Add SpaceGuard APT Repository

You can add SpaceGuard directly to your local APT sources to manage updates via `sudo apt install`:

```bash
# Add SpaceGuard repository key and source
echo "deb [trusted=yes] https://raw.githubusercontent.com/MutantMonx/SpaceGuard/main/pkg/ ./" | sudo tee /etc/apt/sources.list.d/spaceguard.list

# Update APT package indexes
sudo apt update

# Install SpaceGuard
sudo apt install spaceguard
```

---

### Method 3: Run from Source (Development)

Ensure Node.js (v18+) is installed on your system:

```bash
# Clone the repository
git clone https://github.com/MutantMonx/SpaceGuard.git
cd SpaceGuard

# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm run dev
```

To build for production:

```bash
# Build production bundle and server executable
npm run build

# Start production server
npm start
```

---

## 💻 CLI Commands (`spaceguard`)

SpaceGuard includes a command-line interface mimicking the daemon socket RPC:

| Command | Description |
| :--- | :--- |
| `spaceguard status` | Display disk usage breakdown, daemon health, and memory footprint. |
| `spaceguard scan` | Run a deep diagnostic scan across system packages, containers, and trash. |
| `spaceguard clean` | Flush APT package cache (`/var/cache/apt/archives`) and user trash bins. |
| `spaceguard autoremove` | Purge orphaned packages and unlinked shared libraries. |
| `spaceguard containers prune` | Remove dangling Docker/Podman images and stopped containers. |
| `spaceguard list --custom` | List manually installed tools outside APT repositories. |

---

## 🛠️ Building the Debian Package (`.deb`)

SpaceGuard includes a automated Debian package builder:

```bash
# Generate .deb package structure in /pkg/
npm run dev # Access "5. Debian Packaging" tab in the UI or use the API endpoint:

curl -X POST http://localhost:3000/api/packaging/build
```

The output package structure follows standard Debian control specifications:
```
pkg/
├── spaceguard_1.2.0_amd64.deb
├── Packages
├── Packages.gz
└── Release
```

---

## 📄 License

Distributed under the **Apache License 2.0**. See [`LICENSE`](LICENSE) for details.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to check the [issues page](https://github.com/MutantMonx/SpaceGuard/issues).

Developed with ❤️ for Debian & Kali Linux power users.
