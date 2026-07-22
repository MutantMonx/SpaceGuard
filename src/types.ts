/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PackageInfo {
  name: string;
  version: string;
  installedSizeKb: number; // Size from Installed-Size header in control file
  actualSizeKb: number;    // Actual size from du (disk usage) scan
  description: string;
  section: string;
  dependencies: string[];
  reverseDependencies: string[];
  sharedLibraries: string[];
  status: 'installed' | 'available' | 'residual';
  importance: number;      // Scoring 1-10 (10 = critical system package, 1 = safe to remove)
  rollbackRisk: 'none' | 'low' | 'medium' | 'high';
  isSystem: boolean;       // If true, removing it might break core OS
  whyRecommend?: string;   // Reason why SpaceGuard recommends removing/cleaning this package
  installedAt?: string;    // ISO format of installation or download event
  installedBy?: string;    // User who executed the installer/curl/wget
  hasSudo?: boolean;       // If true, installer had superuser (sudo/root) privileges
  lastUsedAt?: string;     // Last time the package was run or accessed
  sourceUrl?: string;      // Source URL/command (curl, wget or browser source)
  installMethod?: 'apt' | 'curl' | 'wget' | 'zip-extract' | 'installer-script';
  createdFiles?: string[]; // List of files created/extracted onto disk
  collaboratingWith?: string[]; // Libraries or other binaries that co-executed/collaborated during run-time
  isCustomFootprint?: boolean; // True if this represents custom unzipped files, raw downloads, etc.
}

export interface DiskStatus {
  totalGb: number;
  usedGb: number;
  freeGb: number;
  trashSizeMb: number;
  cacheSizeMb: number;
  dockerSizeMb?: number; // Total size of Docker resources (images + containers)
  podmanSizeMb?: number; // Total size of Podman resources (images + containers)
}

export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  sizeMb: number;
  created: string;
  isDangling: boolean;
  engine: 'docker' | 'podman';
}

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'exited' | 'created';
  sizeMb: number; // Size of writable layer
  engine: 'docker' | 'podman';
}

export interface Recommendation {
  packageName: string;
  spaceSavedMb: number;
  why: string;
  impact: string;
  rollback: string;
  risk: 'none' | 'low' | 'medium' | 'high';
}

export type UIViewVariant = 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
export type Language = 'en' | 'pl';

export interface CommandHistoryItem {
  command: string;
  output: string;
  timestamp: string;
}

export interface DiskMapItem {
  id: string;
  name: string;
  path: string;
  sizeMb: number;
  sizeGb: number;
  percentageOfUsed: number;
  type: 'folder' | 'application' | 'container' | 'cache' | 'trash' | 'user_data' | 'system_core' | 'usb_external';
  category: string;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  canPurge: boolean;
  dependencies?: string[];
  description?: string;
  iconName?: string;
}

