/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PackageInfo, DiskStatus, Recommendation, DockerImage, DockerContainer } from '../types';

// Raw base packages to initialize the database state
const INITIAL_PACKAGES: PackageInfo[] = [
  {
    name: 'metasploit-framework',
    version: '6.3.50-0kali1',
    installedSizeKb: 850000,
    actualSizeKb: 924000,
    description: 'Framework do testów penetracyjnych i exploitacji luk bezpieczeństwa.',
    section: 'net',
    dependencies: ['ruby', 'postgresql', 'libc6', 'libssl3', 'nmap'],
    reverseDependencies: [],
    sharedLibraries: ['libmsf.so', 'libcrypto.so'],
    status: 'installed',
    importance: 3,
    rollbackRisk: 'medium',
    isSystem: false,
    whyRecommend: 'Zajmuje bardzo dużo miejsca na dysku. Rzadko używany na stacjach developerskich lub serwerowych poza aktywnymi audytami.',
    installedAt: '2026-03-12T09:15:22.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-18T16:45:10.000Z',
    sourceUrl: 'apt-get install metasploit-framework',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/msfconsole', '/usr/bin/msfvenom', '/usr/share/metasploit-framework', '/etc/msfconsole.rc'],
    collaboratingWith: ['ruby', 'postgresql', 'libc6', 'libssl3', 'nmap']
  },
  {
    name: 'burpsuite',
    version: '2023.11.1-0kali1',
    installedSizeKb: 1200000,
    actualSizeKb: 1350000,
    description: 'Zintegrowana platforma do przeprowadzania testów bezpieczeństwa aplikacji webowych.',
    section: 'web',
    dependencies: ['openjdk-17-jre', 'libc6'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 2,
    rollbackRisk: 'low',
    isSystem: false,
    whyRecommend: 'Krytycznie duży pakiet Java. Jeśli testy webowe nie są aktualnie prowadzone, można go bezpiecznie przenieść lub usunąć.',
    installedAt: '2026-04-05T11:20:44.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-06-12T09:30:15.000Z',
    sourceUrl: 'apt-get install burpsuite',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/burpsuite', '/usr/share/burpsuite/burpsuite.jar', '/etc/burpsuite/config.xml'],
    collaboratingWith: ['openjdk-17-jre', 'libc6']
  },
  {
    name: 'wireshark',
    version: '4.2.2-1',
    installedSizeKb: 180000,
    actualSizeKb: 210000,
    description: 'Analizator protokołów sieciowych, potężne narzędzie do sniffowania pakietów.',
    section: 'net',
    dependencies: ['wireshark-common', 'qt6-base', 'libc6', 'libssl3'],
    reverseDependencies: [],
    sharedLibraries: ['libwireshark.so', 'libwiretap.so'],
    status: 'installed',
    importance: 4,
    rollbackRisk: 'low',
    isSystem: false,
    whyRecommend: 'Gromadzi lokalne dumpy i logi w pamięci podręcznej. Można go usunąć lub wyczyścić jego cache.',
    installedAt: '2026-05-10T14:55:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T06:12:00.000Z',
    sourceUrl: 'apt-get install wireshark',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/wireshark', '/usr/bin/tshark', '/usr/share/wireshark/manuf'],
    collaboratingWith: ['wireshark-common', 'libc6', 'libssl3']
  },
  {
    name: 'wireshark-common',
    version: '4.2.2-1',
    installedSizeKb: 45000,
    actualSizeKb: 52000,
    description: 'Wspólne biblioteki i narzędzia pomocnicze dla analizatora Wireshark.',
    section: 'net',
    dependencies: ['libc6', 'libssl3'],
    reverseDependencies: ['wireshark'],
    sharedLibraries: ['libwsutil.so'],
    status: 'installed',
    importance: 5,
    rollbackRisk: 'medium',
    isSystem: false,
    installedAt: '2026-05-10T14:53:10.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T06:12:00.000Z',
    sourceUrl: 'apt-get install wireshark-common',
    installMethod: 'apt',
    createdFiles: ['/usr/lib/x86_64-linux-gnu/libwsutil.so.12', '/usr/share/wireshark/profiles'],
    collaboratingWith: ['libc6', 'libssl3']
  },
  {
    name: 'nmap',
    version: '7.94+dfsg1-1kali1',
    installedSizeKb: 28000,
    actualSizeKb: 34000,
    description: 'Legendarne i wszechstronne narzędzie do skanowania sieci i audytu bezpieczeństwa.',
    section: 'net',
    dependencies: ['libc6', 'libssl3', 'python3'],
    reverseDependencies: ['metasploit-framework'],
    sharedLibraries: [],
    status: 'installed',
    importance: 5,
    rollbackRisk: 'low',
    isSystem: false,
    installedAt: '2026-01-20T10:15:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T06:50:00.000Z',
    sourceUrl: 'apt-get install nmap',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/nmap', '/usr/share/nmap/nmap-services', '/usr/share/nmap/nmap.xsl'],
    collaboratingWith: ['libc6', 'libssl3', 'python3']
  },
  {
    name: 'linux-image-6.1.0-15-amd64',
    version: '6.1.67-1',
    installedSizeKb: 320000,
    actualSizeKb: 320000,
    description: 'Obraz jądra Linux (stara wersja z poprzedniej aktualizacji systemu).',
    section: 'kernel',
    dependencies: [],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 1,
    rollbackRisk: 'medium',
    isSystem: false,
    whyRecommend: 'Nieużywane jądro systemowe z poprzedniej dystrybucji. Aktualnie system działa na stabilniejszym jądrze 6.1.0-18.',
    installedAt: '2025-11-12T16:00:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-04-18T10:00:00.000Z',
    sourceUrl: 'apt-get install linux-image-6.1.0-15-amd64',
    installMethod: 'apt',
    createdFiles: ['/boot/vmlinuz-6.1.0-15-amd64', '/boot/initrd.img-6.1.0-15-amd64', '/lib/modules/6.1.0-15-amd64/'],
    collaboratingWith: []
  },
  {
    name: 'linux-headers-6.1.0-15-amd64',
    version: '6.1.67-1',
    installedSizeKb: 140000,
    actualSizeKb: 140000,
    description: 'Nagłówki jądra Linux dla wersji 6.1.0-15 do kompilacji modułów out-of-tree.',
    section: 'devel',
    dependencies: [],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 1,
    rollbackRisk: 'none',
    isSystem: false,
    whyRecommend: 'Stare nagłówki jądra. Bezpieczne usunięcie, ponieważ system działa na nowszym jądrze.',
    installedAt: '2025-11-12T16:05:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2025-11-12T16:15:00.000Z',
    sourceUrl: 'apt-get install linux-headers-6.1.0-15-amd64',
    installMethod: 'apt',
    createdFiles: ['/usr/src/linux-headers-6.1.0-15-amd64/'],
    collaboratingWith: []
  },
  {
    name: 'openjdk-17-jre',
    version: '17.0.9+9-1',
    installedSizeKb: 310000,
    actualSizeKb: 345000,
    description: 'OpenJDK Java Runtime Environment - środowisko uruchomieniowe Java.',
    section: 'java',
    dependencies: ['libc6', 'libssl3'],
    reverseDependencies: ['burpsuite'],
    sharedLibraries: ['libjvm.so'],
    status: 'installed',
    importance: 4,
    rollbackRisk: 'medium',
    isSystem: false,
    installedAt: '2026-04-05T11:15:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-06-12T09:30:15.000Z',
    sourceUrl: 'apt-get install openjdk-17-jre',
    installMethod: 'apt',
    createdFiles: ['/usr/lib/jvm/java-17-openjdk-amd64/bin/java', '/usr/lib/jvm/java-17-openjdk-amd64/lib/libjvm.so'],
    collaboratingWith: ['libc6', 'libssl3']
  },
  {
    name: 'python3',
    version: '3.11.6-1',
    installedSizeKb: 18000,
    actualSizeKb: 21000,
    description: 'Interaktywny, obiektowy język programowania Python (wersja domyślna).',
    section: 'python',
    dependencies: ['libc6', 'libssl3'],
    reverseDependencies: ['nmap', 'sqlmap', 'scapy'],
    sharedLibraries: ['libpython3.11.so'],
    status: 'installed',
    importance: 8,
    rollbackRisk: 'high',
    isSystem: true,
    installedAt: '2025-09-10T08:00:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T07:10:00.000Z',
    sourceUrl: 'apt-get install python3',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/python3', '/usr/lib/python3.11/'],
    collaboratingWith: ['libc6', 'libssl3']
  },
  {
    name: 'sqlmap',
    version: '1.7.11-1',
    installedSizeKb: 55000,
    actualSizeKb: 65000,
    description: 'Automatyczne narzędzie do wykrywania i wykorzystywania podatności SQL Injection.',
    section: 'net',
    dependencies: ['python3'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 3,
    rollbackRisk: 'low',
    isSystem: false,
    whyRecommend: 'Duża baza sygnatur SQL Injection. Można zwolnić miejsce i sklonować ze źródła na żądanie.',
    installedAt: '2026-05-18T10:12:15.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-15T13:40:00.000Z',
    sourceUrl: 'apt-get install sqlmap',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/sqlmap', '/usr/share/sqlmap/'],
    collaboratingWith: ['python3', 'libc6']
  },
  {
    name: 'scapy',
    version: '2.5.0+dfsg-1',
    installedSizeKb: 12000,
    actualSizeKb: 14000,
    description: 'Potężne narzędzie do manipulacji i analizy pakietów sieciowych w języku Python.',
    section: 'python',
    dependencies: ['python3'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 4,
    rollbackRisk: 'none',
    isSystem: false,
    installedAt: '2026-05-22T16:30:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-02T11:15:00.000Z',
    sourceUrl: 'apt-get install python3-scapy',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/scapy', '/usr/lib/python3/dist-packages/scapy/'],
    collaboratingWith: ['python3', 'libc6']
  },
  {
    name: 'libc6',
    version: '2.37-12',
    installedSizeKb: 15000,
    actualSizeKb: 15500,
    description: 'Biblioteka GNU C: Współdzielone biblioteki systemowe i rdzeń Linux.',
    section: 'libs',
    dependencies: [],
    reverseDependencies: ['metasploit-framework', 'burpsuite', 'wireshark', 'wireshark-common', 'nmap', 'openjdk-17-jre', 'python3', 'libssl3', 'systemd', 'apt'],
    sharedLibraries: ['libc.so.6', 'libm.so.6', 'libpthread.so.0', 'librt.so.1'],
    status: 'installed',
    importance: 10,
    rollbackRisk: 'high',
    isSystem: true,
    installedAt: '2025-08-01T06:00:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T07:13:00.000Z',
    sourceUrl: 'apt-get install libc6',
    installMethod: 'apt',
    createdFiles: ['/lib/x86_64-linux-gnu/libc.so.6', '/lib/x86_64-linux-gnu/libm.so.6'],
    collaboratingWith: []
  },
  {
    name: 'libssl3',
    version: '3.0.12-1',
    installedSizeKb: 8500,
    actualSizeKb: 9000,
    description: 'Biblioteki współdzielone kryptografii i protokołu SSL/TLS dla OpenSSL.',
    section: 'libs',
    dependencies: ['libc6'],
    reverseDependencies: ['metasploit-framework', 'wireshark', 'wireshark-common', 'nmap', 'openjdk-17-jre', 'python3', 'apt'],
    sharedLibraries: ['libssl.so.3', 'libcrypto.so.3'],
    status: 'installed',
    importance: 10,
    rollbackRisk: 'high',
    isSystem: true,
    installedAt: '2025-08-01T06:01:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T07:13:00.000Z',
    sourceUrl: 'apt-get install libssl3',
    installMethod: 'apt',
    createdFiles: ['/usr/lib/x86_64-linux-gnu/libssl.so.3', '/usr/lib/x86_64-linux-gnu/libcrypto.so.3'],
    collaboratingWith: ['libc6']
  },
  {
    name: 'systemd',
    version: '254.5-1',
    installedSizeKb: 22000,
    actualSizeKb: 25000,
    description: 'Menedżer systemu i usług dla systemów operacyjnych Linux.',
    section: 'admin',
    dependencies: ['libc6'],
    reverseDependencies: [],
    sharedLibraries: ['libsystemd.so'],
    status: 'installed',
    importance: 10,
    rollbackRisk: 'high',
    isSystem: true,
    installedAt: '2025-08-01T06:00:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T07:13:00.000Z',
    sourceUrl: 'apt-get install systemd',
    installMethod: 'apt',
    createdFiles: ['/lib/systemd/systemd', '/usr/bin/systemctl'],
    collaboratingWith: ['libc6']
  },
  {
    name: 'apt',
    version: '2.6.1',
    installedSizeKb: 11000,
    actualSizeKb: 12000,
    description: 'Zaawansowany interfejs zarządzania pakietami (Advanced Package Tool).',
    section: 'admin',
    dependencies: ['libc6', 'libssl3'],
    reverseDependencies: [],
    sharedLibraries: ['libapt-pkg.so'],
    status: 'installed',
    importance: 10,
    rollbackRisk: 'high',
    isSystem: true,
    installedAt: '2025-08-01T06:02:00.000Z',
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T07:11:00.000Z',
    sourceUrl: 'apt-get install apt',
    installMethod: 'apt',
    createdFiles: ['/usr/bin/apt', '/usr/bin/apt-get', '/usr/lib/libapt-pkg.so.6.0'],
    collaboratingWith: ['libc6', 'libssl3']
  },
  {
    name: 'ghidra',
    version: '10.4-0kali1',
    installedSizeKb: 450000,
    actualSizeKb: 512000,
    description: 'Kompleksowy pakiet inżynierii wstecznej (reverse engineering) stworzony przez NSA.',
    section: 'devel',
    dependencies: ['openjdk-17-jre', 'libc6'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'available',
    importance: 2,
    rollbackRisk: 'low',
    isSystem: false,
    installedAt: '',
    installedBy: '',
    hasSudo: false,
    lastUsedAt: '',
    sourceUrl: 'apt-get install ghidra',
    installMethod: 'apt',
    createdFiles: [],
    collaboratingWith: []
  },
  {
    name: 'john',
    version: '1.9.0-jumbo-1-0kali1',
    installedSizeKb: 88000,
    actualSizeKb: 95000,
    description: 'John the Ripper - szybki, aktywny łamacz haseł i audytor zabezpieczeń haseł.',
    section: 'admin',
    dependencies: ['libc6', 'libssl3'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'available',
    importance: 3,
    rollbackRisk: 'none',
    isSystem: false,
    installedAt: '',
    installedBy: '',
    hasSudo: false,
    lastUsedAt: '',
    sourceUrl: 'apt-get install john',
    installMethod: 'apt',
    createdFiles: [],
    collaboratingWith: []
  },
  /* --- CUSTOM DOWNLOADS & FOOTPRINTS --- */
  {
    name: 'gophish-v0.12-custom',
    version: '0.12.0',
    installedSizeKb: 120000,
    actualSizeKb: 145000,
    description: 'Sklonowane narzędzie phishingowe i symulator kampanii, zainstalowane ze źródła ZIP.',
    section: 'phishing',
    dependencies: ['libc6', 'libssl3'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 1,
    rollbackRisk: 'none',
    isSystem: false,
    installedAt: '2026-04-10T11:20:00.000Z', // 3 months ago
    installedBy: 'operator',
    hasSudo: false,
    lastUsedAt: '2026-06-15T16:40:00.000Z',
    sourceUrl: 'https://github.com/gophish/gophish/releases/download/v0.12.0/gophish-v0.12.0-linux-64bit.zip',
    installMethod: 'zip-extract',
    createdFiles: [
      '/opt/gophish/gophish',
      '/opt/gophish/config.json',
      '/opt/gophish/templates/banner.html',
      '/opt/gophish/db/gophish.db'
    ],
    collaboratingWith: ['libc6', 'libssl3', 'postgresql'],
    isCustomFootprint: true,
    whyRecommend: 'Zainstalowano ręcznie ze źródła ZIP jako zwykły użytkownik. Duże pliki szablonów mailowych i baza SQLite zajmują nieużywane od miesiąca miejsce.'
  },
  {
    name: 'bin-analyzer-script',
    version: '1.0.0',
    installedSizeKb: 85000,
    actualSizeKb: 90000,
    description: 'Skrypt analityczny pobrany za pomocą curl, tworzący środowisko analizy nagłówków elf.',
    section: 'devel',
    dependencies: ['python3'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 2,
    rollbackRisk: 'low',
    isSystem: false,
    installedAt: '2026-05-15T09:12:00.000Z', // 2 months ago
    installedBy: 'root',
    hasSudo: true,
    lastUsedAt: '2026-07-19T05:10:00.000Z', // today
    sourceUrl: 'https://raw.githubusercontent.com/radareorg/radare2/master/sys/install.sh',
    installMethod: 'curl',
    createdFiles: [
      '/usr/local/bin/r2',
      '/usr/local/lib/libr2.so',
      '/usr/local/share/radare2/fortunes.txt'
    ],
    collaboratingWith: ['python3', 'libc6'],
    isCustomFootprint: true,
    whyRecommend: 'Pobrane i uruchomione bezpośrednio z curl jako ROOT. Pozostawiło binaria w /usr/local/bin. Wymaga audytu.'
  },
  {
    name: 'sherlock-username-search',
    version: '0.14.3',
    installedSizeKb: 40000,
    actualSizeKb: 45000,
    description: 'Narzędzie Sherlock do wyszukiwania kont użytkowników w mediach społecznościowych, pobrane bezpośrednio.',
    section: 'recon',
    dependencies: ['python3'],
    reverseDependencies: [],
    sharedLibraries: [],
    status: 'installed',
    importance: 3,
    rollbackRisk: 'none',
    isSystem: false,
    installedAt: '2026-06-25T14:55:00.000Z', // ~3 weeks ago
    installedBy: 'kali',
    hasSudo: false,
    lastUsedAt: '2026-07-15T18:30:00.000Z',
    sourceUrl: 'https://github.com/sherlock-project/sherlock/archive/master.zip',
    installMethod: 'wget',
    createdFiles: [
      '/home/kali/sherlock/sherlock.py',
      '/home/kali/sherlock/requirements.txt',
      '/home/kali/sherlock/sites.json'
    ],
    collaboratingWith: ['python3', 'nmap'],
    isCustomFootprint: true,
    whyRecommend: 'Pobrane paczką ZIP za pomocą wget. Zawiera skrypty pythonowe oraz bazę JSON.'
  }
];

const INITIAL_DOCKER_IMAGES: DockerImage[] = [
  { id: 'd12c8b73', repository: 'kali-linux-headless', tag: 'latest', sizeMb: 1850, created: '2026-06-10T14:22:00.000Z', isDangling: false, engine: 'docker' },
  { id: 'f8101da1', repository: 'postgres', tag: '15-alpine', sizeMb: 350, created: '2026-05-18T10:11:00.000Z', isDangling: false, engine: 'docker' },
  { id: 'a214bb32', repository: 'ubuntu', tag: 'latest', sizeMb: 78, created: '2026-07-01T08:00:00.000Z', isDangling: false, engine: 'docker' },
  { id: '4d88e89f', repository: '<none>', tag: '<none>', sizeMb: 920, created: '2026-07-15T09:30:00.000Z', isDangling: true, engine: 'docker' },
  { id: '2d113da2', repository: 'metasploit-helper', tag: 'latest', sizeMb: 1100, created: '2026-07-12T15:20:00.000Z', isDangling: false, engine: 'docker' }
];

const INITIAL_DOCKER_CONTAINERS: DockerContainer[] = [
  { id: 'c1b2d3e4f5a6', name: 'db_postgres', image: 'postgres:15-alpine', status: 'running', sizeMb: 120, engine: 'docker' },
  { id: 'a1b2c3d4e5f6', name: 'msf_interactive', image: 'metasploit-helper:latest', status: 'exited', sizeMb: 850, engine: 'docker' },
  { id: 'e5f6a1b2c3d4', name: 'temp_ubuntu', image: 'ubuntu:latest', status: 'created', sizeMb: 15, engine: 'docker' }
];

const INITIAL_PODMAN_IMAGES: DockerImage[] = [
  { id: 'e32a412b', repository: 'alpine', tag: 'latest', sizeMb: 8, created: '2026-07-11T12:00:00.000Z', isDangling: false, engine: 'podman' },
  { id: '5b810da1', repository: 'nginx', tag: 'alpine', sizeMb: 45, created: '2026-06-20T09:15:00.000Z', isDangling: false, engine: 'podman' },
  { id: 'c2111bb9', repository: '<none>', tag: '<none>', sizeMb: 540, created: '2026-07-18T14:30:00.000Z', isDangling: true, engine: 'podman' }
];

const INITIAL_PODMAN_CONTAINERS: DockerContainer[] = [
  { id: 'p1b2d3e4f5a6', name: 'web_nginx', image: 'nginx:alpine', status: 'running', sizeMb: 12, engine: 'podman' },
  { id: 'p9b8c7d6e5f4', name: 'test_env', image: 'alpine:latest', status: 'exited', sizeMb: 320, engine: 'podman' }
];

const INITIAL_DISK: DiskStatus = {
  totalGb: 60.0,
  usedGb: 53.4, // Over 89% filled! Tray indicator should turn crimson (warning >85%)
  freeGb: 6.6,
  trashSizeMb: 1240, // 1.2 GB in system trash
  cacheSizeMb: 2450  // 2.45 GB in /var/cache/apt/archives
};

class SpaceGuardSimulator {
  private packages: PackageInfo[] = [];
  private dockerImages: DockerImage[] = [];
  private dockerContainers: DockerContainer[] = [];
  private podmanImages: DockerImage[] = [];
  private podmanContainers: DockerContainer[] = [];
  private disk: DiskStatus = { ...INITIAL_DISK };
  private commandHistory: string[] = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    // Deep clone raw state
    this.packages = JSON.parse(JSON.stringify(INITIAL_PACKAGES));
    this.dockerImages = JSON.parse(JSON.stringify(INITIAL_DOCKER_IMAGES));
    this.dockerContainers = JSON.parse(JSON.stringify(INITIAL_DOCKER_CONTAINERS));
    this.podmanImages = JSON.parse(JSON.stringify(INITIAL_PODMAN_IMAGES));
    this.podmanContainers = JSON.parse(JSON.stringify(INITIAL_PODMAN_CONTAINERS));
    this.disk = { ...INITIAL_DISK };
    this.commandHistory = [];
    this.recalculateDependencies();
  }

  private recalculateDependencies(): void {
    // Re-verify forward and reverse dependencies to ensure graph integrity
    for (const pkg of this.packages) {
      pkg.reverseDependencies = [];
    }

    for (const pkg of this.packages) {
      if (pkg.status === 'installed') {
        for (const depName of pkg.dependencies) {
          const dep = this.packages.find(p => p.name === depName);
          if (dep && !dep.reverseDependencies.includes(pkg.name)) {
            dep.reverseDependencies.push(pkg.name);
          }
        }
      }
    }
    this.recalculateDiskUsage();
  }

  private recalculateDiskUsage(): void {
    // Base size is 39.3 GB (system core filesystem + logs etc)
    let installedPackagesSizeKb = 0;
    for (const pkg of this.packages) {
      if (pkg.status === 'installed') {
        installedPackagesSizeKb += pkg.actualSizeKb;
      }
    }

    // Docker and Podman size calculations
    const dockerImagesMb = this.dockerImages.reduce((sum, img) => sum + img.sizeMb, 0);
    const dockerContainersMb = this.dockerContainers.reduce((sum, c) => sum + c.sizeMb, 0);
    const dockerTotalMb = dockerImagesMb + dockerContainersMb;

    const podmanImagesMb = this.podmanImages.reduce((sum, img) => sum + img.sizeMb, 0);
    const podmanContainersMb = this.podmanContainers.reduce((sum, c) => sum + c.sizeMb, 0);
    const podmanTotalMb = podmanImagesMb + podmanContainersMb;

    this.disk.dockerSizeMb = parseFloat(dockerTotalMb.toFixed(1));
    this.disk.podmanSizeMb = parseFloat(podmanTotalMb.toFixed(1));

    const trashGb = this.disk.trashSizeMb / 1024;
    const cacheGb = this.disk.cacheSizeMb / 1024;
    const packagesGb = installedPackagesSizeKb / (1024 * 1024);
    const dockerGb = dockerTotalMb / 1024;
    const podmanGb = podmanTotalMb / 1024;
    
    // Total used calculation (base is lowered to keep total consistent with INITIAL_DISK)
    this.disk.usedGb = parseFloat((39.3 + trashGb + cacheGb + packagesGb + dockerGb + podmanGb).toFixed(2));
    this.disk.freeGb = parseFloat((this.disk.totalGb - this.disk.usedGb).toFixed(2));
    if (this.disk.freeGb < 0) {
      this.disk.freeGb = 0;
    }
  }

  public getDockerImages(): DockerImage[] {
    return this.dockerImages;
  }

  public getDockerContainers(): DockerContainer[] {
    return this.dockerContainers;
  }

  public getPodmanImages(): DockerImage[] {
    return this.podmanImages;
  }

  public getPodmanContainers(): DockerContainer[] {
    return this.podmanContainers;
  }

  public removeDockerImage(id: string): boolean {
    const idx = this.dockerImages.findIndex(img => img.id === id);
    if (idx !== -1) {
      this.dockerImages.splice(idx, 1);
      this.recalculateDiskUsage();
      return true;
    }
    return false;
  }

  public removeDockerContainer(id: string): boolean {
    const idx = this.dockerContainers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.dockerContainers.splice(idx, 1);
      this.recalculateDiskUsage();
      return true;
    }
    return false;
  }

  public removePodmanImage(id: string): boolean {
    const idx = this.podmanImages.findIndex(img => img.id === id);
    if (idx !== -1) {
      this.podmanImages.splice(idx, 1);
      this.recalculateDiskUsage();
      return true;
    }
    return false;
  }

  public removePodmanContainer(id: string): boolean {
    const idx = this.podmanContainers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.podmanContainers.splice(idx, 1);
      this.recalculateDiskUsage();
      return true;
    }
    return false;
  }

  public pruneDocker(): { freedMb: number; deletedContainers: string[]; deletedImages: string[] } {
    const deletedContainers: string[] = [];
    const deletedImages: string[] = [];
    let freedMb = 0;

    const exited = this.dockerContainers.filter(c => c.status === 'exited');
    exited.forEach(c => {
      deletedContainers.push(`${c.name} (${c.id})`);
      freedMb += c.sizeMb;
    });
    this.dockerContainers = this.dockerContainers.filter(c => c.status !== 'exited');

    const dangling = this.dockerImages.filter(img => img.isDangling);
    dangling.forEach(img => {
      deletedImages.push(`<none> (${img.id})`);
      freedMb += img.sizeMb;
    });
    this.dockerImages = this.dockerImages.filter(img => !img.isDangling);

    this.recalculateDiskUsage();
    return { freedMb, deletedContainers, deletedImages };
  }

  public prunePodman(): { freedMb: number; deletedContainers: string[]; deletedImages: string[] } {
    const deletedContainers: string[] = [];
    const deletedImages: string[] = [];
    let freedMb = 0;

    const exited = this.podmanContainers.filter(c => c.status === 'exited');
    exited.forEach(c => {
      deletedContainers.push(`${c.name} (${c.id})`);
      freedMb += c.sizeMb;
    });
    this.podmanContainers = this.podmanContainers.filter(c => c.status !== 'exited');

    const dangling = this.podmanImages.filter(img => img.isDangling);
    dangling.forEach(img => {
      deletedImages.push(`<none> (${img.id})`);
      freedMb += img.sizeMb;
    });
    this.podmanImages = this.podmanImages.filter(img => !img.isDangling);

    this.recalculateDiskUsage();
    return { freedMb, deletedContainers, deletedImages };
  }

  public getPackages(): PackageInfo[] {
    return this.packages;
  }

  public getDiskStatus(): DiskStatus {
    return this.disk;
  }

  public simulateExternalInstallation(): { type: string; name: string; sizeMb: number } {
    const r = Math.random();
    if (r < 0.33) {
      const names = ['kali-linux-large', 'sec-tools-meta', 'ghidra-bundle'];
      const chosen = names[Math.floor(Math.random() * names.length)];
      
      let pkg = this.getPackage(chosen);
      if (!pkg) {
        pkg = {
          name: chosen,
          version: '5.2.1-external',
          installedSizeKb: 3400 * 1024,
          actualSizeKb: 3850 * 1024,
          description: 'Metapakiet Kali Linux zainstalowany zdalnie poza standardową telemetrią SpaceGuard.',
          section: 'metapackages',
          dependencies: ['libc6'],
          reverseDependencies: [],
          sharedLibraries: [],
          status: 'installed',
          importance: 2,
          rollbackRisk: 'low',
          isSystem: false,
          installedAt: new Date().toISOString(),
          installedBy: 'root',
          hasSudo: true,
          lastUsedAt: new Date().toISOString(),
          installMethod: 'apt',
          sourceUrl: 'apt-get install ' + chosen,
          createdFiles: [`/usr/share/${chosen}`, `/var/lib/${chosen}`],
          collaboratingWith: ['libc6']
        };
        this.packages.push(pkg);
      } else {
        pkg.status = 'installed';
        pkg.actualSizeKb = 3850 * 1024;
      }
      this.recalculateDependencies();
      return { type: 'Pakiet APT', name: chosen, sizeMb: 3850 };
    } else if (r < 0.66) {
      const imageId = 'e' + Math.random().toString(16).substring(2, 9);
      const newImg = {
        id: imageId,
        repository: '<none>',
        tag: '<none>',
        sizeMb: 1950,
        created: new Date().toISOString(),
        isDangling: true,
        engine: 'docker' as const
      };
      this.dockerImages.push(newImg);
      this.recalculateDiskUsage();
      return { type: 'Obraz Docker (Dangling)', name: `<none> (${imageId})`, sizeMb: 1950 };
    } else {
      const downloadName = 'malware-sample-pack.zip';
      const sizeMb = 1450;
      this.addCustomDownload({
        name: downloadName,
        sizeMb: sizeMb,
        url: 'https://security-repos.com/samples/' + downloadName,
        installer: 'kali',
        hasSudo: false,
        method: 'wget',
        createdFiles: [`/home/kali/Downloads/${downloadName}`],
        collaboratingWith: []
      });
      return { type: 'Pobrany Plik (Wget)', name: downloadName, sizeMb: sizeMb };
    }
  }

  public getPackage(name: string): PackageInfo | undefined {
    return this.packages.find(p => p.name.toLowerCase() === name.toLowerCase());
  }

  public emptyTrash(): void {
    this.disk.trashSizeMb = 0;
    this.recalculateDiskUsage();
  }

  public clearAptCache(): void {
    this.disk.cacheSizeMb = 0;
    this.recalculateDiskUsage();
  }

  public installPackage(
    name: string,
    installer = 'root',
    hasSudo = true,
    method: 'apt' | 'curl' | 'wget' | 'zip-extract' | 'installer-script' = 'apt',
    sourceUrl = ''
  ): boolean {
    const pkg = this.getPackage(name);
    if (pkg && pkg.status !== 'installed') {
      pkg.status = 'installed';
      pkg.installedAt = new Date().toISOString();
      pkg.installedBy = installer;
      pkg.hasSudo = hasSudo;
      pkg.lastUsedAt = new Date().toISOString();
      pkg.installMethod = method;
      pkg.sourceUrl = sourceUrl || `apt-get install ${name}`;
      pkg.createdFiles = pkg.createdFiles && pkg.createdFiles.length > 0 
        ? pkg.createdFiles 
        : [`/usr/bin/${name}`, `/usr/share/doc/${name}`];
      pkg.collaboratingWith = pkg.collaboratingWith && pkg.collaboratingWith.length > 0 
        ? pkg.collaboratingWith 
        : [...pkg.dependencies];
      this.recalculateDependencies();
      return true;
    }
    return false;
  }

  public addCustomDownload(params: {
    name: string;
    sizeMb: number;
    url: string;
    installer: string;
    hasSudo: boolean;
    method: 'wget' | 'curl' | 'zip-extract' | 'installer-script';
    createdFiles?: string[];
    collaboratingWith?: string[];
  }): PackageInfo {
    const name = params.name.trim();
    const sizeKb = params.sizeMb * 1024;
    
    let existing = this.getPackage(name);
    if (existing) {
      existing.status = 'installed';
      existing.actualSizeKb = sizeKb;
      existing.installedSizeKb = Math.round(sizeKb * 0.9);
      existing.installedAt = new Date().toISOString();
      existing.installedBy = params.installer;
      existing.hasSudo = params.hasSudo;
      existing.lastUsedAt = new Date().toISOString();
      existing.sourceUrl = params.url;
      existing.installMethod = params.method;
      if (params.createdFiles) existing.createdFiles = params.createdFiles;
      if (params.collaboratingWith) existing.collaboratingWith = params.collaboratingWith;
      this.recalculateDependencies();
      return existing;
    }

    const newPkg: PackageInfo = {
      name,
      version: '1.0.0-custom',
      installedSizeKb: Math.round(sizeKb * 0.9),
      actualSizeKb: sizeKb,
      description: `Zewnętrzny zasób pobrany przez ${params.method} ze zdalnego repozytorium.`,
      section: 'downloads',
      dependencies: ['libc6'],
      reverseDependencies: [],
      sharedLibraries: [],
      status: 'installed',
      importance: 1,
      rollbackRisk: 'none',
      isSystem: false,
      installedAt: new Date().toISOString(),
      installedBy: params.installer,
      hasSudo: params.hasSudo,
      lastUsedAt: new Date().toISOString(),
      sourceUrl: params.url,
      installMethod: params.method,
      createdFiles: params.createdFiles || [
        `/home/${params.installer}/Downloads/${name}`,
        `/home/${params.installer}/Downloads/${name}.log`
      ],
      collaboratingWith: params.collaboratingWith || ['libc6', 'libssl3'],
      isCustomFootprint: true,
      whyRecommend: `Ręcznie zainstalowane pliki za pomocą ${params.method}. Nie podlegają standardowej kontroli apt.`
    };

    this.packages.push(newPkg);
    this.recalculateDependencies();
    return newPkg;
  }

  public removePackage(name: string): { success: boolean; freedMb: number; reason?: string } {
    const pkg = this.getPackage(name);
    if (!pkg) {
      return { success: false, freedMb: 0, reason: 'Pakiet nie istnieje.' };
    }
    if (pkg.status !== 'installed') {
      return { success: false, freedMb: 0, reason: 'Pakiet nie jest zainstalowany.' };
    }
    if (pkg.isSystem) {
      return { success: false, freedMb: 0, reason: `BŁĄD: Pakiet '${name}' jest oznaczony jako krytyczny dla systemu operacyjnego.` };
    }
    
    // Check for reverse dependencies
    const activeRevDeps = pkg.reverseDependencies.filter(rdName => {
      const rd = this.getPackage(rdName);
      return rd && rd.status === 'installed';
    });

    if (activeRevDeps.length > 0) {
      return { 
        success: false, 
        freedMb: 0, 
        reason: `BŁĄD: Zależności wsteczne uniemożliwiają usunięcie. Pakiety wymagające '${name}': ${activeRevDeps.join(', ')}` 
      };
    }

    pkg.status = 'available';
    const freedMb = parseFloat((pkg.actualSizeKb / 1024).toFixed(1));
    this.recalculateDependencies();
    return { success: true, freedMb };
  }

  // Generates SpaceGuard Recommendations to free up to Target Space (in GB)
  public generateRecommendations(targetGb: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Target freed size in MB
    const targetMb = targetGb * 1024;
    let accumulatedFreedMb = 0;

    // 1. Suggest emptying trash and cache first
    if (this.disk.trashSizeMb > 0) {
      recommendations.push({
        packageName: 'System Trash (Kosz systemowy)',
        spaceSavedMb: this.disk.trashSizeMb,
        why: 'Wyrzucone pliki w domowych katalogach użytkowników zajmują zbędne miejsce.',
        impact: 'Wyczyszczenie kosza usuwa pliki permanentnie.',
        rollback: 'Brak (pliki usunięte bezpowrotnie, ryzyko zerowe).',
        risk: 'none'
      });
      accumulatedFreedMb += this.disk.trashSizeMb;
    }

    if (this.disk.cacheSizeMb > 0 && accumulatedFreedMb < targetMb) {
      recommendations.push({
        packageName: 'APT Archives Cache (/var/cache/apt)',
        spaceSavedMb: this.disk.cacheSizeMb,
        why: 'Archiwa .deb pobrane przy wcześniejszych aktualizacjach systemowych APT.',
        impact: 'Zwolnienie pamięci podręcznej instalatora. APT pobierze pliki ponownie z mirrorów w razie reinstallu.',
        rollback: 'Automatyczne ponowne pobranie przez apt-get install --reinstall.',
        risk: 'none'
      });
      accumulatedFreedMb += this.disk.cacheSizeMb;
    }

    // Docker cleanup recommendation
    const exitedDocker = this.dockerContainers.filter(c => c.status === 'exited');
    const danglingDocker = this.dockerImages.filter(img => img.isDangling);
    const dockerPruneMb = exitedDocker.reduce((sum, c) => sum + c.sizeMb, 0) + danglingDocker.reduce((sum, img) => sum + img.sizeMb, 0);
    if (dockerPruneMb > 0 && accumulatedFreedMb < targetMb) {
      recommendations.push({
        packageName: 'Docker Prune (Zbędne obrazy/kontenery)',
        spaceSavedMb: dockerPruneMb,
        why: `Nieużywane warstwy wiszące (dangling) oraz zatrzymane kontenery Docker (${exitedDocker.map(c => c.name).join(', ') || 'brak'}).`,
        impact: 'Usunięcie osieroconych warstw i nieużywanych kontenerów w celu zwolnienia miejsca.',
        rollback: 'Brak (usunięte zasoby można pobrać ponownie przez docker pull/run).',
        risk: 'low'
      });
      accumulatedFreedMb += dockerPruneMb;
    }

    // Podman cleanup recommendation
    const exitedPodman = this.podmanContainers.filter(c => c.status === 'exited');
    const danglingPodman = this.podmanImages.filter(img => img.isDangling);
    const podmanPruneMb = exitedPodman.reduce((sum, c) => sum + c.sizeMb, 0) + danglingPodman.reduce((sum, img) => sum + img.sizeMb, 0);
    if (podmanPruneMb > 0 && accumulatedFreedMb < targetMb) {
      recommendations.push({
        packageName: 'Podman Prune (Zbędne obrazy/kontenery)',
        spaceSavedMb: podmanPruneMb,
        why: `Nieużywane warstwy wiszące (dangling) oraz zatrzymane kontenery Podmana (${exitedPodman.map(c => c.name).join(', ') || 'brak'}).`,
        impact: 'Usunięcie osieroconych warstw i nieużywanych kontenerów Podmana.',
        rollback: 'Brak (usunięte zasoby można pobrać ponownie przez podman pull/run).',
        risk: 'low'
      });
      accumulatedFreedMb += podmanPruneMb;
    }

    // Sort installed packages by scoring: lowest importance first
    const candidates = this.packages
      .filter(p => p.status === 'installed' && !p.isSystem)
      .sort((a, b) => {
        // Core metrics: importance score asc, then actual size desc
        if (a.importance !== b.importance) {
          return a.importance - b.importance;
        }
        return b.actualSizeKb - a.actualSizeKb;
      });

    for (const pkg of candidates) {
      if (accumulatedFreedMb >= targetMb) {
        break;
      }

      // Check if deleting this package is blocked by some active reverse dependencies
      const activeDeps = pkg.reverseDependencies.filter(rdName => {
        const rd = this.getPackage(rdName);
        return rd && rd.status === 'installed';
      });

      if (activeDeps.length > 0) {
        continue; // Cannot easily recommend without cascade deletion (too risky)
      }

      const spaceMb = parseFloat((pkg.actualSizeKb / 1024).toFixed(1));
      let impactText = 'Usunięcie narzędzia. Konfiguracja użytkownika zostanie zachowana (wyłącznie usuwanie plików binarnych).';
      let rollbackText = `sudo apt-get install ${pkg.name}`;

      if (pkg.section === 'kernel') {
        impactText = 'Usunięcie nieaktywnego jądra systemu operacyjnego. Zmniejsza ilość pozycji w menu rozruchowym GRUB.';
        rollbackText = `sudo apt-get install ${pkg.name} && update-grub`;
      }

      recommendations.push({
        packageName: pkg.name,
        spaceSavedMb: spaceMb,
        why: pkg.whyRecommend || 'Pakiet o niskiej istotności systemowej i relatywnie dużym rozmiarze.',
        impact: impactText,
        rollback: rollbackText,
        risk: pkg.rollbackRisk
      });

      accumulatedFreedMb += spaceMb;
    }

    return recommendations;
  }

  // Executing interactive commands inside our CLI simulator
  public executeCLI(input: string): string {
    const rawArgs = input.trim().split(/\s+/);
    if (rawArgs.length === 0 || rawArgs[0] === '') {
      return '';
    }

    let isSudo = rawArgs[0] === 'sudo';
    let args = [...rawArgs];
    if (args[0] === 'sudo') {
      args.shift();
    }

    // Native utilities like apt, apt-get, curl, wget
    const firstWord = args[0] ? args[0].toLowerCase() : '';

    if (firstWord === 'apt' || firstWord === 'apt-get') {
      const action = args[1] ? args[1].toLowerCase() : '';
      const targetPkgName = args[2] ? args[2].trim() : '';

      if (!action) {
        return `apt 2.6.1 (amd64)
Użycie: apt polecenie [opcje]
Najważniejsze polecenia:
  install - instalacja nowego pakietu
  remove  - usunięcie pakietu`;
      }

      if (action === 'install') {
        if (!targetPkgName) {
          return `E: Musisz podać nazwę pakietu do zainstalowania.`;
        }
        const pkg = this.getPackage(targetPkgName);
        if (!pkg) {
          return `E: Nie udało się odnaleźć pakietu '${targetPkgName}' w bazach dystrybucyjnych APT.`;
        }
        if (pkg.status === 'installed') {
          return `Pakiet '${targetPkgName}' jest już w najnowszej wersji (${pkg.version}).
0 aktualizowanych, 0 nowo instalowanych, 0 do usunięcia.`;
        }

        const installer = isSudo ? 'root' : 'kali';
        const success = this.installPackage(targetPkgName, installer, isSudo, 'apt', `apt-get install ${targetPkgName}`);
        if (success) {
          return `Czytanie list pakietów... Gotowe
Budowanie drzewa zależności... Gotowe
Następujące NOWE pakiety zostaną zainstalowane:
  ${targetPkgName} (${(pkg.actualSizeKb/1024).toFixed(1)} MB)
Pobieranie paczek... Gotowe.
Rozpakowywanie ${targetPkgName} (${pkg.version})...
Konfigurowanie pakietu ${targetPkgName}... Gotowe.

[SpaceGuard Monitor Telemetryczny Intercept]
- REJESTRACJA WYDARZENIA: Instalacja APT
- Pakiet: ${targetPkgName} (+${(pkg.actualSizeKb/1024).toFixed(1)} MB)
- Użytkownik wykonujący: ${installer}
- Prawa administratora (sudo): ${isSudo ? 'TAK' : 'NIE'}
- Sygnatura czasowa: ${new Date().toLocaleString()}
- Powiązane biblioteki/aplikacje: ${pkg.collaboratingWith?.join(', ') || 'brak'}
Zapisano pomyślnie w systemowej bazie śledzenia śladów.`;
        }
        return `E: Instalacja pakietu '${targetPkgName}' nie powiodła się.`;
      }

      if (action === 'remove' || action === 'purge') {
        if (!targetPkgName) {
          return `E: Musisz podać nazwę pakietu do usunięcia.`;
        }
        const res = this.removePackage(targetPkgName);
        if (res.success) {
          return `Czytanie list pakietów... Gotowe
Budowanie drzewa zależności... Gotowe
Następujące pakiety zostaną USUNIĘTE:
  ${targetPkgName}*
Wykonanie dpkg --purge dla ${targetPkgName}... Gotowe.
Zwolniono: ${res.freedMb} MB miejsca na dysku.

[SpaceGuard Monitor Telemetryczny Intercept]
- REJESTRACJA WYDARZENIA: Usunięcie APT
- Element: ${targetPkgName} (-${res.freedMb} MB)
- Użytkownik wykonujący: ${isSudo ? 'root' : 'kali'}
Wydarzenie odnotowane. Dane o ubytkach zsynchronizowane.`;
        } else {
          return `E: Nie można usunąć pakietu '${targetPkgName}'. Powód: ${res.reason}`;
        }
      }

      return `E: Nieobsługiwane polecenie APT w symulatorze: '${action}'. Obsługiwane to 'install' oraz 'remove'.`;
    }

    if (firstWord === 'wget' || firstWord === 'curl') {
      let url = '';
      if (firstWord === 'wget') {
        // Find argument that starts with http or https
        const urlArg = args.find(arg => arg.startsWith('http://') || arg.startsWith('https://'));
        url = urlArg || 'https://raw.githubusercontent.com/recon-tools/spider/master/release.zip';
      } else { // curl
        const urlArg = args.find(arg => arg.startsWith('http://') || arg.startsWith('https://'));
        url = urlArg || 'https://evil-scripts.ru/miner/setup.sh';
      }

      // Parse a nice name from URL
      let name = url.substring(url.lastIndexOf('/') + 1);
      if (!name || name.trim() === '' || name.includes('?') || name === 'bash' || name === 'sh') {
        name = firstWord === 'wget' ? 'downloaded-archive.zip' : 'setup-script.sh';
      }

      // Simulated random size
      const randomSizeMb = Math.floor(Math.random() * 80) + 15; // 15 - 95 MB
      const installer = isSudo ? 'root' : 'kali';
      
      const createdFiles = firstWord === 'wget' 
        ? [`/home/${installer}/Downloads/${name}`, `/home/${installer}/Downloads/${name}.extracted/`]
        : [`/tmp/${name}`, `/usr/local/bin/${name.replace('.sh', '')}`];

      const customPkg = this.addCustomDownload({
        name: `${name}-custom-footprint`,
        sizeMb: randomSizeMb,
        url: url,
        installer: installer,
        hasSudo: isSudo,
        method: firstWord,
        createdFiles,
        collaboratingWith: firstWord === 'wget' ? ['libc6', 'libssl3'] : ['python3', 'libc6']
      });

      const todayStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

      if (firstWord === 'wget') {
        return `--${todayStr}--  ${url}
Translacja ${url.split('/')[2] || 'serwer-zdalny'}... 198.51.100.12
Łączenie z serwerem... Połączono.
Żądanie HTTP wysłane, oczekiwanie na odpowiedź... 200 OK
Długość: ${randomSizeMb * 1024 * 1024} (${randomSizeMb}M) [application/octet-stream]
Zapisywanie do: ‘${createdFiles[0]}’

     0K .......... .......... .......... .......... ..........  12% 1.4M
 30720K .......... .......... .......... .......... ..........  85% 9.2M
 51200K .......... .......... .......... .......... .......... 100% 15M=0.8s

${todayStr} (${(randomSizeMb / 0.8).toFixed(1)} MB/s) - ‘${createdFiles[0]}’ zapisano [${randomSizeMb * 1024 * 1024}]

[SpaceGuard Monitor] WYKRYTO UBYTEK MIEJSCA DYSKOWEGO (WGET)!
- Zarejestrowano pobrany plik: ${name}-custom-footprint (+${randomSizeMb} MB)
- Ścieżka na dysku: ${createdFiles[0]}
- Pobrano z adresu URL: ${url}
- Pobierający użytkownik: ${installer} (Prawa sudo: ${isSudo ? 'TAK' : 'NIE'})
- Status: Pomyślnie zmapowany w rejestrze pozapakietowym SpaceGuard.`;
      } else { // curl
        return `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  ${randomSizeMb}M  100  ${randomSizeMb}M    0     0  12.4M      0 --:--:--  0:00:03 --:--:-- 14.5M
Uruchamianie skryptu instalacyjnego ${name}...
[+] Sprawdzanie bibliotek współdzielonych... OK
[+] Kopiowanie binariów do katalogów systemowych... OK

[SpaceGuard Monitor] WYKRYTO UBYTEK MIEJSCA DYSKOWEGO (CURL PIPE BASH)!
- Zarejestrowano element: ${name}-custom-footprint (+${randomSizeMb} MB)
- Zainfekowane/utworzone pliki: ${createdFiles.join(', ')}
- Wywołany skrypt: ${url}
- Użytkownik: ${installer} (Prawa sudo: ${isSudo ? 'TAK' : 'NIE'})
- Kooperujące moduły: python3, libc6
Element został trwale oznaczony w grafie i ujęty w statystykach oszczędnościowych.`;
      }
    }

    if (firstWord === 'docker' || firstWord === 'podman') {
      const isDocker = firstWord === 'docker';
      const action = args[1] ? args[1].toLowerCase() : '';

      if (action === 'images') {
        const images = isDocker ? this.dockerImages : this.podmanImages;
        if (images.length === 0) {
          return `REPOSITORY               TAG         IMAGE ID    CREATED       SIZE\n`;
        }
        let out = `${'REPOSITORY'.padEnd(24)} | ${'TAG'.padEnd(10)} | ${'IMAGE ID'.padEnd(10)} | ${'CREATED'.padEnd(14)} | SIZE\n`;
        out += `-`.repeat(75) + `\n`;
        images.forEach(img => {
          out += `${img.repository.padEnd(24)} | ${img.tag.padEnd(10)} | ${img.id.padEnd(10)} | 2 weeks ago   | ${img.sizeMb} MB\n`;
        });
        return out;
      }

      if (action === 'ps') {
        const showAll = args.includes('-a') || args.includes('--all');
        let containers = isDocker ? this.dockerContainers : this.podmanContainers;
        if (!showAll) {
          containers = containers.filter(c => c.status === 'running');
        }
        if (containers.length === 0) {
          return `CONTAINER ID             IMAGE                  STATUS      NAMES       WRITABLE LAYER\n`;
        }
        let out = `${'CONTAINER ID'.padEnd(15)} | ${'IMAGE'.padEnd(22)} | ${'STATUS'.padEnd(10)} | ${'NAMES'.padEnd(15)} | WRITABLE LAYER\n`;
        out += `-`.repeat(80) + `\n`;
        containers.forEach(c => {
          out += `${c.id.padEnd(15)} | ${c.image.padEnd(22)} | ${c.status.padEnd(10)} | ${c.name.padEnd(15)} | ${c.sizeMb} MB\n`;
        });
        return out;
      }

      if (action === 'rmi') {
        const id = args[2];
        if (!id) {
          return `Error: No image ID specified.`;
        }
        const success = isDocker ? this.removeDockerImage(id) : this.removePodmanImage(id);
        if (success) {
          return `Untagged: image ID ${id}\nDeleted: sha256:${id}...\nReclaimed disk space successfully.`;
        } else {
          return `Error: No such image: ${id}`;
        }
      }

      if (action === 'rm') {
        const id = args[2];
        if (!id) {
          return `Error: No container ID/name specified.`;
        }
        const container = (isDocker ? this.dockerContainers : this.podmanContainers).find(c => c.id === id || c.name === id);
        if (!container) {
          return `Error: No such container: ${id}`;
        }
        if (container.status === 'running') {
          return `Error response from daemon: You cannot remove a running container ${id}. Stop or stop first.`;
        }
        const success = isDocker ? this.removeDockerContainer(container.id) : this.removePodmanContainer(container.id);
        if (success) {
          return `${id}\nDeleted container writable layer (+${container.sizeMb} MB reclaimed).`;
        }
        return `Error removing container ${id}`;
      }

      if (action === 'system' && args[2]?.toLowerCase() === 'prune') {
        const result = isDocker ? this.pruneDocker() : this.prunePodman();
        if (result.freedMb === 0) {
          return `Total reclaimed space: 0 B`;
        }
        let out = `Deleted Containers:\n`;
        result.deletedContainers.forEach(c => {
          out += `- ${c}\n`;
        });
        out += `\nDeleted Images:\n`;
        result.deletedImages.forEach(img => {
          out += `- ${img}\n`;
        });
        out += `\nTotal reclaimed space: ${result.freedMb} MB`;
        return out;
      }

      return `Command '${firstWord} ${action}' is not supported in simulator mode.\nSupported commands:\n  ${firstWord} images\n  ${firstWord} ps -a\n  ${firstWord} rmi <image-id>\n  ${firstWord} rm <container-id/name>\n  ${firstWord} system prune`;
    }

    if (args[0] === 'spaceguard' || args[0] === './spaceguard' || args[0] === 'spaceguard.py') {
      args.shift();
    }

    const command = args[0] ? args[0].toLowerCase() : 'help';

    switch (command) {
      case 'help':
        return `SpaceGuard v1.2.0 - Zaawansowany Optymalizator Dysku dla Kali Linux

UŻYCIE:
  spaceguard [KOMENDA] [OPCJE]

KOMENDY:
  status                     Wyświetla statystyki dyskowe i stopień wykorzystania (Ayatana-ready)
  scan                       Uruchamia głębokie skanowanie dpkg-status i du
  packages list              Wypisuje listę zainstalowanych pakietów posortowaną po rozmiarze
  packages show <nazwa>      Wyświetla pełne metadane, rozmiary, biblioteki i graf zależności
  graph export               Generuje strukturę grafu zależności współdzielonych
  free --target <X GB/MB>     Generuje plan zwolnienia określonej ilości miejsca na dysku
  report                     Tworzy raport HTML/Markdown o najcięższych pakietach i cache'u
  clean                      Uruchamia bezinwazyjne czyszczenie (APT cache, system trash)

Opcje:
  -v, --version              Wersja programu
  -h, --help                 Ta pomoc`;

      case 'status': {
        const usagePercent = Math.round((this.disk.usedGb / this.disk.totalGb) * 100);
        let badge = '● [OK]';
        let ansiColor = '\x1b[32m'; // Green
        if (usagePercent >= 95) {
          badge = '▲ [CRITICAL]';
          ansiColor = '\x1b[1;31m'; // Crimson Bright
        } else if (usagePercent >= 85) {
          badge = '▲ [WARNING]';
          ansiColor = '\x1b[33m'; // Yellow
        }

        return `[SYSTEM DISK METRICS]
Ścieżka montowania:  /
Całkowity rozmiar:   ${this.disk.totalGb} GB
Użyte miejsce:       ${this.disk.usedGb} GB (${usagePercent}%)
Wolne miejsce:       ${this.disk.freeGb} GB
Pojemność kosza:     ${this.disk.trashSizeMb} MB
Cache pakietów APT:  ${this.disk.cacheSizeMb} MB

[Sygnalizator AyatanaAppIndicator3]
Wskaźnik statusu:    ${badge}
Status nałożenia:    Poziom zapełnienia przekracza próg ostrzegawczy? ${usagePercent >= 85 ? 'TAK' : 'NIE'}
Kolor lampki tray:   ${ansiColor}${usagePercent >= 85 ? 'Crimson / Yellow' : 'Green'}\x1b[0m`;
      }

      case 'scan': {
        const installed = this.packages.filter(p => p.status === 'installed');
        const totalInstalledSize = installed.reduce((acc, p) => acc + p.installedSizeKb, 0) / 1024;
        const totalActualSize = installed.reduce((acc, p) => acc + p.actualSizeKb, 0) / 1024;
        const diff = totalActualSize - totalInstalledSize;

        return `Rozpoczynanie skanowania...
[1/3] Odpytywanie bazy pakietów dpkg-status... OK (${installed.length} pakietów)
[2/3] Skanowanie dyskowe 'du -sb' na ścieżkach instalacji... OK
[3/3] Synchronizacja z bazą danych SQLite (WAL mode)... OK

[REZULTAT SKANOWANIA]
- Rozmiar deklarowany (dpkg Installed-Size): ${totalInstalledSize.toFixed(2)} MB
- Rozmiar rzeczywisty na dysku (du scan):    ${totalActualSize.toFixed(2)} MB
- Nadmiarowe pliki (logi, cache, configi):  +${diff.toFixed(2)} MB (+${((diff/totalInstalledSize)*100).toFixed(1)}%)

Wszystkie zależności są spójne. Brak cyklicznych odwołań bibliotek współdzielonych.`;
      }

      case 'packages': {
        const subCommand = args[1] ? args[1].toLowerCase() : '';
        if (subCommand === 'list') {
          const list = this.packages
            .filter(p => p.status === 'installed')
            .sort((a, b) => b.actualSizeKb - a.actualSizeKb);

          let out = `Zainstalowane pakiety według rzeczywistej zajętości (du):\n\n`;
          out += `  ${'PAKIET'.padEnd(30)} | ${'SEKCJA'.padEnd(10)} | ${'INSTALLED-SIZE'.padEnd(14)} | ${'ACTUAL DISK'.padEnd(14)} | ${'BEZPIECZEŃSTWO'.padEnd(15)}\n`;
          out += `-`.repeat(95) + `\n`;
          
          for (const p of list) {
            const sizeDecl = (p.installedSizeKb / 1024).toFixed(1) + ' MB';
            const sizeAct = (p.actualSizeKb / 1024).toFixed(1) + ' MB';
            const isCritical = p.isSystem ? 'Systemowy (ZAKAZ)' : 'Do usunięcia (Scoring: ' + (10 - p.importance) + ')';
            out += `  ${p.name.padEnd(30)} | ${p.section.padEnd(10)} | ${sizeDecl.padStart(14)} | ${sizeAct.padStart(14)} | ${isCritical.padEnd(15)}\n`;
          }
          return out;
        } else if (subCommand === 'show') {
          const pkgName = args[2];
          if (!pkgName) {
            return `Użycie: spaceguard packages show <nazwa-pakietu>`;
          }
          const p = this.getPackage(pkgName);
          if (!p) {
            return `Błąd: pakiet '${pkgName}' nie został odnaleziony w bazie.`;
          }

          return `Szczegóły pakietu: ${p.name}
======================================================================
Wersja:              ${p.version}
Sekcja:              ${p.section}
Status:              ${p.status.toUpperCase()}
Zadeklarowany size:  ${(p.installedSizeKb / 1024).toFixed(2)} MB (Installed-Size)
Rzeczywisty size:    ${(p.actualSizeKb / 1024).toFixed(2)} MB (Disk Usage scan)
Biblioteki .so:      ${p.sharedLibraries.length > 0 ? p.sharedLibraries.join(', ') : 'Brak'}
Krytyczność OS:      ${p.isSystem ? 'TAK (Blokada usuwania)' : 'NIE'}
Wskaźnik ryzyka:     ${p.rollbackRisk.toUpperCase()}

Zależności (Forward Deps):
  ${p.dependencies.length > 0 ? p.dependencies.join(' -> ') : 'Brak'}

Wsteczne zależności (Reverse Deps):
  ${p.reverseDependencies.length > 0 ? p.reverseDependencies.join(' <- ') : 'Brak'}

Opis:
  ${p.description}`;
        }
        return `Nieprawidłowe użycie polecenia packages. Wpisz 'spaceguard packages list' lub 'spaceguard packages show <nazwa>'`;
      }

      case 'graph': {
        if (args[1]?.toLowerCase() === 'export') {
          const installed = this.packages.filter(p => p.status === 'installed');
          const nodes = installed.map(p => ({ id: p.name, sizeMb: (p.actualSizeKb / 1024).toFixed(1) }));
          const edges: { source: string; target: string }[] = [];
          for (const p of installed) {
            for (const dep of p.dependencies) {
              if (installed.some(ip => ip.name === dep)) {
                edges.push({ source: p.name, target: dep });
              }
            }
          }
          return `[GRAPH EXPORT - D3 COMPATIBLE JSON]
{
  "format": "SpaceGuard dependency-v1",
  "nodesCount": ${nodes.length},
  "edgesCount": ${edges.length},
  "nodes": ${JSON.stringify(nodes, null, 2)},
  "links": ${JSON.stringify(edges, null, 2)}
}`;
        }
        return `Użycie: spaceguard graph export`;
      }

      case 'free': {
        const flagIdx = args.indexOf('--target');
        if (flagIdx === -1 || !args[flagIdx + 1]) {
          return `Użycie: spaceguard free --target <rozmiar-w-GB> (np. spaceguard free --target 5GB)`;
        }
        const valStr = args[flagIdx + 1];
        const val = parseFloat(valStr);
        if (isNaN(val)) {
          return `Błąd: nieprawidłowa wartość celu: '${valStr}'`;
        }

        const recommendations = this.generateRecommendations(val);
        if (recommendations.length === 0) {
          return `Cel ${val} GB jest już spełniony! Brak dodatkowych zaleceń optymalizacyjnych.`;
        }

        let out = `[SPACEGUARD OPTIMIZATION PLAN - DO CELU: ${val} GB]\n`;
        out += `======================================================================\n`;
        let totalFreed = 0;
        for (const r of recommendations) {
          totalFreed += r.spaceSavedMb;
          out += `\n* Kandydat:   ${r.packageName}
  Zysk miejsca: ${(r.spaceSavedMb).toFixed(1)} MB
  Dlaczego:     ${r.why}
  Konsekwencje: ${r.impact}
  Przywrócenie: ${r.rollback}
  Ryzyko:       ${r.risk.toUpperCase()}
`;
        }
        out += `\n` + `=`.repeat(70) + `\n`;
        out += `Suma możliwego zwolnienia miejsca: ${(totalFreed / 1024).toFixed(2)} GB (Cel: ${val} GB)\n`;
        out += `Aby zatwierdzić ten plan i uruchomić usuwanie, wywołaj: 'spaceguard clean'\n`;
        return out;
      }

      case 'report': {
        const installed = this.packages.filter(p => p.status === 'installed');
        const heavy = [...installed].sort((a, b) => b.actualSizeKb - a.actualSizeKb).slice(0, 5);
        
        return `# RAPORT SPACEGUARD - OPTYMALIZACJA MIEJSCA DLA KALI LINUX
Wygenerowano: ${new Date().toISOString()}

## 1. Wykorzystanie dysku
- Całkowite użycie: ${this.disk.usedGb} GB / ${this.disk.totalGb} GB (${Math.round((this.disk.usedGb / this.disk.totalGb)*100)}%)
- Wolne miejsce:    ${this.disk.freeGb} GB
- Kosz systemowy:   ${this.disk.trashSizeMb} MB
- Cache APT:        ${this.disk.cacheSizeMb} MB

## 2. Najcięższe pakiety w systemie (TOP 5)
${heavy.map((p, idx) => `${idx + 1}. **${p.name}** - rzeczywisty rozmiar: **${(p.actualSizeKb/1024).toFixed(1)} MB** (zadeklarowany Installed-Size: ${(p.installedSizeKb/1024).toFixed(1)} MB)`).join('\n')}

## 3. Akcje zalecane do wykonania od zaraz:
- Opróżnienie kosza systemowego (\`spaceguard clean\`) -> odzyskasz **${this.disk.trashSizeMb} MB**
- Czyszczenie archiwów pobierania apt (\`apt-get clean\`) -> odzyskasz **${this.disk.cacheSizeMb} MB**
- Odinstalowanie starych obrazów jądra Linux, np. linux-image-6.1.0-15-amd64 -> odzyskasz **320.0 MB**

Raport zapisano do pliku: \`/var/log/spaceguard/report.md\``;
      }

      case 'clean': {
        const trash = this.disk.trashSizeMb;
        const cache = this.disk.cacheSizeMb;
        this.emptyTrash();
        this.clearAptCache();
        
        // Let's also clean oldest candidate if we are very low on space (above 85%)
        let extraFreed = '';
        const usage = (this.disk.usedGb / this.disk.totalGb) * 100;
        if (usage > 85) {
          const r = this.generateRecommendations(1);
          const kernelCandidate = r.find(candidate => candidate.packageName.startsWith('linux-'));
          if (kernelCandidate) {
            const result = this.removePackage(kernelCandidate.packageName);
            if (result.success) {
              extraFreed = `\n[AUTOMATYCZNA RETENCJA] Usunięto nieużywane pakiety jądra: ${kernelCandidate.packageName} (+${result.freedMb} MB)`;
            }
          }
        }

        return `Inicjowanie bezinwazyjnego czyszczenia dysku...
- Czyszczenie kosza użytkowników... OK (Zwolniono: ${trash} MB)
- Czyszczenie pamięci podręcznej pobranych paczek APT (/var/cache/apt)... OK (Zwolniono: ${cache} MB)${extraFreed}

Czyszczenie zakończone sukcesem!
Nowy stan wykorzystania dysku: ${this.disk.usedGb} GB / ${this.disk.totalGb} GB (${Math.round((this.disk.usedGb / this.disk.totalGb)*100)}%)`;
      }

      case '-v':
      case '--version':
        return `spaceguard v1.2.0 (Debian package management optimizer)`;

      default:
        return `Nieznana komenda: '${command}'. Wpisz 'spaceguard help' po listę dostępnych opcji.`;
    }
  }
}

export const simulator = new SpaceGuardSimulator();
