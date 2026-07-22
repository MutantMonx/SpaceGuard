/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PackageInfo, DiskStatus, UIViewVariant } from './types';
import { useLanguage } from './context/LanguageContext';
import {
  Shield,
  Activity,
  Cpu,
  Terminal as TerminalIcon,
  HardDrive,
  Settings,
  HelpCircle,
  FileText,
  Layers,
  ChevronRight,
  RefreshCw,
  Bell,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

import Terminal from './components/Terminal';
import GraphVisualizer from './components/GraphVisualizer';
import SystemTray from './components/SystemTray';
import PackageList from './components/PackageList';
import LogoGenerator from './components/LogoGenerator';
import PackagingView from './components/PackagingView';
import ContainerManager from './components/ContainerManager';
import DeepScanModule from './components/DeepScanModule';
import { DiskSpaceMap } from './components/DiskSpaceMap';

export default function App() {
  const { lang, setLang, toggleLang, t } = useLanguage();
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [disk, setDisk] = useState<DiskStatus>({
    totalGb: 60.0,
    usedGb: 53.4,
    freeGb: 6.6,
    trashSizeMb: 1240,
    cacheSizeMb: 2450
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cli' | 'graph' | 'logo' | 'packaging' | 'containers' | 'deepscan' | 'treemap'>('dashboard');
  const [selectedPackageName, setSelectedPackageName] = useState('metasploit-framework');
  const [variant, setVariant] = useState<UIViewVariant>('Pulse'); // Let's default to Pulse (Cyan Neon) as it maps perfectly to original design HTML
  
  // Custom toast notification system
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pl-PL', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);

      const diskRes = await fetch('/api/status');
      const diskData = await diskRes.json();
      setDisk(diskData.disk);
    } catch (err) {
      console.error('Błąd pobierania danych z serwera SpaceGuard:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReset = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        triggerToast('Baza SpaceGuard została przywrócona do stanu domyślnego.');
        fetchData();
      }
    } catch (err) {
      triggerToast('Błąd resetowania bazy.');
    }
  };

  const handleCleanAll = async () => {
    try {
      const res = await fetch('/api/clean', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        triggerToast('Pomyślnie wyczyszczono pamięć podręczną APT oraz kosz!');
        fetchData();
      }
    } catch (err) {
      triggerToast('Błąd podczas czyszczenia dysku.');
    }
  };

  // Helper theme classes mapping under Geometric Balance design language
  const getThemeClasses = () => {
    switch (variant) {
      case 'Forge':
        return {
          wrapper: 'bg-[#05070a] text-[#e0e6ed] font-sans min-h-screen relative flex flex-col bg-dot-grid border-8 border-[#1a1f26] select-none',
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative shadow-[0_0_20px_rgba(255,62,62,0.015)] rounded-none',
          badge: 'bg-[#1a1f26] text-[#ff3e3e] border border-[#ff3e3e]/20 font-mono rounded-none',
          btnPrimary: 'bg-[#ff3e3e]/10 border border-[#ff3e3e]/40 text-[#ff3e3e] hover:bg-[#ff3e3e]/25 transition-all font-mono tracking-widest uppercase text-[10px] rounded-none cursor-pointer',
          btnSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-[#ff3e3e] hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] rounded-none cursor-pointer',
          activeTab: 'bg-[#0c1015] text-[#ff3e3e] border-b-2 border-[#ff3e3e] font-bold font-mono tracking-wider rounded-none',
          inactiveTab: 'text-[#4d5b6e] hover:text-[#ff3e3e] hover:bg-[#0c1015]/40 transition-all font-mono tracking-wider rounded-none',
          textMuted: 'text-[#4d5b6e] font-mono',
          progressBar: 'bg-[#1a1f26] h-1.5 rounded-none',
          progressBarFill: 'bg-[#ff3e3e] shadow-[0_0_8px_#ff3e3e]',
          headerBg: 'bg-[#0c1015] border-b border-[#1a1f26]',
          accentBorder: 'border-[#1a1f26]',
          accentText: 'text-[#ff3e3e]',
          glowClass: 'accent-glow-red'
        };
      case 'Atlas':
        return {
          wrapper: 'bg-[#05070a] text-[#e0e6ed] font-sans min-h-screen relative flex flex-col bg-dot-grid border-8 border-[#1a1f26] select-none',
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative shadow-[0_0_20px_rgba(224,230,237,0.015)] rounded-none',
          badge: 'bg-[#1a1f26] text-[#e0e6ed] border border-[#e0e6ed]/20 font-mono rounded-none',
          btnPrimary: 'bg-white/10 border border-white/40 text-white hover:bg-white/25 transition-all font-mono tracking-widest uppercase text-[10px] rounded-none cursor-pointer',
          btnSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-white hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] rounded-none cursor-pointer',
          activeTab: 'bg-[#0c1015] text-white border-b-2 border-white font-bold font-mono tracking-wider rounded-none',
          inactiveTab: 'text-[#4d5b6e] hover:text-white hover:bg-[#0c1015]/40 transition-all font-mono tracking-wider rounded-none',
          textMuted: 'text-[#4d5b6e] font-mono',
          progressBar: 'bg-[#1a1f26] h-1.5 rounded-none',
          progressBarFill: 'bg-[#e0e6ed] shadow-[0_0_8px_#e0e6ed]',
          headerBg: 'bg-[#0c1015] border-b border-[#1a1f26]',
          accentBorder: 'border-[#1a1f26]',
          accentText: 'text-white',
          glowClass: 'accent-glow-white'
        };
      case 'Pulse':
        return {
          wrapper: 'bg-[#05070a] text-[#e0e6ed] font-sans min-h-screen relative flex flex-col bg-dot-grid border-8 border-[#1a1f26] select-none',
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative shadow-[0_0_20px_rgba(0,242,255,0.015)] rounded-none',
          badge: 'bg-[#1a1f26] text-[#00f2ff] border border-[#00f2ff]/20 font-mono rounded-none',
          btnPrimary: 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] hover:bg-[#00f2ff]/25 transition-all font-mono tracking-widest uppercase text-[10px] rounded-none cursor-pointer',
          btnSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-[#00f2ff] hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] rounded-none cursor-pointer',
          activeTab: 'bg-[#0c1015] text-[#00f2ff] border-b-2 border-[#00f2ff] font-bold font-mono tracking-wider rounded-none',
          inactiveTab: 'text-[#4d5b6e] hover:text-[#00f2ff] hover:bg-[#0c1015]/40 transition-all font-mono tracking-wider rounded-none',
          textMuted: 'text-[#4d5b6e] font-mono',
          progressBar: 'bg-[#1a1f26] h-1.5 rounded-none',
          progressBarFill: 'bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]',
          headerBg: 'bg-[#0c1015] border-b border-[#1a1f26]',
          accentBorder: 'border-[#1a1f26]',
          accentText: 'text-[#00f2ff]',
          glowClass: 'accent-glow-cyan'
        };
      case 'Zen':
        return {
          wrapper: 'bg-[#05070a] text-[#e0e6ed] font-sans min-h-screen relative flex flex-col bg-dot-grid border-8 border-[#1a1f26] select-none',
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative shadow-[0_0_20px_rgba(242,161,0,0.015)] rounded-none',
          badge: 'bg-[#1a1f26] text-[#f2a100] border border-[#f2a100]/20 font-mono rounded-none',
          btnPrimary: 'bg-[#f2a100]/10 border border-[#f2a100]/40 text-[#f2a100] hover:bg-[#f2a100]/25 transition-all font-mono tracking-widest uppercase text-[10px] rounded-none cursor-pointer',
          btnSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-[#f2a100] hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] rounded-none cursor-pointer',
          activeTab: 'bg-[#0c1015] text-[#f2a100] border-b-2 border-[#f2a100] font-bold font-mono tracking-wider rounded-none',
          inactiveTab: 'text-[#4d5b6e] hover:text-[#f2a100] hover:bg-[#0c1015]/40 transition-all font-mono tracking-wider rounded-none',
          textMuted: 'text-[#4d5b6e] font-mono',
          progressBar: 'bg-[#1a1f26] h-1.5 rounded-none',
          progressBarFill: 'bg-[#f2a100] shadow-[0_0_8px_#f2a100]',
          headerBg: 'bg-[#0c1015] border-b border-[#1a1f26]',
          accentBorder: 'border-[#1a1f26]',
          accentText: 'text-[#f2a100]',
          glowClass: 'accent-glow-amber'
        };
    }
  };

  const style = getThemeClasses();
  const usagePercent = Math.round((disk.usedGb / disk.totalGb) * 100);

  return (
    <div className={style.wrapper}>
      {/* Header Top Bar matching Geometric Balance console style */}
      <header className={`px-8 py-4 border-b border-[#1a1f26] bg-[#0c1015] flex flex-col lg:flex-row items-center justify-between gap-4 z-30 sticky top-0`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 border-2 rotate-45 flex items-center justify-center shrink-0 ${style.accentText} border-current`}>
            <div className="w-4 h-4 bg-current"></div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className={`text-xl font-bold tracking-[0.2em] uppercase font-sans ${style.accentText}`}>{t('appTitle')}</h1>
              <span className="text-[10px] opacity-40 font-mono tracking-widest">v1.2.0</span>
            </div>
            <p className="text-[9px] text-[#4d5b6e] font-mono tracking-wider uppercase leading-none mt-1">{t('appSubtitle')}</p>
          </div>
        </div>

        {/* Real-time Telemetry & Dynamic Clock */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono tracking-widest uppercase text-[#e0e6ed]/80">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-current animate-pulse ${style.accentText} ${style.glowClass}`}></span>
            <span>SYSTEM OPERATIONAL</span>
          </div>
          <div>TIME: {currentTime || '14:42:09'}</div>
          <div className="hidden sm:block text-[#4d5b6e]">SECTOR: LEO-A4</div>
        </div>

        {/* Language Switcher & UI Theme Selection & AppIndicator3 Tray dropdown */}
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          {/* Language Switcher Toggle */}
          <div className="flex bg-black/40 p-0.5 border border-[#1a1f26] text-[10px] font-mono tracking-wider items-center">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 cursor-pointer transition-all flex items-center gap-1 ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'text-[#4d5b6e] hover:text-zinc-300'}`}
              title="Switch to English (Default)"
            >
              <span>🇬🇧</span> EN
            </button>
            <button
              onClick={() => setLang('pl')}
              className={`px-2 py-1 cursor-pointer transition-all flex items-center gap-1 ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40' : 'text-[#4d5b6e] hover:text-zinc-300'}`}
              title="Przełącz na język polski"
            >
              <span>🇵🇱</span> PL
            </button>
          </div>

          <div className="flex bg-black/40 p-0.5 border border-[#1a1f26] text-[10px] font-mono tracking-wider items-center">
            <button
              onClick={() => { setVariant('Forge'); triggerToast('Zmieniono schemat na U1 Forge (Kali Dark Crimson)'); }}
              className={`px-2.5 py-1 cursor-pointer transition-all ${variant === 'Forge' ? 'bg-[#ff3e3e]/10 text-[#ff3e3e] font-bold border border-[#ff3e3e]/30' : 'text-[#4d5b6e] hover:text-zinc-400'}`}
            >
              U1 Forge
            </button>
            <button
              onClick={() => { setVariant('Atlas'); triggerToast('Zmieniono schemat na U2 Atlas (Silver Monolith)'); }}
              className={`px-2.5 py-1 cursor-pointer transition-all ${variant === 'Atlas' ? 'bg-white/10 text-white font-bold border border-white/30' : 'text-[#4d5b6e] hover:text-zinc-400'}`}
            >
              U2 Atlas
            </button>
            <button
              onClick={() => { setVariant('Pulse'); triggerToast('Zmieniono schemat na U3 Pulse (Cyan Geometric Balance)'); }}
              className={`px-2.5 py-1 cursor-pointer transition-all ${variant === 'Pulse' ? 'bg-[#00f2ff]/10 text-[#00f2ff] font-bold border border-[#00f2ff]/30' : 'text-[#4d5b6e] hover:text-zinc-400'}`}
            >
              U3 Pulse
            </button>
            <button
              onClick={() => { setVariant('Zen'); triggerToast('Zmieniono schemat na U4 Zen (Amber Clean Orbit)'); }}
              className={`px-2.5 py-1 cursor-pointer transition-all ${variant === 'Zen' ? 'bg-[#f2a100]/10 text-[#f2a100] font-bold border border-[#f2a100]/30' : 'text-[#4d5b6e] hover:text-zinc-400'}`}
            >
              U4 Zen
            </button>
          </div>

          <SystemTray
            disk={disk}
            onActionComplete={(msg) => { triggerToast(msg); fetchData(); }}
            variant={variant}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 space-y-4">
        
        {/* Toast Warning */}
        {toast.show && (
          <div id="app-toast-alert" className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg border shadow-2xl z-50 flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
            variant === 'Forge' ? 'bg-zinc-950 border-red-950 text-red-400' :
            variant === 'Atlas' ? 'bg-white border-slate-200 text-slate-800' :
            variant === 'Pulse' ? 'bg-slate-950 border-cyan-950 text-cyan-400' :
            'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <Bell className="w-4 h-4 shrink-0 text-red-500 animate-bounce mt-0.5" />
            <div className="text-xs">
              <span className="font-bold uppercase tracking-wider block mb-0.5">Komunikat Demona</span>
              <p className="opacity-95 leading-relaxed">{toast.message}</p>
            </div>
          </div>
        )}

        {/* RENDER LAYOUT BASED ON ACTIVE VARIANT OR ACTIVE TAB */}

        {/* 1. VARIANT ZEN DEEP CLEAN (U4 Zen - Focused Circular Actions) */}
        {variant === 'Zen' ? (
          <div id="u4-zen-layout" className="py-12 flex flex-col items-center justify-center space-y-8 max-w-xl mx-auto">
            {/* Minimal disk circular status */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  strokeWidth="10"
                  fill="transparent"
                  className="stroke-neutral-800"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - usagePercent / 100)}`}
                  className={`transition-all duration-1000 stroke-linecap-round ${
                    usagePercent >= 95 ? 'stroke-red-500' : usagePercent >= 85 ? 'stroke-amber-500' : 'stroke-white'
                  }`}
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-6xl font-black font-mono tracking-tighter">{usagePercent}%</span>
                <span className="text-[10px] uppercase tracking-widest opacity-40 mt-1">zajęte miejsce</span>
                <span className="text-xs opacity-60 mt-1 font-mono">{disk.freeGb} GB wolnych</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">SpaceGuard Zen - Prosta Optymalizacja</h2>
              <p className="text-xs text-neutral-400 max-w-md">
                Wykryto łącznie <strong className="text-white">{disk.trashSizeMb + disk.cacheSizeMb} MB</strong> w pamięci podręcznej instalacji APT oraz koszu systemowym. Możesz natychmiast zwolnić to miejsce za pomocą jednego przycisku.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCleanAll}
                disabled={disk.trashSizeMb === 0 && disk.cacheSizeMb === 0}
                className="px-8 py-4 rounded-full font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-200 cursor-pointer disabled:opacity-40 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Uruchom szybkie czyszczenie</span>
              </button>
              <button
                onClick={() => { setVariant('Forge'); setActiveTab('dashboard'); }}
                className="px-5 py-4 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-750 cursor-pointer transition-all"
              >
                Pokaż zaawansowane opcje
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD FULL DASHBOARDS (U1 Forge, U2 Atlas, U3 Pulse) */
          <>
            {/* Top Deck Disk Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Stat 1: Storage Indicator */}
              <div id="disk-utilization-card" className={`p-4 rounded-lg border ${style.card}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-1.5 opacity-60">
                    <HardDrive className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('diskUsage')} (/)</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    usagePercent >= 95 ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                    usagePercent >= 85 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {usagePercent >= 95 ? t('critical') : usagePercent >= 85 ? t('warning') : t('stable')}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-black font-mono tracking-tight">{disk.usedGb} GB</span>
                    <span className="text-xs opacity-50 font-mono">{t('ofTotal', { total: disk.totalGb.toString() })}</span>
                  </div>

                  {/* Progress bar */}
                  <div className={`w-full h-2 rounded-full overflow-hidden ${style.progressBar}`}>
                    <div
                      className={`h-full transition-all duration-700 ${style.progressBarFill} ${
                        usagePercent >= 95 ? 'bg-red-500' : usagePercent >= 85 ? 'bg-amber-500' : ''
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] opacity-40 font-mono">
                    <span>{usagePercent}% {t('used')}</span>
                    <span>{disk.freeGb} GB {t('free')}</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('deepscan')}
                      className={`w-full py-1 rounded text-[9px] font-mono font-bold uppercase text-center border cursor-pointer transition-all ${
                        variant === 'Forge' ? 'bg-[#ff3e3e]/10 border-[#ff3e3e]/30 text-[#ff3e3e] hover:bg-[#ff3e3e]/20' :
                        variant === 'Atlas' ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' :
                        variant === 'Pulse' ? 'bg-[#00f2ff]/10 border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/20' :
                        'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-[#f2a100]/20'
                      }`}
                    >
                      🔍 {t('btnDeepScan')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat 2: Trash space */}
              <div id="trash-capacity-card" className={`p-4 rounded-lg border ${style.card}`}>
                <div className="flex items-center space-x-1.5 opacity-60 mb-2">
                  <HardDrive className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('trashBin')}</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-2xl font-black font-mono">{disk.trashSizeMb} MB</span>
                  <span className="text-[10px] opacity-40">user files</span>
                </div>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/cli', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ command: 'spaceguard clean' })
                    });
                    const d = await res.json();
                    triggerToast(t('trashEmptied'));
                    fetchData();
                  }}
                  disabled={disk.trashSizeMb === 0}
                  className={`w-full py-1.5 rounded text-[10px] font-bold uppercase text-center transition-all cursor-pointer ${
                    disk.trashSizeMb === 0 ? 'opacity-30 cursor-not-allowed' : style.btnPrimary
                  }`}
                >
                  {t('btnEmptyTrash')}
                </button>
              </div>

              {/* Stat 3: APT Cache size */}
              <div id="apt-cache-card" className={`p-4 rounded-lg border ${style.card}`}>
                <div className="flex items-center space-x-1.5 opacity-60 mb-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('aptCache')}</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-2xl font-black font-mono">{disk.cacheSizeMb} MB</span>
                  <span className="text-[10px] opacity-40">downloaded (.deb)</span>
                </div>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/cli', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ command: 'spaceguard clean' })
                    });
                    triggerToast(t('aptCacheCleared'));
                    fetchData();
                  }}
                  disabled={disk.cacheSizeMb === 0}
                  className={`w-full py-1.5 rounded text-[10px] font-bold uppercase text-center transition-all cursor-pointer ${
                    disk.cacheSizeMb === 0 ? 'opacity-30 cursor-not-allowed' : style.btnPrimary
                  }`}
                >
                  {t('btnClearCache')}
                </button>
              </div>

              {/* Stat 4: Active Daemon state indicator */}
              <div id="daemon-active-monitor" className={`p-4 rounded-lg border ${style.card}`}>
                <div className="flex items-center space-x-1.5 opacity-60 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Daemon SpaceGuard</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-50">Resident Memory:</span>
                    <span className="font-mono font-bold">~38.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50">Limit kontenera:</span>
                    <span className="font-mono text-zinc-400">80 MB Max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50">Zarejestrowane pakiety:</span>
                    <span className="font-mono">{packages.length}</span>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 flex gap-1">
                    <button
                      onClick={handleReset}
                      className="text-[9px] font-bold uppercase text-center w-full py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-300"
                    >
                      Resetuj symulację
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Section Switcher Navigation Tabs */}
            <div className={`flex flex-wrap border-b text-xs ${style.accentBorder}`}>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'dashboard' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabDashboard')}
              </button>
              <button
                onClick={() => setActiveTab('cli')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'cli' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabCli')}
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'graph' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabGraph')}
              </button>
              <button
                onClick={() => setActiveTab('logo')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'logo' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabLogo')}
              </button>
              <button
                onClick={() => setActiveTab('packaging')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'packaging' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabPackaging')}
              </button>
              <button
                onClick={() => setActiveTab('containers')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'containers' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabContainers')}
              </button>
              <button
                onClick={() => setActiveTab('deepscan')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all ${
                  activeTab === 'deepscan' ? style.activeTab + ' border-current' : style.inactiveTab + ' border-transparent'
                }`}
              >
                {t('tabDeepScan')}
              </button>
              <button
                onClick={() => setActiveTab('treemap')}
                className={`px-4 py-2.5 border-b-2 -mb-[2px] cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeTab === 'treemap' ? style.activeTab + ' border-current font-bold' : style.inactiveTab + ' border-transparent'
                }`}
              >
                <span>🗺️</span>
                <span>{t('tabTreemap')}</span>
              </button>
            </div>

            {/* TAB OUTLET CONTENT */}
            <div className="space-y-4">
              {activeTab === 'dashboard' && (
                <PackageList
                  packages={packages}
                  disk={disk}
                  onActionComplete={(msg) => { triggerToast(msg); fetchData(); }}
                  onSelectPackageGraph={(name) => { setSelectedPackageName(name); setActiveTab('graph'); }}
                  variant={variant}
                  fetchData={fetchData}
                />
              )}

              {activeTab === 'cli' && (
                <Terminal
                  variant={variant}
                  onCommandExecuted={(output) => {
                    // Update disk states if clean command was invoked
                    if (output.includes('czyszczenie') || output.includes('usuwania') || output.includes('Zwolniono') || output.includes('Usunięto')) {
                      fetchData();
                    }
                  }}
                />
              )}

              {activeTab === 'graph' && (
                <GraphVisualizer
                  packages={packages}
                  selectedPackageName={selectedPackageName}
                  onSelectPackage={(name) => setSelectedPackageName(name)}
                  variant={variant}
                />
              )}

              {activeTab === 'logo' && (
                <LogoGenerator variant={variant} />
              )}

              {activeTab === 'packaging' && (
                <PackagingView variant={variant} />
              )}

              {activeTab === 'containers' && (
                <ContainerManager
                  variant={variant}
                  onActionComplete={(msg) => { triggerToast(msg); fetchData(); }}
                  disk={disk}
                  fetchData={fetchData}
                />
              )}

              {activeTab === 'deepscan' && (
                <DeepScanModule
                  variant={variant}
                  onActionComplete={(msg) => { triggerToast(msg); fetchData(); }}
                  disk={disk}
                  fetchData={fetchData}
                />
              )}

              {activeTab === 'treemap' && (
                <DiskSpaceMap
                  language={lang}
                  onNavigateToGraph={(pkgName) => {
                    setSelectedPackageName(pkgName);
                    setActiveTab('graph');
                  }}
                  onRefreshDiskStatus={fetchData}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Robust scifi console footer with monx.one branding */}
      <footer className="border-t border-[#1a1f26] bg-[#0c1015] flex flex-col md:flex-row items-center px-6 py-4 justify-between text-xs font-mono text-[#4d5b6e] gap-4 shrink-0">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <a
            href="https://monx.one/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-bold transition-all group"
          >
            <img src="/monx_one_logo.svg" alt="monx.one logo" className="h-5 opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="underline underline-offset-4 decoration-cyan-500/40 group-hover:decoration-cyan-400">
              created by monx.one
            </span>
          </a>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="text-slate-400">All rights reserved under Apache License 2.0</div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <div>SPACEGUARD © 2026 DEBIAN OPTIMIZER</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse bg-current ${style.accentText} ${style.glowClass}`}></div>
            <span className="tracking-widest">ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
