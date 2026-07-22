/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, Cpu, Trash2, CpuIcon, Check, Settings, Play } from 'lucide-react';
import { DiskStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SystemTrayProps {
  disk: DiskStatus;
  onActionComplete: (msg: string) => void;
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
}

export default function SystemTray({ disk, onActionComplete, variant }: SystemTrayProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [daemonActive, setDaemonActive] = useState(true);
  const [simulatedCpu, setSimulatedCpu] = useState(0.4);
  const [simulatedRss, setSimulatedRss] = useState(38.2); // MB (RSS memory, highly optimized < 80MB)
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Periodic tiny daemon ticks
  useEffect(() => {
    const timer = setInterval(() => {
      if (daemonActive) {
        setSimulatedCpu(parseFloat((0.2 + Math.random() * 0.5).toFixed(2)));
        // Tiny memory fluctuation
        setSimulatedRss(parseFloat((37.5 + Math.random() * 0.9).toFixed(1)));
      } else {
        setSimulatedCpu(0.0);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [daemonActive]);

  // Click outside to close tray dropdown
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [isOpen]);

  const usagePercent = Math.round((disk.usedGb / disk.totalGb) * 100);
  const themeAccent = {
    Forge: { color: 'text-[#ff3e3e]', border: 'border-[#ff3e3e]/30', bg: 'bg-[#ff3e3e]/10', hover: 'hover:bg-[#ff3e3e]/10 text-white' },
    Atlas: { color: 'text-[#e0e6ed]', border: 'border-[#e0e6ed]/30', bg: 'bg-[#e0e6ed]/10', hover: 'hover:bg-white/10 text-white' },
    Pulse: { color: 'text-[#00f2ff]', border: 'border-[#00f2ff]/30', bg: 'bg-[#00f2ff]/10', hover: 'hover:bg-[#00f2ff]/10 text-white' },
    Zen: { color: 'text-[#f2a100]', border: 'border-[#f2a100]/30', bg: 'bg-[#f2a100]/10', hover: 'hover:bg-[#f2a100]/10 text-white' }
  }[variant];

  // Indicators mapping
  const getIndicatorStatus = () => {
    if (!daemonActive) {
      return {
        color: 'text-[#4d5b6e] bg-[#0c1015] border-[#1a1f26]',
        textColor: 'text-[#4d5b6e]',
        badge: '● DAEMON OFFLINE',
        icon: <Shield className="w-4 h-4 text-[#4d5b6e]" />
      };
    }
    if (usagePercent >= 95) {
      return {
        color: 'text-red-500 bg-red-950/20 border-red-900/40 animate-pulse',
        textColor: 'text-red-400',
        badge: `▲ ${t('critical')}`,
        icon: <ShieldAlert className="w-4 h-4 text-red-500" />
      };
    }
    if (usagePercent >= 85) {
      return {
        color: 'text-amber-500 bg-amber-950/20 border-amber-900/40',
        textColor: 'text-amber-400',
        badge: `▲ ${t('warning')}`,
        icon: <ShieldAlert className="w-4 h-4 text-amber-500" />
      };
    }
    return {
      color: `${themeAccent.color} ${themeAccent.bg} ${themeAccent.border}`,
      textColor: themeAccent.color,
      badge: `● ${t('stable')}`,
      icon: <ShieldCheck className="w-4 h-4" />
    };
  };

  const status = getIndicatorStatus();

  const handleQuickClean = async (type: 'trash' | 'cache') => {
    setIsOpen(false);
    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'spaceguard clean' })
      });
      const data = await res.json();
      onActionComplete(data.output);
    } catch (err) {
      onActionComplete('Błąd deamona podczas szybkiego czyszczenia.');
    }
  };

  const handleScan = async () => {
    setIsOpen(false);
    try {
      const res = await fetch('/api/scan', { method: 'POST' });
      const data = await res.json();
      onActionComplete(data.output);
    } catch (err) {
      onActionComplete('Błąd deamona podczas skanowania dysku.');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Top Bar Indicator Button */}
      <button
        id="system-tray-indicator-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-none border text-xs font-mono transition-all cursor-pointer ${status.color} hover:bg-black/40`}
      >
        {status.icon}
        <span className="font-bold">{usagePercent}%</span>
        <span className="hidden md:inline text-[10px] opacity-75">AppIndicator3</span>
      </button>

      {/* Tray Dropdown Menu (GNOME styled) */}
      {isOpen && (
        <div id="tray-dropdown-menu" className={`absolute right-0 mt-2 w-72 rounded-none border border-[#1a1f26] bg-[#0c1015] shadow-2xl p-4 z-50 text-xs text-[#e0e6ed]`}>
          {/* Daemon Status Header */}
          <div className="flex items-center justify-between border-b border-[#1a1f26] pb-2.5 mb-3">
            <span className={`font-bold uppercase tracking-wider font-mono ${themeAccent.color}`}>SpaceGuard Daemon</span>
            <span className={`text-[10px] font-bold ${status.textColor}`}>
              {status.badge}
            </span>
          </div>

          {/* System resource specs */}
          <div className="grid grid-cols-2 gap-2 bg-[#080b0f] p-2 rounded-none border border-[#1a1f26] font-mono text-[10px] mb-3">
            <div className="flex items-center space-x-1.5">
              <Cpu className={`w-3.5 h-3.5 ${themeAccent.color}`} />
              <span>CPU: {simulatedCpu}%</span>
            </div>
            <div className="flex items-center space-x-1.5" title="Resident Set Size Memory (< 80 MB target)">
              <Activity className={`w-3.5 h-3.5 ${themeAccent.color}`} />
              <span>RSS: {simulatedRss} MB</span>
            </div>
          </div>

          {/* Disk summary info */}
          <div className="space-y-1.5 mb-4 border-b border-[#1a1f26] pb-3 text-[#4d5b6e]">
            <div className="flex justify-between text-[11px]">
              <span className="opacity-60">Punkt montowania:</span>
              <span className="font-bold font-mono text-[#e0e6ed]">/ (root)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="opacity-60">Zajęte miejsce:</span>
              <span className="font-bold font-mono text-[#e0e6ed]">{disk.usedGb} / {disk.totalGb} GB</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="opacity-60">Archiwa APT Cache:</span>
              <span className="font-mono text-[#e0e6ed]">{disk.cacheSizeMb} MB</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="opacity-60">Kosz użytkownika:</span>
              <span className="font-mono text-[#e0e6ed]">{disk.trashSizeMb} MB</span>
            </div>
          </div>

          {/* Actions List */}
          <div className="space-y-1 font-mono text-[11px]">
            <button
              onClick={handleScan}
              className={`w-full text-left px-2.5 py-1.5 rounded-none transition-all cursor-pointer flex items-center gap-2 ${themeAccent.hover}`}
            >
              <Activity className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span>Uruchom pełny skan dpkg/du</span>
            </button>

            <button
              onClick={() => handleQuickClean('trash')}
              disabled={disk.trashSizeMb === 0}
              className={`w-full text-left px-2.5 py-1.5 rounded-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 ${themeAccent.hover}`}
            >
              <Trash2 className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span>Wyczyść kosz systemowy</span>
            </button>

            <button
              onClick={() => handleQuickClean('cache')}
              disabled={disk.cacheSizeMb === 0}
              className={`w-full text-left px-2.5 py-1.5 rounded-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 ${themeAccent.hover}`}
            >
              <Settings className="w-3.5 h-3.5 opacity-70 shrink-0" />
              <span>Opróżnij archiwum APT (.deb)</span>
            </button>

            <div className="border-t border-[#1a1f26] my-2"></div>

            {/* Daemon Toggle Switch */}
            <div className="flex items-center justify-between px-2.5 py-1 font-mono text-[#4d5b6e]">
              <span className="opacity-60">Aktywność daemonu:</span>
              <button
                onClick={() => setDaemonActive(!daemonActive)}
                className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${
                  daemonActive ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                  daemonActive ? 'left-5.5' : 'left-1'
                }`}></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
