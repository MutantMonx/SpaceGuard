/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export const dictionary = {
  en: {
    // Top Bar & Header
    appTitle: "SPACEGUARD",
    appSubtitle: "DEBIAN / KALI LINUX OPTIMIZER",
    kernel: "KERNEL: 6.8.11-KALI",
    statusOnline: "ONLINE",
    resetDb: "Reset Database",
    resetDbToast: "SpaceGuard database restored to default state.",
    resetDbError: "Database reset error.",
    cleanCacheTrash: "Quick Clean Cache & Trash",
    cleanCacheSuccess: "Cleaned APT installation cache and system trash. Reclaimed {mb} MB.",
    cleanCacheEmpty: "Cache and trash are already empty.",
    diskStorage: "DISK STORAGE (/)",
    used: "used",
    free: "free",
    deepScanSyncBtn: "🔍 Deep Scan & Sync",
    trayToggle: "SYSTEM TRAY",
    
    // Tabs
    tabDashboard: "1. Package Manager & Cleaning",
    tabCli: "2. CLI Console",
    tabGraph: "3. Dependency Graph",
    tabLogo: "4. Logo & Brand Generator",
    tabPackaging: "5. Debian Packaging (.deb)",
    tabContainers: "6. Containers (Docker/Podman)",
    tabDeepScan: "7. Deep Scan (Live Audit)",

    // Package List / Dashboard
    pkgTitle: "INSTALLED PACKAGES & DISK CLEANER",
    pkgSubtitle: "Scans dpkg database and detects orphaned packages, residual config files, and heavy footprints.",
    searchPlaceholder: "Search packages by name or description...",
    filterAll: "All Packages",
    filterSafe: "Safe to Remove (Importance <= 3)",
    filterCustom: "Manual Downloads (wget/curl)",
    filterSystem: "System Core",
    sortSize: "Sort by Disk Usage",
    sortImportance: "Sort by Importance",
    sortName: "Sort by Name",
    purgeSelected: "Purge Package",
    autoremove: "Run Auto-Remove",
    autoremoveSuccess: "Removed orphaned dependencies. Freed {mb} MB.",
    actualSize: "Actual disk footprint",
    dpkgHeaderSize: "dpkg declared size",
    importanceLevel: "Importance Level",
    riskLevel: "Rollback Risk",
    systemCoreBadge: "SYSTEM CORE",
    customFootprintBadge: "MANUAL DOWNLOAD",
    noPkgsFound: "No packages matching criteria found.",

    // CLI Console
    cliTitle: "EMULATED DEBIAN/KALI TERMINAL (CLI)",
    cliSubtitle: "Direct interaction with SpaceGuard daemon commands and apt-get simulator.",
    cliHelpMsg: "Type 'help' to see available SpaceGuard CLI commands.",
    cliInputPlaceholder: "Type command (e.g., apt-get update, spaceguard scan, du -sh)...",
    cliRunBtn: "Run",
    cliClearBtn: "Clear Console",

    // Dependency Graph
    graphTitle: "PACKAGE DEPENDENCY & FOOTPRINT GRAPH",
    graphSubtitle: "Interactive node visualization of shared libraries, reverse dependencies, and disk impact.",
    graphSelectPkg: "Select package to analyze:",
    graphLegendPkg: "Target Package",
    graphLegendDep: "Direct Dependency",
    graphLegendRevDep: "Reverse Dependency (Dependents)",
    graphLegendLib: "Shared Library (.so)",
    graphImpactTitle: "Disk Footprint Impact",
    graphImpactText: "Removing this package frees {mb} MB directly and up to {totalMb} MB including unused orphaned sub-dependencies.",

    // Logo Generator
    logoTitle: "SPACEGUARD BRAND & ASSET GENERATOR",
    logoSubtitle: "Generate vector SVG icons and ASCII banners for terminal integration.",
    logoDownloadSvg: "Download SVG Logo",
    logoCopyAscii: "Copy ASCII Banner",
    logoAsciiCopied: "ASCII Banner copied to clipboard!",

    // Packaging View
    packTitle: "DEBIAN PACKAGE BUILDER (.DEB)",
    packSubtitle: "Compile SpaceGuard source into a standalone Debian .deb installer with Systemd service.",
    packBuildBtn: "Build .deb Installer Package",
    packBuilding: "Compiling and packaging...",
    packSuccess: "Debian package successfully generated at /pkg/spaceguard_1.0.0_amd64.deb",
    packInstructBtn: "View APT Repo Setup Instructions",

    // Containers Manager
    contTitle: "DOCKER & PODMAN CONTAINER MANAGER",
    contSubtitle: "Monitor container engines, dangling images, and reclaimed writable layer storage.",
    contDockerTab: "Docker Engine",
    contPodmanTab: "Podman Engine",
    contPruneBtn: "Run Engine Prune",
    contPruneSuccess: "Engine pruned successfully. Reclaimed {mb} MB.",
    contNoPrune: "No dangling images or stopped containers to prune.",
    contImages: "Container Images",
    contContainers: "Containers",
    contDangling: "Dangling",
    contRunning: "Running",
    contExited: "Exited",
    contSize: "Size",

    // Deep Scan Module
    scanTitle: "DEEP DISK SCAN & LIVE RESOURCE AUDIT",
    scanSubtitle: "Scans low-level dpkg status, /var/lib/docker/overlay2, Podman registers, and manual wget/curl downloads.",
    scanBannerText: "If you installed packages or pulled images directly in terminal outside SpaceGuard, this live audit scans physical disk state immediately.",
    scanStartBtn: "Run Deep System Scan",
    scanSimulateBtn: "Simulate External Installation (+1.5-3.8 GB)",
    scanScanning: "Scanning physical volumes...",
    scanStep1: "Analyzing dpkg installation database and shared library (.so) tables",
    scanStep2: "Mapping `/var/lib/docker/overlay2` layers and searching dangling images",
    scanStep3: "Querying Podman registers for stopped containers and pods",
    scanStep4: "Detecting manual file downloads (wget/curl) in `/home` and `/tmp`",
    scanStep5: "Calculating total APT cache overhead and system trash size",
    scanCompleteMsg: "Deep scan complete! Physical state synchronized.",
    scanSector1: "1. Containers & Images (Docker/Podman)",
    scanSector2: "2. Heavy Low-Importance Packages",
    scanSector3: "3. Manual Downloads (wget/curl)",
    scanSector4: "4. APT Cache & System Trash",
    scanPurgeBtn: "Purge",
    scanDeleteFileBtn: "Delete File",
    scanEmptyBtn: "Empty Cache & Trash",
    scanReclaimedSession: "Reclaimed in this session:",

    // System Tray
    trayTitle: "SPACEGUARD SYSTEM TRAY",
    trayStatusNormal: "Disk Status Normal",
    trayStatusWarning: "Disk Usage High",
    trayQuickClean: "Quick Clean (Cache & Trash)",
    trayOpenApp: "Open Full SpaceGuard Dashboard",

    // Interactive Treemap & Disk Space Map
    tabTreemap: "8. Interactive Space Map",
    treemapTitle: "INTERACTIVE DISK SPACE TREEMAP & FILE MAPPER",
    treemapSubtitle: "Comprehensive visual mapping of ALL directories, applications, containers, downloads, and USB ingests occupying storage.",
    treemapViewFolders: "Folder Hierarchy View",
    treemapViewApps: "Applications & Ingests View",
    treemapHoverTitle: "DISK OCCUPANCY METRICS",
    treemapCreatedDate: "First Discovered:",
    treemapUpdatedDate: "Last Updated:",
    treemapLocation: "Path:",
    treemapCategory: "Category:",
    treemapRisk: "Cleanup Risk:",
    contextInspectGraph: "🔍 Inspect Dependencies in Graph",
    contextQuickClean: "⚡ Quick Clean / Purge",
    contextCopyPath: "📁 Copy Path to Clipboard",
    contextSafeguard: "🛡️ Add to Exclude List",
    contextDeepScan: "🧹 Run Target Scan",
    brandingText: "Created by monx.one. All rights reserved under Apache 2.0.",

    // Language Toggle
    langEn: "English",
    langPl: "Polski",
  },
  pl: {
    // Top Bar & Header
    appTitle: "SPACEGUARD",
    appSubtitle: "OPTYMALIZATOR DEBIAN / KALI LINUX",
    kernel: "KERNEL: 6.8.11-KALI",
    statusOnline: "ONLINE",
    resetDb: "Resetuj Bazy",
    resetDbToast: "Baza SpaceGuard została przywrócona do stanu domyślnego.",
    resetDbError: "Błąd resetowania bazy.",
    cleanCacheTrash: "Szybkie Czyszczenie Cache i Kosza",
    cleanCacheSuccess: "Wyczyszczono cache instalacji APT oraz kosz systemowy. Zwolniono {mb} MB.",
    cleanCacheEmpty: "Cache i kosz są już puste.",
    diskStorage: "MIEJSCE NA DYSKU (/)",
    used: "zajęte",
    free: "wolne",
    deepScanSyncBtn: "🔍 Głęboki Skan & Synchronizacja",
    trayToggle: "SYSTEM TRAY",

    // Tabs
    tabDashboard: "1. Zarządzanie Pakietami i Czyszczenie",
    tabCli: "2. Konsola CLI",
    tabGraph: "3. Graf Zależności",
    tabLogo: "4. Generator Logo i Brandingu",
    tabPackaging: "5. Paczkowanie Debian (.deb)",
    tabContainers: "6. Kontenery (Docker/Podman)",
    tabDeepScan: "7. Głęboki Skan (Live Audyt)",

    // Package List / Dashboard
    pkgTitle: "ZAINSTALOWANE PAKIETY I ODCZYSZCZANIE DYSKU",
    pkgSubtitle: "Skanuje bazę dpkg i wykrywa osierocone pakiety, pozostałości po plikach konfiguracyjnych i duże footprinty.",
    searchPlaceholder: "Szukaj pakietów po nazwie lub opisie...",
    filterAll: "Wszystkie Pakiety",
    filterSafe: "Bezpieczne do usunięcia (Ważność <= 3)",
    filterCustom: "Ręczne Pobrania (wget/curl)",
    filterSystem: "Rdzeń Systemowy",
    sortSize: "Sortuj wg Rozmiaru na Dysku",
    sortImportance: "Sortuj wg Ważności",
    sortName: "Sortuj wg Nazwy",
    purgeSelected: "Odinstaluj Pakiet",
    autoremove: "Uruchom Auto-Remove",
    autoremoveSuccess: "Usunięto osierocone zależności. Zwolniono {mb} MB.",
    actualSize: "Rzeczywisty rozmiar na dysku",
    dpkgHeaderSize: "Rozmiar zadeklarowany dpkg",
    importanceLevel: "Poziom Ważności",
    riskLevel: "Ryzyko Deinstalacji",
    systemCoreBadge: "RDZEŃ SYSTEMU",
    customFootprintBadge: "RĘCZNE POBRANIE",
    noPkgsFound: "Brak pakietów spełniających kryteria.",

    // CLI Console
    cliTitle: "EMULOWANY TERMINAL DEBIAN/KALI (CLI)",
    cliSubtitle: "Bezpośrednia interakcja z komendami demona SpaceGuard oraz symulatorem apt-get.",
    cliHelpMsg: "Wpisz 'help' aby zobaczyć dostępne komendy CLI SpaceGuard.",
    cliInputPlaceholder: "Wpisz polecenie (np. apt-get update, spaceguard scan, du -sh)...",
    cliRunBtn: "Uruchom",
    cliClearBtn: "Wyczyść Konsolę",

    // Dependency Graph
    graphTitle: "GRAF ZALEŻNOŚCI I FOOTPRINTU PAKIETÓW",
    graphSubtitle: "Interaktywna wizualizacja węzłów bibliotek współdzielonych, zależności zwrotnych i wpływu na dysk.",
    graphSelectPkg: "Wybierz pakiet do analizy:",
    graphLegendPkg: "Analizowany Pakiet",
    graphLegendDep: "Bezpośrednia Zależność",
    graphLegendRevDep: "Zależność Zwrotna",
    graphLegendLib: "Biblioteka Współdzielona (.so)",
    graphImpactTitle: "Wpływ na Miejscu na Dysku",
    graphImpactText: "Usunięcie tego pakietu zwalnia {mb} MB bezpośrednio i do {totalMb} MB z nieużywanymi zależnościami.",

    // Logo Generator
    logoTitle: "GENERATOR BRANDINGU & ASSETÓW SPACEGUARD",
    logoSubtitle: "Generuj wektorowe ikony SVG oraz bannery ASCII do integracji z terminalem.",
    logoDownloadSvg: "Pobierz Logo SVG",
    logoCopyAscii: "Kopiuj Banner ASCII",
    logoAsciiCopied: "Banner ASCII skopiowany do schowka!",

    // Packaging View
    packTitle: "BUDOWNICZY PAKIETÓW DEBIAN (.DEB)",
    packSubtitle: "Kompiluj kod źródłowy SpaceGuard w samodzielny instalator .deb z usługą Systemd.",
    packBuildBtn: "Zbuduj Pakiet Instalacyjny .deb",
    packBuilding: "Kompilowanie i paczkowanie...",
    packSuccess: "Pakiet Debian został pomyślnie wygenerowany w /pkg/spaceguard_1.0.0_amd64.deb",
    packInstructBtn: "Zobacz Instrukcję Repozytorium APT",

    // Containers Manager
    contTitle: "ZARZĄDCA KONTENERÓW DOCKER & PODMAN",
    contSubtitle: "Monitoruj silniki kontenerów, wiszące obrazy i odzyskuj pamięć warstw zapisywalnych.",
    contDockerTab: "Silnik Docker",
    contPodmanTab: "Silnik Podman",
    contPruneBtn: "Uruchom Engine Prune",
    contPruneSuccess: "Silnik wyczyszczony pomyślnie. Zwolniono {mb} MB.",
    contNoPrune: "Brak wiszących obrazów lub zatrzymanych kontenerów.",
    contImages: "Obrazy Kontenerowe",
    contContainers: "Kontenery",
    contDangling: "Wiszące (Dangling)",
    contRunning: "Uruchomione",
    contExited: "Zatrzymane",
    contSize: "Rozmiar",

    // Deep Scan Module
    scanTitle: "GŁĘBOKI SKAN DYSKU I AUDYT NA ŻYWO",
    scanSubtitle: "Skanuje niskopoziomowe rejestry dpkg, /var/lib/docker/overlay2, Podman oraz ręczne pobrania wget/curl.",
    scanBannerText: "Jeśli instalowałeś pakiety lub pobierałeś obrazy bezpośrednio w terminalu poza aplikacją, ten audyt na żywo natychmiast przeszukuje stan fizyczny.",
    scanStartBtn: "Uruchom Głęboki Skan Systemu",
    scanSimulateBtn: "Symuluj Instalację/Ubytek w Tle (+1.5-3.8 GB)",
    scanScanning: "Skanowanie fizycznych wolumenów...",
    scanStep1: "Analiza bazy instalacyjnej dpkg oraz bibliotek współdzielonych (.so)",
    scanStep2: "Mapowanie warstw `/var/lib/docker/overlay2` i wyszukiwanie wiszących obrazów",
    scanStep3: "Skanowanie rejestrów Podmana pod kątem zatrzymanych kontenerów i podów",
    scanStep4: "Wykrywanie ręcznych pobrań plików (wget/curl) w folderach `/home` i `/tmp`",
    scanStep5: "Obliczanie całkowitego narzutu pamięci cache APT i systemowego kosza (Trash)",
    scanCompleteMsg: "Głęboki skan zakończony! Stan fizyczny zsynchronizowany.",
    scanSector1: "1. Kontenery i Obrazy (Docker/Podman)",
    scanSector2: "2. Ciężkie Pakiety Niskiej Ważności",
    scanSector3: "3. Ręczne Pobrania (wget/curl)",
    scanSector4: "4. APT Cache i Śmieci Systemowe",
    scanPurgeBtn: "Odinstaluj",
    scanDeleteFileBtn: "Usuń Plik",
    scanEmptyBtn: "Opróżnij Cache i Kosz",
    scanReclaimedSession: "Dotychczas zwolniono w tej sesji:",

    // System Tray
    trayTitle: "SYSTEM TRAY SPACEGUARD",
    trayStatusNormal: "Stan Dysku Prawidłowy",
    trayStatusWarning: "Wysokie Zużycie Dysku",
    trayQuickClean: "Szybkie Czyszczenie (Cache & Kosz)",
    trayOpenApp: "Otwórz Pełny Panel SpaceGuard",

    // Interactive Treemap & Disk Space Map
    tabTreemap: "8. Interaktywna Mapa Dysku",
    treemapTitle: "INTERAKTYWNA MAPA PRZESTRZENI DYSKOWEJ I ZBIORÓW",
    treemapSubtitle: "Kompleksowe wizualne mapowanie WSZYSTKICH katalogów, aplikacji, kontenerów, plików pobranych i danych z USB zajmujących dysk.",
    treemapViewFolders: "Widok Katalogów Systemowych",
    treemapViewApps: "Widok Aplikacji i Zbiorów",
    treemapHoverTitle: "METRYKI ZAJĘTOŚCI DYSKU",
    treemapCreatedDate: "Data Utworzenia / Pojawienia się:",
    treemapUpdatedDate: "Data Ostatniej Modyfikacji:",
    treemapLocation: "Ścieżka:",
    treemapCategory: "Kategoria:",
    treemapRisk: "Poziom Ryzyka:",
    contextInspectGraph: "🔍 Analizuj Zależności w Grafie",
    contextQuickClean: "⚡ Szybkie Czyszczenie / Usuń",
    contextCopyPath: "📁 Kopiuj Ścieżkę do Schowka",
    contextSafeguard: "🛡️ Dodaj do Chronionych",
    contextDeepScan: "🧹 Skanuj Ten Zasób",
    brandingText: "Stworzone przez monx.one. Wszelkie prawa zastrzeżone na licencji Apache 2.0.",

    // Language Toggle
    langEn: "English",
    langPl: "Polski",
  }
};

export function t(key: keyof typeof dictionary['en'], lang: Language, params?: Record<string, string | number>): string {
  const dict = dictionary[lang] || dictionary['en'];
  let text = dict[key] || dictionary['en'][key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
