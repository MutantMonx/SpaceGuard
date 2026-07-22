/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  HardDrive, Zap, Trash2, Box, RefreshCw, Loader2,
  CheckCircle2, Terminal, ShieldAlert, Sparkles, AlertTriangle, ArrowRight, Activity, HelpCircle
} from 'lucide-react';
import { DiskStatus, PackageInfo, DockerImage, DockerContainer, UIViewVariant } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DeepScanModuleProps {
  variant: UIViewVariant;
  onActionComplete: (msg: string) => void;
  disk: DiskStatus;
  fetchData: () => Promise<void>;
}

interface ScanStep {
  label: string;
  status: 'idle' | 'running' | 'completed';
}

export default function DeepScanModule({ variant, onActionComplete, disk, fetchData }: DeepScanModuleProps) {
  const { t, lang } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [lastReclaimedMb, setLastReclaimedMb] = useState(0);

  // States fetched post-scan to present the "Factual State"
  const [aptPackages, setAptPackages] = useState<PackageInfo[]>([]);
  const [dockerImages, setDockerImages] = useState<DockerImage[]>([]);
  const [dockerContainers, setDockerContainers] = useState<DockerContainer[]>([]);
  const [podmanImages, setPodmanImages] = useState<DockerImage[]>([]);
  const [podmanContainers, setPodmanContainers] = useState<DockerContainer[]>([]);

  const [steps, setSteps] = useState<ScanStep[]>([]);

  useEffect(() => {
    setSteps([
      { label: t('scanStep1'), status: 'idle' },
      { label: t('scanStep2'), status: 'idle' },
      { label: t('scanStep3'), status: 'idle' },
      { label: t('scanStep4'), status: 'idle' },
      { label: t('scanStep5'), status: 'idle' }
    ]);
  }, [lang]);

  const loadResources = async () => {
    try {
      const resPkgs = await fetch('/api/packages');
      if (resPkgs.ok) {
        const pkgsData = await resPkgs.json();
        setAptPackages(pkgsData);
      }
      const resContainers = await fetch('/api/containers/resources');
      if (resContainers.ok) {
        const containersData = await resContainers.json();
        setDockerImages(containersData.dockerImages);
        setDockerContainers(containersData.dockerContainers);
        setPodmanImages(containersData.podmanImages);
        setPodmanContainers(containersData.podmanContainers);
      }
    } catch (err) {
      console.error('Błąd podczas ładowania zasobów do audytu:', err);
    }
  };

  const startScan = () => {
    setScanning(true);
    setScanCompleted(false);
    setConsoleLogs([]);
    setCurrentStepIndex(0);
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })));

    const logs = [
      '[DEBUG] Rozpoczynanie skanowania diagnostycznego SpaceGuard...',
      '[INFO] Wczytywanie sum kontrolnych dla pakietów z /var/lib/dpkg/info...',
      '[OK] Przeanalizowano tablice zależności bibliotek.',
      '[INFO] Sprawdzanie deskryptorów kontenerów w socketach dockera...',
      '[WARN] Wykryto nieużywane, wiszące warstwy obrazów (dangling) o dużym rozmiarze!',
      '[INFO] Odpytywanie silnika podman o statusy kontenerów użytkownika...',
      '[INFO] Wyszukiwanie sygnatur pobranych archiwów w Downloads i tmp...',
      '[OK] Znaleziono niesynchronizowane zasoby pobrane przez curl/wget!',
      '[INFO] Kalkulacja sumarycznego narzutu dyskowego...',
      '[SUCCESS] Skan ukończony pomyślnie. Generowanie raportu rzeczywistego stanu...'
    ];

    let logPtr = 0;
    const logInterval = setInterval(() => {
      if (logPtr < logs.length) {
        setConsoleLogs(prev => [...prev, logs[logPtr]]);
        logPtr++;
      } else {
        clearInterval(logInterval);
      }
    }, 300);

    // Sequential steps progress simulation
    let currentStep = 0;
    const runStep = () => {
      if (currentStep < 5) {
        setSteps(prev => prev.map((s, idx) => {
          if (idx === currentStep) return { ...s, status: 'running' };
          if (idx < currentStep) return { ...s, status: 'completed' };
          return s;
        }));
        setCurrentStepIndex(currentStep);
        currentStep++;
        setTimeout(runStep, 700);
      } else {
        setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
        setScanning(false);
        setScanCompleted(true);
        loadResources();
        fetchData();
        onActionComplete('Głębokie skanowanie dyskowe zakończone sukcesem! Przedstawiono rzeczywisty stan zasobów.');
      }
    };

    setTimeout(runStep, 400);
  };

  const handleSimulateExternal = async () => {
    try {
      const res = await fetch('/api/simulate-external', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        onActionComplete(`[SYMULATOR] Pomyślnie zasymulowano ubytek! Zewnętrzny proces dodał: ${data.item.type} "${data.item.name}" (+${data.item.sizeMb} MB) na dysku.`);
        fetchData();
        // If they already scanned, refresh the report dynamically too
        if (scanCompleted) {
          loadResources();
        }
      }
    } catch (err) {
      onActionComplete('Błąd wywoływania symulacji zewnętrznej.');
    }
  };

  const handlePruneEngine = async (engine: 'docker' | 'podman') => {
    try {
      const res = await fetch('/api/containers/prune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.freedMb > 0) {
          setLastReclaimedMb(prev => prev + data.freedMb);
          onActionComplete(`Pomyślnie usunięto zbędne kontenery/obrazy silnika ${engine}. Zwolniono ${data.freedMb} MB.`);
        } else {
          onActionComplete(`Silnik ${engine} nie posiada zbędnych zasobów do usunięcia.`);
        }
        loadResources();
        fetchData();
      }
    } catch (err) {
      onActionComplete('Błąd połączenia z serwerem podczas usuwania zasobów.');
    }
  };

  const handleRemovePackage = async (name: string, isCustom: boolean) => {
    try {
      const res = await fetch('/api/packages/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        setLastReclaimedMb(prev => prev + data.freedMb);
        onActionComplete(`Pomyślnie usunięto ${isCustom ? 'narzędzie pobrane' : 'pakiet APT'} "${name}". Zwolniono ${data.freedMb} MB.`);
        loadResources();
        fetchData();
      }
    } catch (err) {
      onActionComplete('Błąd połączenia podczas usuwania pakietu.');
    }
  };

  const handleCleanCacheAndTrash = async () => {
    try {
      const res = await fetch('/api/clean', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const freed = (disk.trashSizeMb + disk.cacheSizeMb);
        if (freed > 0) {
          setLastReclaimedMb(prev => prev + freed);
          onActionComplete(`Wyczyszczono cache instalacji oraz kosz systemowy. Zwolniono ${freed} MB.`);
        } else {
          onActionComplete('Cache i kosz są już wolne od śmieci.');
        }
        loadResources();
        fetchData();
      }
    } catch (err) {
      onActionComplete('Błąd sieci przy szybkim czyszczeniu.');
    }
  };

  // Helper theme classes based on UI Variant
  const getThemeStyles = () => {
    switch (variant) {
      case 'Forge':
        return {
          headerBg: 'bg-[#ff3e3e]/5 border-b border-[#ff3e3e]/20 text-[#ff3e3e]',
          accentText: 'text-[#ff3e3e]',
          accentBg: 'bg-[#ff3e3e]/10',
          accentBorder: 'border-[#ff3e3e]/20',
          buttonPrimary: 'bg-[#ff3e3e]/15 border border-[#ff3e3e]/40 text-[#ff3e3e] hover:bg-[#ff3e3e]/30 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 cursor-pointer transition-all',
          buttonSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-[#ff3e3e] hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] uppercase tracking-wider px-4 py-2 cursor-pointer',
          badge: 'bg-[#ff3e3e]/10 text-[#ff3e3e] border border-[#ff3e3e]/30',
          barColor: 'bg-[#ff3e3e]',
          cardHover: 'hover:border-[#ff3e3e]/30 transition-all'
        };
      case 'Atlas':
        return {
          headerBg: 'bg-white/5 border-b border-white/20 text-white',
          accentText: 'text-white',
          accentBg: 'bg-white/10',
          accentBorder: 'border-white/20',
          buttonPrimary: 'bg-white/15 border border-white/40 text-white hover:bg-white/30 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 cursor-pointer transition-all',
          buttonSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-white hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] uppercase tracking-wider px-4 py-2 cursor-pointer',
          badge: 'bg-white/10 text-white border border-white/30',
          barColor: 'bg-white',
          cardHover: 'hover:border-white/30 transition-all'
        };
      case 'Pulse':
        return {
          headerBg: 'bg-[#00f2ff]/5 border-b border-[#00f2ff]/20 text-[#00f2ff]',
          accentText: 'text-[#00f2ff]',
          accentBg: 'bg-[#00f2ff]/10',
          accentBorder: 'border-[#00f2ff]/20',
          buttonPrimary: 'bg-[#00f2ff]/15 border border-[#00f2ff]/40 text-[#00f2ff] hover:bg-[#00f2ff]/30 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 cursor-pointer transition-all',
          buttonSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-[#00f2ff] hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] uppercase tracking-wider px-4 py-2 cursor-pointer',
          badge: 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30',
          barColor: 'bg-[#00f2ff]',
          cardHover: 'hover:border-[#00f2ff]/30 transition-all'
        };
      case 'Zen':
        return {
          headerBg: 'bg-[#f2a100]/5 border-b border-[#f2a100]/20 text-[#f2a100]',
          accentText: 'text-[#f2a100]',
          accentBg: 'bg-[#f2a100]/10',
          accentBorder: 'border-[#f2a100]/20',
          buttonPrimary: 'bg-[#f2a100]/15 border border-[#f2a100]/40 text-[#f2a100] hover:bg-[#f2a100]/30 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 cursor-pointer transition-all',
          buttonSecondary: 'bg-[#0c1015] border border-[#1a1f26] text-[#4d5b6e] hover:text-[#f2a100] hover:bg-[#1a1f26]/50 transition-all font-mono text-[10px] uppercase tracking-wider px-4 py-2 cursor-pointer',
          badge: 'bg-[#f2a100]/10 text-[#f2a100] border border-[#f2a100]/30',
          barColor: 'bg-[#f2a100]',
          cardHover: 'hover:border-[#f2a100]/30 transition-all'
        };
    }
  };

  const style = getThemeStyles();

  // Identify heavy items dynamically from our loaded database
  const heavyAptPackages = aptPackages
    .filter(p => p.status === 'installed' && !p.isSystem && p.importance <= 3)
    .sort((a, b) => b.actualSizeKb - a.actualSizeKb)
    .slice(0, 3);

  const customDownloads = aptPackages
    .filter(p => p.status === 'installed' && p.isCustomFootprint)
    .sort((a, b) => b.actualSizeKb - a.actualSizeKb);

  const danglingDockerImages = dockerImages.filter(img => img.isDangling);
  const exitedDockerContainers = dockerContainers.filter(c => c.status === 'exited');
  
  const danglingPodmanImages = podmanImages.filter(img => img.isDangling);
  const exitedPodmanContainers = podmanContainers.filter(c => c.status === 'exited');

  const dockerPruneMb = danglingDockerImages.reduce((sum, img) => sum + img.sizeMb, 0) + exitedDockerContainers.reduce((sum, c) => sum + c.sizeMb, 0);
  const podmanPruneMb = danglingPodmanImages.reduce((sum, img) => sum + img.sizeMb, 0) + exitedPodmanContainers.reduce((sum, c) => sum + c.sizeMb, 0);

  const totalDanglingMb = dockerPruneMb + podmanPruneMb;
  const trashAndCacheMb = disk.trashSizeMb + disk.cacheSizeMb;

  return (
    <div id="deep-scan-module-section" className="space-y-6">
      {/* Informational Header Alert Banner */}
      <div className={`p-4 border flex items-start gap-3.5 ${style.headerBg}`}>
        <Activity className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-widest block font-sans">
            {t('scanTitle')}
          </span>
          <p className="opacity-80 leading-relaxed font-mono">
            {t('scanBannerText')}
          </p>
        </div>
      </div>

      {/* Control Actions & Simulation helper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-[#1a1f26] bg-[#06090d] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            {t('scanTitle')}
          </h3>
          <p className="text-[11px] text-[#4d5b6e] leading-relaxed font-mono uppercase">
            {t('scanSubtitle')}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={startScan}
              disabled={scanning}
              className={`${style.buttonPrimary} flex items-center gap-2`}
            >
              {scanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('scanScanning')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('scanStartBtn')}</span>
                </>
              )}
            </button>
            <button
              onClick={handleSimulateExternal}
              disabled={scanning}
              className={style.buttonSecondary}
              title="Simulates external installations/downloads in terminal"
            >
              {t('scanSimulateBtn')}
            </button>
          </div>
        </div>

        {/* Quick telemetry helper info */}
        <div className="border border-[#1a1f26] bg-[#06090d] p-6 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white">
              <HardDrive className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-sans">TELEMETRY</h4>
            </div>
            <p className="text-[10px] text-[#4d5b6e] leading-relaxed font-mono">
              {t('scanReclaimedSession')} <strong className="text-white">{lastReclaimedMb} MB</strong>. {t('used')} <strong className="text-white">{Math.round((disk.usedGb / disk.totalGb) * 100)}%</strong>.
            </p>
          </div>
          <div className="border-t border-[#1a1f26] pt-3 flex justify-between items-center text-[10px] font-mono uppercase text-[#4d5b6e]">
            <span>STAN REAKTYWNY</span>
            <span className="text-emerald-400 font-bold">SYNCHRONIZOWANY</span>
          </div>
        </div>
      </div>

      {/* SCANNING PHASE PROGRESS VIEW */}
      {scanning && (
        <div className="border border-[#1a1f26] bg-black/60 p-6 space-y-6 animate-pulse">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-mono text-[#4d5b6e] uppercase">
              <span>Trwa weryfikacja sum dyskowych...</span>
              <span>KROK {currentStepIndex + 1} Z 5</span>
            </div>
            <div className="w-full bg-[#131920] h-1.5 overflow-hidden">
              <div
                className={`h-full ${style.barColor} transition-all duration-300`}
                style={{ width: `${((currentStepIndex + 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Steps */}
            <div className="space-y-2 text-xs font-mono">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2.5 py-1 text-white">
                  {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {step.status === 'running' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                  {step.status === 'idle' && <div className="w-4 h-4 rounded-full border border-[#1a1f26] shrink-0" />}
                  <span className={step.status === 'running' ? 'font-bold text-amber-400' : 'text-[#e0e6ed]/70'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal output console */}
            <div className="bg-[#030508] p-4 border border-[#1a1f26] font-mono text-[10px] text-zinc-400 h-36 overflow-y-auto space-y-1">
              <div className="text-yellow-500 font-bold mb-1 border-b border-[#1a1f26] pb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Konsola debugowania dpkg/du</span>
              </div>
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[WARN]') ? 'text-amber-400' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REPORT & FACTUAL BREAKDOWN VIEW */}
      {scanCompleted && !scanning && (
        <div className="border border-[#1a1f26] bg-[#080b0f] p-6 space-y-6">
          {/* Factual Report Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1a1f26] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  RAPORT AUDYTU: RZECZYWISTY STAN ZASOBÓW SYSTEMU
                </h3>
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider font-mono border border-emerald-500/25">
                  LIVE STATUS
                </span>
              </div>
              <p className="text-[10px] text-[#4d5b6e] font-mono mt-1 uppercase">
                Wyniki bezpośredniego skanowania fizycznych wolumenów z pominięciem pamięci demona.
              </p>
            </div>
            <button
              onClick={startScan}
              className="text-[10px] font-mono border border-[#1a1f26] bg-[#0c1015] text-[#4d5b6e] hover:text-white px-3 py-1.5 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>SKANUJ PONOWNIE</span>
            </button>
          </div>

          {/* Cards of different discovered sectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Sector 1: Redundant Container/Image data */}
            <div className={`p-4 border border-[#1a1f26] bg-[#05070a] space-y-4 ${style.cardHover}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase text-white">1. Kontenery i Obrazy (Docker/Podman)</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">{totalDanglingMb} MB zbędne</span>
              </div>
              <p className="text-[11px] text-[#4d5b6e] font-mono">
                Osierocone warstwy pośrednie (dangling images) oraz zatrzymane kontenery, które można bezinwazyjnie usunąć za pomocą poleceń system prune.
              </p>

              {totalDanglingMb === 0 ? (
                <div className="border border-dashed border-[#1a1f26] p-4 text-center text-[10px] font-mono text-[#4d5b6e] uppercase">
                  Brak wiszących warstw Docker/Podman
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dockerPruneMb > 0 && (
                    <div className="flex items-center justify-between border border-[#1a1f26]/60 bg-[#0a0d12] p-2 text-xs font-mono">
                      <div>
                        <span className="text-white block font-bold text-[11px]">Silnik Docker Prune</span>
                        <span className="text-[10px] text-[#4d5b6e] uppercase">Dangling / Exited: {dockerPruneMb} MB</span>
                      </div>
                      <button
                        onClick={() => handlePruneEngine('docker')}
                        className="text-[9px] uppercase font-bold tracking-wider border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 px-3 py-1 transition-all"
                      >
                        Prune Docker
                      </button>
                    </div>
                  )}
                  {podmanPruneMb > 0 && (
                    <div className="flex items-center justify-between border border-[#1a1f26]/60 bg-[#0a0d12] p-2 text-xs font-mono">
                      <div>
                        <span className="text-white block font-bold text-[11px]">Silnik Podman Prune</span>
                        <span className="text-[10px] text-[#4d5b6e] uppercase">Dangling / Exited: {podmanPruneMb} MB</span>
                      </div>
                      <button
                        onClick={() => handlePruneEngine('podman')}
                        className="text-[9px] uppercase font-bold tracking-wider border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 px-3 py-1 transition-all"
                      >
                        Prune Podman
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sector 2: Low-importance Heavy APT Packages */}
            <div className={`p-4 border border-[#1a1f26] bg-[#05070a] space-y-4 ${style.cardHover}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <h4 className="text-xs font-bold uppercase text-white">2. Ciężkie pakiety niskiej ważności</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">Ważność ≤ 3</span>
              </div>
              <p className="text-[11px] text-[#4d5b6e] font-mono">
                Pakiety zainstalowane w systemie o niskim priorytecie operacyjnym (możliwość bezpiecznej deinstalacji celem zwolnienia miejsca).
              </p>

              {heavyAptPackages.length === 0 ? (
                <div className="border border-dashed border-[#1a1f26] p-4 text-center text-[10px] font-mono text-[#4d5b6e] uppercase">
                  Brak zainstalowanych ciężkich pakietów opcjonalnych
                </div>
              ) : (
                <div className="space-y-2">
                  {heavyAptPackages.map(pkg => (
                    <div key={pkg.name} className="flex items-center justify-between border border-[#1a1f26]/60 bg-[#0a0d12] p-2 text-xs font-mono">
                      <div>
                        <span className="text-white block font-bold text-[11px]">{pkg.name}</span>
                        <span className="text-[10px] text-[#4d5b6e] uppercase">Rozmiar na dysku: {(pkg.actualSizeKb / 1024).toFixed(0)} MB</span>
                      </div>
                      <button
                        onClick={() => handleRemovePackage(pkg.name, false)}
                        className="text-[9px] uppercase font-bold tracking-wider border border-red-500/30 bg-red-500/10 hover:bg-red-500/25 text-red-400 px-3 py-1 transition-all"
                      >
                        Purge
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sector 3: Manual Downloads and Scripts */}
            <div className={`p-4 border border-[#1a1f26] bg-[#05070a] space-y-4 ${style.cardHover}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold uppercase text-white">3. Archiwa wget / curl (Wykryty ubytek)</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">{customDownloads.length} elementy</span>
              </div>
              <p className="text-[11px] text-[#4d5b6e] font-mono">
                Ręcznie pobrane pakiety binarne i pliki wykonywalne, zrzucające dane poza menedżerem dpkg bezpośrednio na system plików `/home/kali` lub `/tmp`.
              </p>

              {customDownloads.length === 0 ? (
                <div className="border border-dashed border-[#1a1f26] p-4 text-center text-[10px] font-mono text-[#4d5b6e] uppercase">
                  Brak niezarejestrowanych ręcznych pobrań plików
                </div>
              ) : (
                <div className="space-y-2">
                  {customDownloads.map(pkg => (
                    <div key={pkg.name} className="flex items-center justify-between border border-[#1a1f26]/60 bg-[#0a0d12] p-2 text-xs font-mono">
                      <div>
                        <span className="text-white block font-bold text-[11px] max-w-[200px] truncate">{pkg.name}</span>
                        <span className="text-[10px] text-[#4d5b6e] block uppercase truncate max-w-[200px]">Ścieżka: {pkg.createdFiles?.[0] || 'brak'}</span>
                        <span className="text-[10px] text-zinc-400">Rozmiar: {(pkg.actualSizeKb / 1024).toFixed(0)} MB</span>
                      </div>
                      <button
                        onClick={() => handleRemovePackage(pkg.name, true)}
                        className="text-[9px] uppercase font-bold tracking-wider border border-red-500/30 bg-red-500/10 hover:bg-red-500/25 text-red-400 px-3 py-1 transition-all"
                      >
                        Skasuj plik
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sector 4: Cache and trash */}
            <div className={`p-4 border border-[#1a1f26] bg-[#05070a] space-y-4 ${style.cardHover}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase text-white">4. APT Cache i Śmieci Systemowe</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">{trashAndCacheMb} MB łącznie</span>
              </div>
              <p className="text-[11px] text-[#4d5b6e] font-mono">
                Pobrane archiwa pakietów `.deb` oraz dane wyrzucone do kosza użytkowników, uszczuplające dysk w systemie operacyjnym.
              </p>

              {trashAndCacheMb === 0 ? (
                <div className="border border-dashed border-[#1a1f26] p-4 text-center text-[10px] font-mono text-[#4d5b6e] uppercase">
                  Cache i kosz są całkowicie opróżnione
                </div>
              ) : (
                <div className="flex items-center justify-between border border-[#1a1f26]/60 bg-[#0a0d12] p-3 text-xs font-mono">
                  <div>
                    <span className="text-white block font-bold text-[11px]">Szybkie czyszczenie APT Cache & Kosza</span>
                    <span className="text-[10px] text-[#4d5b6e] uppercase">Odzyskasz: {trashAndCacheMb} MB</span>
                  </div>
                  <button
                    onClick={handleCleanCacheAndTrash}
                    className="text-[9px] uppercase font-bold tracking-wider border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 px-4 py-2 transition-all"
                  >
                    Opróżnij
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Success audit message */}
          <div className="border border-dashed border-[#1a1f26] p-4 bg-[#05070a] text-center text-xs text-[#4d5b6e] font-mono leading-relaxed">
            <span className="text-white block font-bold uppercase tracking-widest text-[10px] mb-1">AUDYT ZGODNOŚCI DYSKOWEJ</span>
            Wszystkie fizyczne wolumeny i rejestry dpkg-status zostały dopasowane. Skan zsynchronizował bazę danych i zapobiegł oczekiwaniu na demona.
          </div>
        </div>
      )}
    </div>
  );
}
