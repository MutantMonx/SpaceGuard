# Instrukcja Instalacji i Zarządzania Pakietem Debian: SpaceGuard

Pomyślnie wygenerowano i skompilowano w pełni samodzielną paczkę instalacyjną `.deb` systemu **SpaceGuard** w wersji **1.0.0** dla architektury **amd64**.

Paczka zawiera:
1. Skompilowaną i zoptymalizowaną aplikację frontendową (React) oraz backendową (Node/Express).
2. Binarkę rozruchową w systemie pod ścieżką `/usr/bin/spaceguard`.
3. Skonfigurowaną usługę systemową **Systemd** (`spaceguard.service`) dbającą o to, by demon działał stabilnie i automatycznie uruchamiał się przy starcie systemu.
4. Skrypty instalatora automatycznie przeładowujące Systemd i dbające o proces deinstalacji.

---

## 🚀 Metoda 1: Szybka instalacja bezpośrednia (dpkg)

Jeśli chcesz zainstalować paczkę bezpośrednio na bieżącej maszynie Debian/Kali Linux:

```bash
# 1. Przejdź do folderu z paczką (lub użyj ścieżki bezwzględnej /pkg/)
cd pkg/

# 2. Zainstaluj pakiet za pomocą menedżera dpkg
sudo dpkg -i spaceguard_1.0.0_amd64.deb

# 3. W razie wystąpienia brakujących zależności (np. brak nodejs), doinstaluj je automatycznie:
sudo apt-get install -f
```

---

## 📦 Metoda 2: Utworzenie lokalnego repozytorium APT (Instalacja przez `sudo apt install`)

Aby dodać pakiet do własnego lokalnego repozytorium APT, dzięki czemu system będzie mógł wyszukiwać, dopasowywać i instalować oprogramowanie za pomocą standardowego polecenia `sudo apt install spaceguard`:

### Krok 2.1: Przygotowanie katalogu repozytorium
Wybierz bezpieczny katalog w systemie operacyjnym, który posłuży za lokalny serwer pakietów, na przykład `/opt/spaceguard-repo/`:

```bash
# Stwórz strukturę katalogów repozytorium
sudo mkdir -p /opt/spaceguard-repo/binary

# Skopiuj tam przygotowaną paczkę .deb
sudo cp spaceguard_1.0.0_amd64.deb /opt/spaceguard-repo/binary/
```

### Krok 2.2: Generowanie indeksu pakietów repozytorium
Użyjemy narzędzia `dpkg-scanpackages` (dostarczanego przez pakiet `dpkg-dev`), aby stworzyć spakowany plik indeksu `Packages.gz`:

```bash
# Doinstaluj wymagane narzędzia dpkg-dev, jeśli jeszcze ich nie masz
sudo apt update && sudo apt install -y dpkg-dev

# Przejdła do katalogu głównego repozytorium i wygeneruj indeks
cd /opt/spaceguard-repo/
dpkg-scanpackages binary /dev/null | gzip -9c > binary/Packages.gz
```

### Krok 2.3: Rejestracja repozytorium w systemie APT
Dodaj nowe lokalne źródło pakietów jako plik konfiguracyjny w `/etc/apt/sources.list.d/`. Ponieważ jest to repozytorium lokalne i niepodpisane kluczem GPG, musimy oznaczyć je flagą `[trusted=yes]`:

```bash
echo "deb [trusted=yes] file:/opt/spaceguard-repo binary/" | sudo tee /etc/apt/sources.list.d/spaceguard.list
```

### Krok 2.4: Instalacja pakietu
Od teraz Twoja paczka jest pełnoprawnym elementem bazy danych APT! Zaktualizuj listę pakietów i zainstaluj program:

```bash
# Zaktualizuj bazę źródłową APT
sudo apt update

# Zainstaluj system SpaceGuard za pomocą APT
sudo apt install spaceguard
```

---

## 🛠️ Zarządzanie daemonem po instalacji

Po pomyślnej instalacji (dowolną z powyższych metod) instalator automatycznie zarejestruje, aktywuje i uruchomi usługę systemową. Możesz nią sterować za pomocą poniższych poleceń:

*   **Sprawdzenie statusu działania usługi:**
    ```bash
    sudo systemctl status spaceguard.service
    ```
*   **Zatrzymanie usługi:**
    ```bash
    sudo systemctl stop spaceguard.service
    ```
*   **Ręczne uruchomienie usługi:**
    ```bash
    sudo systemctl start spaceguard.service
    ```
*   **Ponowne uruchomienie usługi (np. po aktualizacji konfiguracji):**
    ```bash
    sudo systemctl restart spaceguard.service
    ```
*   **Wyświetlenie logów diagnostycznych demona w czasie rzeczywistym:**
    ```bash
    sudo journalctl -u spaceguard.service -f
    ```

---

## 🌐 Dostęp do panelu graficznego

Gdy usługa `spaceguard` działa w tle, serwer automatycznie serwuje aplikację webową na porcie **3000**.
Wystarczy, że otworzysz przeglądarkę pod adresem:
👉 **`http://localhost:3000`** (lub adres IP Twojego serwera Kali/Debian, np. `http://192.168.1.100:3000`)
