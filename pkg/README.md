# Debian Package Installation & Repository Management: SpaceGuard

The Debian installation package (`.deb`) for **SpaceGuard v1.2.0** (`amd64` architecture) has been compiled and assembled. Created by **monx.one**.

The package includes:
1. Compiled and optimized frontend application (React) and backend server daemon (Node/Express).
2. System launcher binary placed at `/usr/bin/spaceguard`.
3. Configured **Systemd** service unit (`spaceguard.service`) ensuring persistent daemon background execution and automatic boot start.
4. Installer pre/post scripts handling systemd reloads and clean uninstallation.

---

## 🚀 Method 1: Direct Package Installation (`dpkg`)

To install the `.deb` package directly on your Debian or Kali Linux machine:

```bash
# 1. Navigate to the package directory
cd pkg/

# 2. Install package using dpkg
sudo dpkg -i spaceguard_1.2.0_amd64.deb

# 3. Automatically resolve and install any missing system dependencies:
sudo apt-get install -f
```

---

## 📦 Method 2: Local APT Repository (`sudo apt install`)

To host SpaceGuard in a local or remote APT repository so users can install updates via `sudo apt install spaceguard`:

### Step 2.1: Repository Directory Structure
Select a directory for your repository host, for example `/opt/spaceguard-repo/`:

```bash
# Create repository directory structure
sudo mkdir -p /opt/spaceguard-repo/binary

# Copy the .deb package
sudo cp spaceguard_1.2.0_amd64.deb /opt/spaceguard-repo/binary/
```

### Step 2.2: Generate Package Index
Use `dpkg-scanpackages` (provided by `dpkg-dev`) to construct the compressed `Packages.gz` index:

```bash
# Install dpkg-dev tools if not present
sudo apt update && sudo apt install -y dpkg-dev

# Generate repository package index
cd /opt/spaceguard-repo/
dpkg-scanpackages binary /dev/null | gzip -9c > binary/Packages.gz
```

### Step 2.3: Register APT Source
Add the repository source file to `/etc/apt/sources.list.d/`. Using `[trusted=yes]` marks local unsigned repos as trusted:

```bash
echo "deb [trusted=yes] file:/opt/spaceguard-repo binary/" | sudo tee /etc/apt/sources.list.d/spaceguard.list
```

### Step 2.4: Install via APT
Update package index and install SpaceGuard:

```bash
# Update APT index
sudo apt update

# Install SpaceGuard via APT
sudo apt install spaceguard
```

---

## 🛠️ Systemd Daemon Management

After installation, the SpaceGuard daemon service starts automatically. Manage it using standard systemctl commands:

*   **Check Service Status:**
    ```bash
    sudo systemctl status spaceguard.service
    ```
*   **Stop Service:**
    ```bash
    sudo systemctl stop spaceguard.service
    ```
*   **Start Service:**
    ```bash
    sudo systemctl start spaceguard.service
    ```
*   **Restart Service:**
    ```bash
    sudo systemctl restart spaceguard.service
    ```
*   **View Real-time Logs:**
    ```bash
    sudo journalctl -u spaceguard.service -f
    ```

---

## 🌐 Web Application Interface

When the `spaceguard` daemon is running, the management dashboard is served on port **3000**.
Open your browser at:
👉 **`http://localhost:3000`**

---
*SpaceGuard is created by [monx.one](https://monx.one/). All rights reserved under the Apache License 2.0.*
