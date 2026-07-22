/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  Package, 
  HardDrive, 
  Trash2, 
  ShieldAlert, 
  Search, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Info,
  Layers,
  Database,
  Usb,
  Cpu,
  Zap,
  Filter
} from 'lucide-react';
import { DiskMapItem, Language } from '../types';
import { t } from '../utils/translations';

interface DiskSpaceMapProps {
  language: Language;
  onNavigateToGraph?: (pkgName: string) => void;
  onRefreshDiskStatus: () => void;
}

export const DiskSpaceMap: React.FC<DiskSpaceMapProps> = ({
  language,
  onNavigateToGraph,
  onRefreshDiskStatus
}) => {
  const [viewMode, setViewMode] = useState<'folders' | 'applications'>('applications');
  const [items, setItems] = useState<DiskMapItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<DiskMapItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<DiskMapItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ item: DiskMapItem; x: number; y: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [safeguardedIds, setSafeguardedIds] = useState<Set<string>>(new Set(['os-system-core', 'dir-usr', 'dir-lib-boot']));

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMap = async (mode: 'folders' | 'applications') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/diskmap?mode=${mode}`);
      if (res.ok) {
        const data: DiskMapItem[] = await res.json();
        setItems(data);
        if (data.length > 0 && !selectedItem) {
          setSelectedItem(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch disk map:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMap(viewMode);
  }, [viewMode]);

  // Handle outside click to dismiss context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenu = (e: React.MouseEvent, item: DiskMapItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      item,
      x: e.clientX,
      y: e.clientY
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    showToast(`Copied path to clipboard: ${path}`);
    setContextMenu(null);
  };

  const handleToggleSafeguard = (id: string, name: string) => {
    setSafeguardedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Removed '${name}' from safeguard exclude list.`);
      } else {
        next.add(id);
        showToast(`Added '${name}' to protected safeguard list.`);
      }
      return next;
    });
    setContextMenu(null);
  };

  const handlePurgeItem = async (item: DiskMapItem) => {
    setContextMenu(null);
    if (safeguardedIds.has(item.id)) {
      showToast(`Cannot purge protected item: ${item.name}`);
      return;
    }

    try {
      if (item.id === 'cache-apt' || item.id === 'trash-system') {
        const res = await fetch('/api/clean', { method: 'POST' });
        if (res.ok) {
          showToast(`Cleaned ${item.name}! Reclaimed space.`);
          fetchMap(viewMode);
          onRefreshDiskStatus();
        }
      } else if (item.id.startsWith('app-')) {
        const pkgName = item.id.replace('app-', '');
        const res = await fetch('/api/packages/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: pkgName })
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`Purged package '${pkgName}' (-${data.freedMb} MB).`);
          fetchMap(viewMode);
          onRefreshDiskStatus();
        } else {
          showToast(`Error: ${data.error}`);
        }
      } else {
        showToast(`Simulated purge for target path: ${item.path}`);
      }
    } catch (err: any) {
      showToast(`Purge failed: ${err.message}`);
    }
  };

  const getTypeIcon = (type: DiskMapItem['type']) => {
    switch (type) {
      case 'folder': return <Folder className="w-4 h-4 text-sky-400" />;
      case 'application': return <Package className="w-4 h-4 text-emerald-400" />;
      case 'container': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'cache': return <Database className="w-4 h-4 text-amber-400" />;
      case 'trash': return <Trash2 className="w-4 h-4 text-rose-400" />;
      case 'usb_external': return <Usb className="w-4 h-4 text-purple-400" />;
      case 'system_core': return <Cpu className="w-4 h-4 text-slate-400" />;
      default: return <HardDrive className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getTypeColor = (type: DiskMapItem['type'], isProtected: boolean) => {
    if (isProtected) return 'bg-slate-900/80 border-slate-700/60 text-slate-300';
    switch (type) {
      case 'folder': return 'bg-sky-950/40 border-sky-500/30 hover:border-sky-400 text-sky-200';
      case 'application': return 'bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-400 text-emerald-200';
      case 'container': return 'bg-cyan-950/40 border-cyan-500/30 hover:border-cyan-400 text-cyan-200';
      case 'cache': return 'bg-amber-950/40 border-amber-500/30 hover:border-amber-400 text-amber-200';
      case 'trash': return 'bg-rose-950/40 border-rose-500/30 hover:border-rose-400 text-rose-200';
      case 'usb_external': return 'bg-purple-950/40 border-purple-500/30 hover:border-purple-400 text-purple-200';
      case 'system_core': return 'bg-slate-900/90 border-slate-800 text-slate-400';
      default: return 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400 text-indigo-200';
    }
  };

  const totalUsedMb = items.reduce((sum, item) => sum + item.sizeMb, 0);

  return (
    <div className="space-y-6" ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-200 shadow-xl flex items-center space-x-2 text-xs font-mono"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-mono font-bold text-slate-100 tracking-wider">
                {t('treemapTitle', language)}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t('treemapSubtitle', language)}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setViewMode('applications')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                viewMode === 'applications'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t('treemapViewApps', language)}</span>
            </button>
            <button
              onClick={() => setViewMode('folders')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                viewMode === 'folders'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{t('treemapViewFolders', language)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tiles Grid (Treemap) */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-2xl relative min-h-[480px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-950/80 z-20">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono text-slate-400">Scanning filesystem metrics...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Capacity Legend Summary Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/60">
              <span className="flex items-center space-x-2">
                <span>Total Mapped Footprint:</span>
                <strong className="text-cyan-400 font-bold">{(totalUsedMb / 1024).toFixed(2)} GB</strong>
              </span>
              <span className="text-slate-500">
                Right-click any tile for contextual actions • Hover for full metrics
              </span>
            </div>

            {/* Treemap Tile Grid Layout */}
            <div className="grid grid-cols-12 gap-2.5 auto-rows-[110px]">
              {items.map((item, idx) => {
                const isProtected = safeguardedIds.has(item.id);
                const isSelected = selectedItem?.id === item.id;

                // Calculate relative grid span based on disk size percentage
                let colSpan = 'col-span-12 md:col-span-4 lg:col-span-3';
                if (item.percentageOfUsed > 25) colSpan = 'col-span-12 md:col-span-8 lg:col-span-6';
                else if (item.percentageOfUsed > 10) colSpan = 'col-span-12 md:col-span-6 lg:col-span-4';
                else if (item.percentageOfUsed > 4) colSpan = 'col-span-6 md:col-span-4 lg:col-span-3';
                else colSpan = 'col-span-6 md:col-span-3 lg:col-span-2';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    onClick={() => setSelectedItem(item)}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative group rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${colSpan} ${getTypeColor(
                      item.type,
                      isProtected
                    )} ${isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/10' : ''}`}
                  >
                    {/* Background Subtle Gradient Bar for Capacity */}
                    <div
                      className="absolute bottom-0 left-0 top-0 opacity-10 bg-current transition-all pointer-events-none"
                      style={{ width: `${Math.min(100, Math.max(5, item.percentageOfUsed * 2))}%` }}
                    />

                    {/* Top Row: Icon, Name & Protected Shield */}
                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <div className="flex items-center space-x-2 min-w-0">
                        {getTypeIcon(item.type)}
                        <h4 className="font-mono text-xs font-bold truncate text-slate-100 group-hover:text-cyan-300">
                          {item.name}
                        </h4>
                      </div>
                      {isProtected && (
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Protected Resource" />
                      )}
                    </div>

                    {/* Middle Row: Path preview */}
                    <p className="font-mono text-[10px] text-slate-400/80 truncate relative z-10">
                      {item.path}
                    </p>

                    {/* Bottom Row: Metrics badge */}
                    <div className="flex items-center justify-between text-[11px] font-mono relative z-10 pt-1 border-t border-slate-800/40">
                      <span className="font-bold text-slate-200">
                        {item.sizeMb > 1024 ? `${(item.sizeMb / 1024).toFixed(2)} GB` : `${item.sizeMb} MB`}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                        {item.percentageOfUsed}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hover Floating Tooltip */}
      <AnimatePresence>
        {hoveredItem && !contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed pointer-events-none z-50 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs font-mono max-w-sm space-y-2 text-slate-200"
            style={{
              left: Math.min(mousePos.x + 15, window.innerWidth - 320),
              top: Math.min(mousePos.y + 15, window.innerHeight - 200)
            }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
                {getTypeIcon(hoveredItem.type)}
                <span>{hoveredItem.name}</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {hoveredItem.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Disk Footprint:</span>
                <p className="font-bold text-slate-100">
                  {hoveredItem.sizeMb > 1024 ? `${(hoveredItem.sizeMb / 1024).toFixed(2)} GB` : `${hoveredItem.sizeMb} MB`}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Disk Ratio:</span>
                <p className="font-bold text-cyan-400">{hoveredItem.percentageOfUsed}% of used</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">{t('treemapLocation', language)}</span>
                <p className="text-slate-300 truncate text-[10px] font-mono">{hoveredItem.path}</p>
              </div>
              <div>
                <span className="text-slate-400">{t('treemapCreatedDate', language)}</span>
                <p className="text-slate-300 text-[10px]">
                  {hoveredItem.createdAt ? new Date(hoveredItem.createdAt).toLocaleDateString() : 'System Initial'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">{t('treemapUpdatedDate', language)}</span>
                <p className="text-slate-300 text-[10px]">
                  {hoveredItem.updatedAt ? new Date(hoveredItem.updatedAt).toLocaleDateString() : 'Live'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right-Click Floating Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-slate-900 border border-cyan-500/40 rounded-xl p-1.5 shadow-2xl backdrop-blur-lg w-64 text-xs font-mono divide-y divide-slate-800/60"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 260),
              top: Math.min(contextMenu.y, window.innerHeight - 220)
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Context Item Title */}
            <div className="px-3 py-2 text-slate-300 font-bold truncate flex items-center space-x-2">
              {getTypeIcon(contextMenu.item.type)}
              <span className="truncate">{contextMenu.item.name}</span>
            </div>

            {/* Context Actions */}
            <div className="py-1 space-y-0.5">
              {contextMenu.item.id.startsWith('app-') && onNavigateToGraph && (
                <button
                  onClick={() => {
                    const name = contextMenu.item.id.replace('app-', '');
                    onNavigateToGraph(name);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-950/80 hover:text-cyan-300 text-slate-300 flex items-center space-x-2 transition-colors"
                >
                  <span>{t('contextInspectGraph', language)}</span>
                </button>
              )}

              <button
                onClick={() => handleCopyPath(contextMenu.item.path)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center space-x-2 transition-colors"
              >
                <span>{t('contextCopyPath', language)}</span>
              </button>

              <button
                onClick={() => handleToggleSafeguard(contextMenu.item.id, contextMenu.item.name)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center space-x-2 transition-colors"
              >
                <span>
                  {safeguardedIds.has(contextMenu.item.id)
                    ? '🔓 Unprotect Item'
                    : t('contextSafeguard', language)}
                </span>
              </button>

              {contextMenu.item.canPurge && (
                <button
                  onClick={() => handlePurgeItem(contextMenu.item)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/80 hover:text-rose-300 text-rose-400 flex items-center space-x-2 transition-colors font-bold"
                >
                  <span>{t('contextQuickClean', language)}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Item Inspector Panel */}
      {selectedItem && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              {getTypeIcon(selectedItem.type)}
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedItem.name}</h3>
                <span className="text-xs text-slate-400">{selectedItem.path}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                {selectedItem.sizeMb > 1024
                  ? `${(selectedItem.sizeMb / 1024).toFixed(2)} GB`
                  : `${selectedItem.sizeMb} MB`}
              </span>
              <button
                onClick={() => handleCopyPath(selectedItem.path)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy Path"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[11px]">{t('treemapCategory', language)}</span>
              <p className="font-bold text-slate-200">{selectedItem.category}</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[11px]">{t('treemapCreatedDate', language)}</span>
              <p className="font-bold text-slate-200">
                {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'System Default'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[11px]">{t('treemapUpdatedDate', language)}</span>
              <p className="font-bold text-slate-200">
                {selectedItem.updatedAt ? new Date(selectedItem.updatedAt).toLocaleString() : 'Live'}
              </p>
            </div>
          </div>

          {selectedItem.description && (
            <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 leading-relaxed">
              {selectedItem.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
