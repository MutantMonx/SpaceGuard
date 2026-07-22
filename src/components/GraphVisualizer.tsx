/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PackageInfo } from '../types';
import { Network, Database, Info, GitCompare, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GraphVisualizerProps {
  packages: PackageInfo[];
  selectedPackageName: string;
  onSelectPackage: (name: string) => void;
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
}

export default function GraphVisualizer({
  packages,
  selectedPackageName,
  onSelectPackage,
  variant
}: GraphVisualizerProps) {
  const { t } = useLanguage();
  const [activePackage, setActivePackage] = useState<PackageInfo | null>(null);

  useEffect(() => {
    const found = packages.find(p => p.name === selectedPackageName);
    if (found) {
      setActivePackage(found);
    } else {
      // Default to the first installed package
      const defaultPkg = packages.find(p => p.status === 'installed') || packages[0];
      if (defaultPkg) {
        setActivePackage(defaultPkg);
        onSelectPackage(defaultPkg.name);
      }
    }
  }, [selectedPackageName, packages]);

  if (!activePackage) {
    return <div className="p-8 text-center text-sm opacity-50">{t('graphLoading')}</div>;
  }

  // Find all packages that are installed
  const installedPackages = packages.filter(p => p.status === 'installed');

  // Filter dependencies that are actually installed and exist in database
  const forwardDeps = activePackage.dependencies
    .map(depName => packages.find(p => p.name === depName))
    .filter((p): p is PackageInfo => !!p);

  // Filter reverse dependencies that are actually installed and exist in database
  const reverseDeps = activePackage.reverseDependencies
    .map(depName => packages.find(p => p.name === depName))
    .filter((p): p is PackageInfo => !!p && p.status === 'installed');

  // Node helper function to get responsive styling
  const nodeStyles = () => {
    switch (variant) {
      case 'Forge':
        return {
          centerNode: 'fill-[#0c1015] stroke-[#ff3e3e] stroke-[2px]',
          centerText: 'fill-[#ff3e3e] font-mono text-[10px]',
          forwardNode: 'fill-[#080b0f] stroke-[#ff3e3e]/40 hover:stroke-[#ff3e3e] hover:fill-[#ff3e3e]/10',
          forwardText: 'fill-zinc-300',
          reverseNode: 'fill-[#080b0f] stroke-rose-500/40 hover:stroke-rose-500 hover:fill-rose-950/10',
          reverseText: 'fill-zinc-300',
          collabNode: 'fill-[#080b0f] stroke-amber-500/40 hover:stroke-amber-400 hover:fill-amber-950/10',
          collabText: 'fill-amber-400',
          lines: 'stroke-[#1a1f26] stroke-[1px]',
          arrows: 'fill-[#ff3e3e]/60'
        };
      case 'Atlas':
        return {
          centerNode: 'fill-[#0c1015] stroke-[#e0e6ed] stroke-[2px]',
          centerText: 'fill-white font-mono text-[10px]',
          forwardNode: 'fill-[#080b0f] stroke-[#e0e6ed]/40 hover:stroke-white hover:fill-white/10',
          forwardText: 'fill-slate-300',
          reverseNode: 'fill-[#080b0f] stroke-zinc-500/40 hover:stroke-zinc-400 hover:fill-zinc-500/10',
          reverseText: 'fill-slate-300',
          collabNode: 'fill-[#080b0f] stroke-sky-400/40 hover:stroke-sky-300 hover:fill-sky-950/10',
          collabText: 'fill-sky-300',
          lines: 'stroke-[#1a1f26] stroke-[1px]',
          arrows: 'fill-[#e0e6ed]/60'
        };
      case 'Pulse':
        return {
          centerNode: 'fill-[#0c1015] stroke-[#00f2ff] stroke-[2px]',
          centerText: 'fill-[#00f2ff] font-mono text-[10px]',
          forwardNode: 'fill-[#080b0f] stroke-[#00f2ff]/40 hover:stroke-[#00f2ff] hover:fill-[#00f2ff]/10',
          forwardText: 'fill-slate-300',
          reverseNode: 'fill-[#080b0f] stroke-blue-500/40 hover:stroke-blue-400 hover:fill-blue-950/10',
          reverseText: 'fill-slate-300',
          collabNode: 'fill-[#080b0f] stroke-purple-400/40 hover:stroke-purple-300 hover:fill-purple-950/10',
          collabText: 'fill-purple-300',
          lines: 'stroke-[#1a1f26] stroke-[1px]',
          arrows: 'fill-[#00f2ff]/60'
        };
      case 'Zen':
        return {
          centerNode: 'fill-[#0c1015] stroke-[#f2a100] stroke-[2px]',
          centerText: 'fill-[#f2a100] font-mono text-[10px]',
          forwardNode: 'fill-[#080b0f] stroke-[#f2a100]/40 hover:stroke-[#f2a100] hover:fill-[#f2a100]/10',
          forwardText: 'fill-neutral-400',
          reverseNode: 'fill-[#080b0f] stroke-amber-600/40 hover:stroke-amber-500 hover:fill-neutral-900',
          reverseText: 'fill-neutral-400',
          collabNode: 'fill-[#080b0f] stroke-emerald-500/40 hover:stroke-emerald-400 hover:fill-emerald-950/10',
          collabText: 'fill-emerald-400',
          lines: 'stroke-[#1a1f26] stroke-[1px]',
          arrows: 'fill-[#f2a100]/60'
        };
    }
  };

  const styles = nodeStyles();

  // Positioning logic for SVG
  const width = 600;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2;

  // Elliptical axes to fit the SVG perfectly
  const rx = 195;
  const ry = 95;

  // Map collaborating entities
  const collaborators = activePackage.collaboratingWith || [];
  const collabItems = collaborators.map(name => {
    const found = packages.find(p => p.name.toLowerCase() === name.toLowerCase());
    return {
      name,
      isInstalled: found?.status === 'installed',
      packageInfo: found || null
    };
  });

  // Function to calculate node radius based on size (du size in KB)
  const getNodeRadius = (sizeKb: number, isCenter = false) => {
    const minRad = isCenter ? 25 : 18;
    const maxRad = isCenter ? 45 : 32;
    // Logarithmic scale for better visual balance
    const sizeMb = sizeKb / 1024;
    const sizeFactor = Math.min(Math.max(Math.log2(sizeMb + 1) / 8, 0), 1);
    return minRad + sizeFactor * (maxRad - minRad);
  };

  const centerRad = getNodeRadius(activePackage.actualSizeKb, true);

  const getAccentHex = () => {
    switch (variant) {
      case 'Forge': return 'text-[#ff3e3e]';
      case 'Atlas': return 'text-white';
      case 'Pulse': return 'text-[#00f2ff]';
      case 'Zen': return 'text-[#f2a100]';
    }
  };

  return (
    <div id="dependency-graph-card" className="p-4 rounded-none border bg-[#080b0f] border-[#1a1f26]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-[#1a1f26] mb-4">
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${getAccentHex()}`}>
            <Network className="w-4 h-4" />
            {t('graphTitle')}
          </h3>
          <p className="text-xs opacity-50">{t('graphSubtitle')}</p>
        </div>
        <div className="mt-2 sm:mt-0 flex gap-2">
          <select
            id="package-graph-selector"
            value={activePackage.name}
            onChange={(e) => onSelectPackage(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-none cursor-pointer border bg-[#0c1015] border-[#1a1f26] text-white focus:outline-none"
          >
            {installedPackages.map(p => (
              <option key={p.name} value={p.name}>{p.name} ({(p.actualSizeKb / 1024).toFixed(0)} MB)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dependency Map Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* SVG Drawing Canvas */}
        <div id="dependency-canvas-container" className="lg:col-span-3 border border-[#1a1f26] rounded-none bg-[#0c1015]/60 overflow-hidden relative min-h-[320px]">
          <svg className="w-full h-full min-h-[320px]" viewBox={`0 0 ${width} ${height}`}>
            {/* Defs for arrow markers */}
            <defs>
              <marker
                id="arrow-right"
                viewBox="0 0 10 10"
                refX="20"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrows} />
              </marker>
              <marker
                id="arrow-left"
                viewBox="0 0 10 10"
                refX="20"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 10 0 L 0 5 L 10 10 z" className={styles.arrows} />
              </marker>
            </defs>

            {/* DRAW LINES */}
            {/* Forward dependency lines (Center to Forward) */}
            {forwardDeps.map((dep, idx) => {
              const count = forwardDeps.length;
              const angle = count === 1 
                ? 0 
                : -Math.PI / 4 + (idx / (count - 1)) * (Math.PI / 2);
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              return (
                <g key={`f-line-${idx}`}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    className={styles.lines}
                    markerEnd="url(#arrow-right)"
                  />
                  <text
                    x={(cx + x) / 2}
                    y={(cy + y) / 2 - 5}
                    textAnchor="middle"
                    className="text-[8px] fill-emerald-500/70 font-mono"
                  >
                    requires
                  </text>
                </g>
              );
            })}

            {/* Reverse dependency lines (Reverse to Center) */}
            {reverseDeps.map((dep, idx) => {
              const count = reverseDeps.length;
              const angle = count === 1
                ? Math.PI
                : Math.PI * 3 / 4 + (idx / (count - 1)) * (Math.PI / 2);
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              return (
                <g key={`r-line-${idx}`}>
                  <line
                    x1={x}
                    y1={y}
                    x2={cx}
                    y2={cy}
                    className={styles.lines}
                    markerStart="url(#arrow-left)"
                  />
                  <text
                    x={(x + cx) / 2}
                    y={(y + cy) / 2 - 5}
                    textAnchor="middle"
                    className="text-[8px] fill-rose-500/70 font-mono"
                  >
                    needed by
                  </text>
                </g>
              );
            })}

            {/* Collaborator dynamic links (Center to Collaborator) */}
            {collabItems.map((collab, idx) => {
              const count = collabItems.length;
              const angle = count === 1
                ? -Math.PI / 2
                : -Math.PI * 3 / 4 + (idx / (count - 1)) * (Math.PI / 2);
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              return (
                <g key={`collab-line-${idx}`}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    className="stroke-[#1a1f26] stroke-[1px]"
                    style={{ strokeDasharray: '3 3' }}
                  />
                  <text
                    x={(cx + x) / 2}
                    y={(cy + y) / 2 - 4}
                    textAnchor="middle"
                    className="text-[7.5px] fill-amber-400/80 font-mono"
                  >
                    collaborated
                  </text>
                </g>
              );
            })}

            {/* DRAW NODES */}
            {/* Center Node */}
            <g
              className="cursor-pointer group"
              onClick={() => onSelectPackage(activePackage.name)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={centerRad}
                className={`transition-all duration-300 group-hover:scale-105 ${styles.centerNode}`}
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                className={`text-[11px] select-none ${styles.centerText}`}
              >
                {activePackage.name.length > 10 ? `${activePackage.name.slice(0, 8)}..` : activePackage.name}
              </text>
              <title>{`${activePackage.name}\nRozmiar rzeczywisty: ${(activePackage.actualSizeKb/1024).toFixed(1)} MB`}</title>
            </g>

            {/* Forward Nodes (Dependencies) */}
            {forwardDeps.map((dep, idx) => {
              const count = forwardDeps.length;
              const angle = count === 1 
                ? 0 
                : -Math.PI / 4 + (idx / (count - 1)) * (Math.PI / 2);
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              const radius = getNodeRadius(dep.actualSizeKb);

              return (
                <g
                  key={`f-node-${idx}`}
                  className="cursor-pointer group"
                  onClick={() => onSelectPackage(dep.name)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    className={`transition-all duration-300 group-hover:scale-110 ${styles.forwardNode}`}
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    className={`text-[9px] font-mono select-none group-hover:font-bold ${styles.forwardText}`}
                  >
                    {dep.name.length > 10 ? `${dep.name.slice(0, 8)}..` : dep.name}
                  </text>
                  <title>{`${dep.name}\nRozmiar rzeczywisty: ${(dep.actualSizeKb/1024).toFixed(1)} MB`}</title>
                </g>
              );
            })}

            {/* Reverse Nodes (Required by) */}
            {reverseDeps.map((dep, idx) => {
              const count = reverseDeps.length;
              const angle = count === 1
                ? Math.PI
                : Math.PI * 3 / 4 + (idx / (count - 1)) * (Math.PI / 2);
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              const radius = getNodeRadius(dep.actualSizeKb);

              return (
                <g
                  key={`r-node-${idx}`}
                  className="cursor-pointer group"
                  onClick={() => onSelectPackage(dep.name)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    className={`transition-all duration-300 group-hover:scale-110 ${styles.reverseNode}`}
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    className={`text-[9px] font-mono select-none group-hover:font-bold ${styles.reverseText}`}
                  >
                    {dep.name.length > 10 ? `${dep.name.slice(0, 8)}..` : dep.name}
                  </text>
                  <title>{`${dep.name}\nRozmiar rzeczywisty: ${(dep.actualSizeKb/1024).toFixed(1)} MB`}</title>
                </g>
              );
            })}

            {/* Collaborator Nodes (Cooperating processes/libs) */}
            {collabItems.map((collab, idx) => {
              const count = collabItems.length;
              const angle = count === 1
                ? -Math.PI / 2
                : -Math.PI * 3 / 4 + (idx / (count - 1)) * (Math.PI / 2);
              const x = cx + rx * Math.cos(angle);
              const y = cy + ry * Math.sin(angle);
              const radius = 17;

              return (
                <g
                  key={`collab-node-${idx}`}
                  className="cursor-pointer group"
                  onClick={() => {
                    if (collab.isInstalled && collab.packageInfo) {
                      onSelectPackage(collab.packageInfo.name);
                    }
                  }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    className={`transition-all duration-300 group-hover:scale-110 ${styles.collabNode}`}
                    style={{ strokeDasharray: collab.isInstalled ? 'none' : '3 3' }}
                  />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    className={`text-[8.5px] font-mono select-none group-hover:font-bold ${styles.collabText}`}
                  >
                    {collab.name.length > 10 ? `${collab.name.slice(0, 8)}..` : collab.name}
                  </text>
                  <title>{`Współpracownik: ${collab.name}\nStatus: ${collab.isInstalled ? 'Zainstalowany pakiet' : 'Zasób zewnętrzny / API / biblioteka dynamiczna'}`}</title>
                </g>
              );
            })}
          </svg>

          {/* Labels */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] opacity-75 font-mono max-w-[95%]">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-none bg-zinc-950 border border-red-500"></span>
              <span>{t('graphTargetNode')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-none bg-zinc-900 border border-emerald-500"></span>
              <span>{t('graphDependency')}</span>
            </div>
            {reverseDeps.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-none bg-zinc-900 border border-rose-500"></span>
                <span>{t('graphRequiredBy')}</span>
              </div>
            )}
            {collabItems.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-none bg-zinc-900 border border-dashed border-amber-400"></span>
                <span>{t('graphCollaborates')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Node Details Sidebar */}
        <div id="dependency-sidebar-details" className="flex flex-col justify-between border border-[#1a1f26] rounded-none p-3 bg-[#0c1015]/80 text-xs">
          <div>
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#1a1f26]">
              <Info className={`w-3.5 h-3.5 ${getAccentHex()}`} />
              <span className="font-bold uppercase tracking-wider">{t('graphDetails')}</span>
            </div>
            <h4 className="text-sm font-bold truncate">{activePackage.name}</h4>
            <div className="flex justify-between items-center mt-0.5 font-mono text-[10px]">
              <span className="opacity-45">{t('graphVersion')}: {activePackage.version}</span>
              {activePackage.isCustomFootprint && (
                <span className="px-1 py-0.25 text-[8px] bg-amber-500/10 border border-amber-500/30 text-amber-500 font-sans uppercase">Custom File</span>
              )}
            </div>
            
            <p className="opacity-80 mt-2 leading-relaxed italic border-l-2 border-white/10 pl-2 text-[11px]">
              "{activePackage.description}"
            </p>

            {/* Disk and Size metrics */}
            <div className="mt-3.5 space-y-2 border-t border-b border-white/5 py-2">
              <div className="flex justify-between">
                <span className="opacity-50">{t('thDeclared')}:</span>
                <span className="font-mono">{(activePackage.installedSizeKb / 1024).toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">{t('thActual')}:</span>
                <span className="font-bold font-mono">{(activePackage.actualSizeKb / 1024).toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">{t('graphRollbackRisk')}:</span>
                <span className={`font-mono uppercase font-semibold ${
                  activePackage.rollbackRisk === 'high' ? 'text-red-500' :
                  activePackage.rollbackRisk === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>{activePackage.rollbackRisk}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">{t('graphImportance')}:</span>
                <span className="font-bold font-mono">{activePackage.importance}/10</span>
              </div>
            </div>

            {/* Provenance Audit logs */}
            <div className="mt-3 space-y-2 border-b border-white/5 pb-2 text-[10.5px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#4d5b6e]">{t('graphProvenanceTitle')}</div>
              
              <div className="flex justify-between">
                <span className="opacity-50">{t('graphInstaller')}</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {activePackage.installedBy || 'root'}
                  {activePackage.hasSudo && (
                    <span className="px-0.5 text-[7px] bg-red-500/10 border border-red-500/30 text-red-500 rounded font-sans uppercase">SUDO</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-50">{t('graphMethod')}</span>
                <span className="text-zinc-300 uppercase font-mono text-[9px]">
                  {activePackage.installMethod || 'apt-get'}
                </span>
              </div>

              <div>
                <span className="opacity-50 block mb-0.5">{t('graphSource')}</span>
                <span className="text-[9px] text-blue-400 break-all select-all font-sans bg-black/40 p-1 block rounded border border-white/5">
                  {activePackage.sourceUrl || t('graphDebianMirror')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-50">{t('graphInstalled')}</span>
                <span className="text-zinc-300 font-mono">
                  {activePackage.installedAt ? new Date(activePackage.installedAt).toLocaleString() : t('graphPreinstalled')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-50">{t('graphLastUsed')}</span>
                <span className="text-emerald-400 font-mono">
                  {activePackage.lastUsedAt ? new Date(activePackage.lastUsedAt).toLocaleString() : t('graphPreinstalled')}
                </span>
              </div>
            </div>

            {/* Collaborators list */}
            {collabItems.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-1 opacity-50 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#4d5b6e]">
                  <span>{t('graphCollaborators')}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {collabItems.map(collab => (
                    <span
                      key={collab.name}
                      onClick={() => {
                        if (collab.isInstalled && collab.packageInfo) {
                          onSelectPackage(collab.packageInfo.name);
                        }
                      }}
                      className={`px-1.5 py-0.5 rounded-none border text-[9px] font-mono cursor-pointer transition-all ${
                        collab.isInstalled 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40' 
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {collab.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activePackage.sharedLibraries.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-1 opacity-50 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#4d5b6e]">
                  <Database className="w-3 h-3" />
                  <span>{t('graphSharedLibs')}</span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {activePackage.sharedLibraries.map(lib => (
                    <span key={lib} className="px-1.5 py-0.5 rounded-none bg-white/5 border border-white/5 text-[9px] font-mono">
                      {lib}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a1f26]">
            <button
              onClick={() => onSelectPackage(activePackage.name)}
              className={`w-full py-2 rounded-none text-center font-bold text-[10px] uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                variant === 'Forge' ? 'bg-[#ff3e3e]/10 border border-[#ff3e3e]/40 text-[#ff3e3e] hover:bg-[#ff3e3e]/25' :
                variant === 'Atlas' ? 'bg-white/10 border border-white/40 text-white hover:bg-white/25' :
                variant === 'Pulse' ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] hover:bg-[#00f2ff]/25' :
                'bg-[#f2a100]/10 border border-[#f2a100]/40 text-[#f2a100] hover:bg-[#f2a100]/25'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              {t('graphReloadNode')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
