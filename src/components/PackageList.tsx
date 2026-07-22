/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PackageInfo, DiskStatus } from '../types';
import { Package, Trash2, ArrowUpRight, HelpCircle, ShieldAlert, CheckCircle, RefreshCcw, Search, Filter, HelpCircleIcon } from 'lucide-react';

interface PackageListProps {
  packages: PackageInfo[];
  disk: DiskStatus;
  onActionComplete: (msg: string) => void;
  onSelectPackageGraph: (name: string) => void;
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
  fetchData: () => void;
}

export default function PackageList({
  packages,
  disk,
  onActionComplete,
  onSelectPackageGraph,
  variant,
  fetchData
}: PackageListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState<string | null>(null);
  
  // Navigation tabs: 'all' | 'apt' | 'custom' | 'simulator'
  const [activeTab, setActiveTab] = useState<'all' | 'apt' | 'custom' | 'simulator'>('all');
  
  // Interactive expanded package state
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

  // Download Simulator form state
  const [newDlName, setNewDlName] = useState('');
  const [newDlUrl, setNewDlUrl] = useState('');
  const [newDlSize, setNewDlSize] = useState('35');
  const [newDlInstaller, setNewDlInstaller] = useState('kali');
  const [newDlSudo, setNewDlSudo] = useState(false);
  const [newDlMethod, setNewDlMethod] = useState<'wget' | 'curl' | 'zip-extract' | 'installer-script'>('wget');
  const [newDlFiles, setNewDlFiles] = useState('/opt/custom-tool/bin\n/opt/custom-tool/config\n/opt/custom-tool/lib.so');
  const [newDlCollaborators, setNewDlCollaborators] = useState('libc6, libssl3');
  const [simDlLoading, setSimDlLoading] = useState(false);

  // Selected package for showing the detailed recommendation popup modal
  const [recommendationPackage, setRecommendationPackage] = useState<PackageInfo | null>(null);

  // Filter and sort packages
  const filteredPackages = packages.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = sectionFilter === 'all' || p.section === sectionFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    let matchesTab = true;
    if (activeTab === 'apt') {
      matchesTab = !p.isCustomFootprint;
    } else if (activeTab === 'custom') {
      matchesTab = !!p.isCustomFootprint;
    }
    
    return matchesSearch && matchesSection && matchesStatus && matchesTab;
  });

  // Unique sections list for filtering
  const sections = ['all', ...Array.from(new Set(packages.map(p => p.section)))];

  const handleInstall = async (name: string) => {
    setLoading(name);
    try {
      const res = await fetch('/api/packages/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok) {
        onActionComplete(`Pakiet '${name}' został pomyślnie zainstalowany w systemie.`);
        fetchData();
      } else {
        onActionComplete(`Błąd instalacji: ${data.error}`);
      }
    } catch (err) {
      onActionComplete(`Błąd sieci podczas próby instalacji '${name}'.`);
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (name: string) => {
    setLoading(name);
    try {
      const res = await fetch('/api/packages/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok) {
        onActionComplete(`Pakiet '${name}' został pomyślnie usunięty. Zwolniono ${data.freedMb} MB.`);
        fetchData();
        setRecommendationPackage(null);
      } else {
        onActionComplete(`Błąd usuwania: ${data.error}`);
      }
    } catch (err) {
      onActionComplete(`Błąd sieci podczas próby usunięcia '${name}'.`);
    } finally {
      setLoading(null);
    }
  };

  const handleSimulateDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDlName.trim() || !newDlSize.trim()) {
      onActionComplete('Błąd: Podaj nazwę i rozmiar elementu.');
      return;
    }
    setSimDlLoading(true);
    try {
      const parsedFiles = newDlFiles.split('\n').map(f => f.trim()).filter(Boolean);
      const parsedCollabs = newDlCollaborators.split(',').map(c => c.trim()).filter(Boolean);

      const res = await fetch('/api/packages/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDlName,
          sizeMb: parseFloat(newDlSize),
          url: newDlUrl || `https://custom-repo.net/archives/${newDlName}.zip`,
          installer: newDlInstaller,
          hasSudo: newDlSudo,
          method: newDlMethod,
          createdFiles: parsedFiles,
          collaboratingWith: parsedCollabs
        })
      });
      const data = await res.json();
      if (res.ok) {
        onActionComplete(`[SpaceGuard Intercept] Pomyślnie zasymulowano pobranie i utworzono ślad telemetryczny dla '${newDlName}'.`);
        fetchData();
        setNewDlName('');
        setNewDlUrl('');
        setActiveTab('custom');
      } else {
        onActionComplete(`Błąd symulacji: ${data.error}`);
      }
    } catch (err) {
      onActionComplete(`Błąd sieci podczas próby symulacji pobierania.`);
    } finally {
      setSimDlLoading(false);
    }
  };

  const openRecommendationModal = (pkg: PackageInfo) => {
    setRecommendationPackage(pkg);
  };

  const styleClasses = () => {
    switch (variant) {
      case 'Forge':
        return {
          headerText: 'text-[#ff3e3e]',
          accentText: 'text-[#ff3e3e]',
          accentBg: 'bg-[#ff3e3e]/10',
          accentBorder: 'border-[#ff3e3e]/30',
          badgeInstalled: 'bg-[#ff3e3e]/10 text-[#ff3e3e] border-[#ff3e3e]/30',
          badgeAvailable: 'bg-[#1a1f26] text-[#4d5b6e] border-[#1a1f26]',
          btnPrimary: 'bg-[#ff3e3e]/10 border border-[#ff3e3e]/40 text-[#ff3e3e] hover:bg-[#ff3e3e]/25 font-mono text-[10px]',
          btnDanger: 'bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600/25',
          rowHover: 'hover:bg-[#ff3e3e]/5',
          inputBg: 'bg-[#0c1015] border-[#1a1f26] text-[#ff3e3e] font-mono rounded-none',
          cardBg: 'bg-[#080b0f] border-[#1a1f26]'
        };
      case 'Atlas':
        return {
          headerText: 'text-white',
          accentText: 'text-white',
          accentBg: 'bg-white/10',
          accentBorder: 'border-white/30',
          badgeInstalled: 'bg-white/10 text-white border-white/30',
          badgeAvailable: 'bg-[#1a1f26] text-[#4d5b6e] border-[#1a1f26]',
          btnPrimary: 'bg-white/10 border border-white/40 text-white hover:bg-white/25 font-mono text-[10px]',
          btnDanger: 'bg-white/10 border border-white/20 text-white hover:bg-white/25',
          rowHover: 'hover:bg-white/5',
          inputBg: 'bg-[#0c1015] border-[#1a1f26] text-white font-mono rounded-none',
          cardBg: 'bg-[#080b0f] border-[#1a1f26]'
        };
      case 'Pulse':
        return {
          headerText: 'text-[#00f2ff]',
          accentText: 'text-[#00f2ff]',
          accentBg: 'bg-[#00f2ff]/10',
          accentBorder: 'border-[#00f2ff]/30',
          badgeInstalled: 'bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/30',
          badgeAvailable: 'bg-[#1a1f26] text-[#4d5b6e] border-[#1a1f26]',
          btnPrimary: 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] hover:bg-[#00f2ff]/25 font-mono text-[10px]',
          btnDanger: 'bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff] hover:bg-[#00f2ff]/25',
          rowHover: 'hover:bg-[#00f2ff]/5',
          inputBg: 'bg-[#0c1015] border-[#1a1f26] text-[#00f2ff] font-mono rounded-none',
          cardBg: 'bg-[#080b0f] border-[#1a1f26]'
        };
      case 'Zen':
        return {
          headerText: 'text-[#f2a100]',
          accentText: 'text-[#f2a100]',
          accentBg: 'bg-[#f2a100]/10',
          accentBorder: 'border-[#f2a100]/30',
          badgeInstalled: 'bg-[#f2a100]/10 text-[#f2a100] border-[#f2a100]/30',
          badgeAvailable: 'bg-[#1a1f26] text-[#4d5b6e] border-[#1a1f26]',
          btnPrimary: 'bg-[#f2a100]/10 border border-[#f2a100]/40 text-[#f2a100] hover:bg-[#f2a100]/25 font-mono text-[10px]',
          btnDanger: 'bg-[#f2a100]/10 border border-[#f2a100]/20 text-[#f2a100] hover:bg-[#f2a100]/25',
          rowHover: 'hover:bg-[#f2a100]/5',
          inputBg: 'bg-[#0c1015] border-[#1a1f26] text-[#f2a100] font-mono rounded-none',
          cardBg: 'bg-[#080b0f] border-[#1a1f26]'
        };
    }
  };

  const style = styleClasses();

  return (
    <div id="package-manager-card" className={`p-4 rounded-none border bg-[#080b0f] border-[#1a1f26]`}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-white/5 mb-4 gap-2">
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${style.headerText}`}>
            <Package className="w-4 h-4" />
            Baza pakietów dpkg-status i sugestie zwolnienia miejsca
          </h3>
          <p className="text-xs opacity-50">Porównuj Installed-Size (rozmiar deklarowany) z du (rozmiar faktyczny na dysku). Zmień karty poniżej, aby badać telemetrycznie pobrane pliki i skrypty.</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5 px-2 py-1 rounded"
        >
          <RefreshCcw className="w-3 h-3" /> Odśwież baze
        </button>
      </div>

      {/* TABS FOR CLASSIFIED STYLING */}
      <div className="flex border-b border-[#1a1f26] mb-4 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('all'); setExpandedPackage(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? `${style.headerText} border-current ${style.accentBg}`
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          WSZYSTKIE ({packages.length})
        </button>
        <button
          onClick={() => { setActiveTab('apt'); setExpandedPackage(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'apt'
              ? `${style.headerText} border-current ${style.accentBg}`
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          PAKIETY SYSTEMOWE APT ({packages.filter(p => !p.isCustomFootprint).length})
        </button>
        <button
          onClick={() => { setActiveTab('custom'); setExpandedPackage(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'custom'
              ? `${style.headerText} border-current ${style.accentBg}`
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          POBRANE PLIKI, SKRYPTY & ZIPY ({packages.filter(p => p.isCustomFootprint).length})
        </button>
        <button
          onClick={() => { setActiveTab('simulator'); setExpandedPackage(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? `${style.headerText} border-current ${style.accentBg}`
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
          SYMULATOR POBRANIA WGET/CURL
        </button>
      </div>

      {activeTab !== 'simulator' ? (
        <>
          {/* Filters Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 opacity-40" />
              <input
                id="package-search-box"
                type="text"
                placeholder="Szukaj pakietów po nazwie lub opisie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full text-xs pl-9 pr-3 py-2 rounded focus:outline-none border ${style.inputBg}`}
              />
            </div>

            {/* Section Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <select
                id="section-filter-dropdown"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className={`w-full text-xs px-2.5 py-1.75 rounded border cursor-pointer focus:outline-none ${style.inputBg}`}
              >
                {sections.map(sec => (
                  <option key={sec} value={sec}>Sekcja: {sec === 'all' ? 'Wszystkie' : sec}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Package className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <select
                id="status-filter-dropdown"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full text-xs px-2.5 py-1.75 rounded border cursor-pointer focus:outline-none ${style.inputBg}`}
              >
                <option value="all">Status: Wszystkie</option>
                <option value="installed">Status: Zainstalowane</option>
                <option value="available">Status: Dostępne</option>
              </select>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 mb-2 font-mono italic">
            💡 Kliknij na dowolny wiersz tabeli, aby otworzyć **rejestr telemetryczny** i sprawdzić kto pobrał plik, kiedy dokładnie, skąd i jakie pliki na dysku utworzył.
          </p>

          {/* Packages Table List */}
          <div className="overflow-x-auto rounded-none border border-[#1a1f26]">
            <table id="packages-data-table" className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#0c1015] border-b border-[#1a1f26] text-[#4d5b6e] font-mono tracking-wider uppercase text-[10px]">
                  <th className="p-3 font-semibold">Nazwa pakietu</th>
                  <th className="p-3 font-semibold hidden md:table-cell">Metoda</th>
                  <th className="p-3 font-semibold">Zadeklarowany</th>
                  <th className="p-3 font-semibold">Faktyczny (du)</th>
                  <th className="p-3 font-semibold text-center">Status</th>
                  <th className="p-3 font-semibold text-center">Zależności</th>
                  <th className="p-3 font-semibold text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500 italic">Brak wyników spełniających kryteria wyszukiwania.</td>
                  </tr>
                ) : (
                  filteredPackages.map(pkg => {
                    const sizeDecl = (pkg.installedSizeKb / 1024).toFixed(1) + ' MB';
                    const sizeAct = (pkg.actualSizeKb / 1024).toFixed(1) + ' MB';
                    const hasWhy = !!pkg.whyRecommend;
                    const isExpanded = expandedPackage === pkg.name;

                    return (
                      <React.Fragment key={pkg.name}>
                        {/* MAIN ROW */}
                        <tr
                          onClick={() => setExpandedPackage(isExpanded ? null : pkg.name)}
                          className={`border-b border-white/5 transition-all cursor-pointer ${style.rowHover} ${isExpanded ? 'bg-white/5' : ''}`}
                        >
                          <td className="p-3 font-semibold">
                            <div className="flex items-center space-x-2">
                              <span>{pkg.name}</span>
                              {pkg.isSystem && (
                                <span className="px-1.5 py-0.25 text-[8px] rounded border border-yellow-500/30 bg-yellow-950/10 text-yellow-500" title="System Critical Package">
                                  systemowy
                                </span>
                              )}
                              {pkg.isCustomFootprint && (
                                <span className="px-1.5 py-0.25 text-[8px] rounded border border-blue-500/30 bg-blue-950/10 text-blue-400" title="Manual file download/script footprint">
                                  zasób zewnętrzny
                                </span>
                              )}
                              {hasWhy && pkg.status === 'installed' && (
                                <span className="px-1.5 py-0.25 text-[8px] rounded border border-rose-500/30 bg-rose-950/10 text-rose-400 animate-pulse">
                                  rekomendowany
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] opacity-40 font-normal max-w-sm truncate mt-0.5">{pkg.description}</div>
                          </td>
                          <td className="p-3 hidden md:table-cell font-mono opacity-70 uppercase text-[10px]">
                            {pkg.installMethod || 'apt'}
                          </td>
                          <td className="p-3 font-mono text-zinc-400">{sizeDecl}</td>
                          <td className="p-3 font-mono font-semibold">{sizeAct}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold ${
                              pkg.status === 'installed' ? style.badgeInstalled : style.badgeAvailable
                            }`}>
                              {pkg.status === 'installed' ? 'zainstalowany' : 'dostępny'}
                            </span>
                          </td>
                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onSelectPackageGraph(pkg.name)}
                              className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer inline-flex items-center gap-1"
                              title="Zbadaj połączenia w grafie"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                              <span>({pkg.dependencies.length}) graf</span>
                            </button>
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {pkg.status === 'installed' ? (
                              <div className="flex justify-end gap-1.5">
                                {hasWhy && (
                                  <button
                                    onClick={() => openRecommendationModal(pkg)}
                                    title="Pokaż dlaczego/jak usunąć"
                                    className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/25 cursor-pointer"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (pkg.isSystem) {
                                      onActionComplete(`Blokada: ${pkg.name} to pakiet jądra/systemu i nie może zostać usunięty.`);
                                    } else {
                                      openRecommendationModal(pkg);
                                    }
                                  }}
                                  disabled={loading === pkg.name || pkg.isSystem}
                                  className={`p-1.5 rounded cursor-pointer ${
                                    pkg.isSystem ? 'opacity-20 cursor-not-allowed' : style.btnDanger
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleInstall(pkg.name)}
                                disabled={loading === pkg.name}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${style.btnPrimary}`}
                              >
                                {loading === pkg.name ? 'instaluje...' : 'zainstaluj'}
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* EXPANDABLE TELEMETRY ROW */}
                        {isExpanded && (
                          <tr className="bg-[#0c1015]/90 border-b border-[#1a1f26]">
                            <td colSpan={7} className="p-4 border-l-2 border-zinc-500">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                {/* Left: Audit Details */}
                                <div className="space-y-2 border-r border-[#1a1f26]/60 pr-4">
                                  <div className="font-bold text-[#4d5b6e] uppercase tracking-wider text-[10px] pb-1 border-b border-white/5">
                                    Śledzenie pochodzenia (Provenance Audit)
                                  </div>
                                  <div className="flex justify-between pb-1.5 border-b border-white/5">
                                    <span className="opacity-40">Użytkownik instalujący:</span>
                                    <span className="font-bold text-white flex items-center gap-1.5">
                                      {pkg.installedBy || 'root'}
                                      {(pkg.hasSudo || pkg.installedBy === 'root') && (
                                        <span className="px-1 py-0.25 text-[8px] bg-red-500/10 border border-red-500/30 text-red-500 rounded font-sans uppercase">SUDO</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pb-1.5 border-b border-white/5">
                                    <span className="opacity-40">Zainstalowano:</span>
                                    <span className="text-zinc-300">
                                      {pkg.installedAt ? new Date(pkg.installedAt).toLocaleString() : 'Preinstalowany fabrycznie'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pb-1.5 border-b border-white/5">
                                    <span className="opacity-40">Ostatnio używany:</span>
                                    <span className="text-zinc-300">
                                      {pkg.lastUsedAt ? new Date(pkg.lastUsedAt).toLocaleString() : 'Preinstalowany fabrycznie'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pb-1.5 border-b border-white/5">
                                    <span className="opacity-40">Środek wdrożenia:</span>
                                    <span className="text-zinc-300 uppercase font-bold text-[10px] text-emerald-400">
                                      {pkg.installMethod || 'apt-get'}
                                    </span>
                                  </div>
                                  <div className="pb-1">
                                    <span className="opacity-40 block mb-1">Pełny adres URL źródła / polecenie:</span>
                                    <span className="text-blue-400 break-all text-[10px] block font-sans select-all bg-black/40 p-1.5 border border-white/5 rounded">
                                      {pkg.sourceUrl || `apt-get install ${pkg.name}`}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="opacity-40 block mb-1">Współpracujące programy (Runtime dynamic links):</span>
                                    <div className="flex flex-wrap gap-1 mt-1 font-sans">
                                      {pkg.collaboratingWith && pkg.collaboratingWith.length > 0 ? (
                                        pkg.collaboratingWith.map(c => (
                                          <span key={c} className="px-1.5 py-0.5 text-[9px] bg-zinc-900 border border-white/5 text-zinc-300 font-mono">
                                            {c}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-[10px] italic opacity-40">Brak czynnych powiązań runtime</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Created Files */}
                                <div className="space-y-2">
                                  <div className="font-bold text-[#4d5b6e] uppercase tracking-wider text-[10px] pb-1 border-b border-white/5 flex items-center justify-between">
                                    <span>Rejestr utworzonych ścieżek na dysku</span>
                                    <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.25">
                                      {pkg.createdFiles?.length || 0} ścieżek
                                    </span>
                                  </div>
                                  <div className="max-h-40 overflow-y-auto font-mono text-[10px] text-zinc-400 bg-black/40 p-2.5 border border-white/5 space-y-1 rounded select-all">
                                    {pkg.createdFiles && pkg.createdFiles.length > 0 ? (
                                      pkg.createdFiles.map((file, idx) => (
                                        <div key={idx} className="truncate text-emerald-400/90 hover:text-emerald-300">
                                          📄 {file}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-zinc-600 italic">Brak śledzonych plików. Dane pakietu pobierane bezpośrednio z db dpkg.</div>
                                    )}
                                  </div>
                                  <p className="text-[10px] opacity-40 leading-relaxed font-sans">
                                    Rejestr ubytku wolnej przestrzeni: SpaceGuard monitoruje powyższe lokalizacje i powiązał je z instalacją tego elementu. Usunięcie wykasuje ślady z dysku.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* WGET / CURL DOWNLOAD INTERCEPT SIMULATOR FORM */
        <div className="p-4 border border-[#1a1f26] bg-[#0c1015]/60 rounded-none max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Symulator Pobierania & Interceptacji Plików (SpaceGuard Intercept)</h4>
              <p className="text-[10px] opacity-50">Zasymuluj ubytek miejsca na dysku z dowolnego skryptu curl, polecenia wget lub archiwum ZIP.</p>
            </div>
          </div>

          <form onSubmit={handleSimulateDownload} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">Nazwa zasobu / pliku:</label>
                <input
                  type="text"
                  required
                  placeholder="np. credential-harvester"
                  value={newDlName}
                  onChange={(e) => setNewDlName(e.target.value)}
                  className={`w-full p-2 text-xs border ${style.inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">Rozmiar zasobu (MB):</label>
                <input
                  type="number"
                  required
                  placeholder="np. 45"
                  value={newDlSize}
                  onChange={(e) => setNewDlSize(e.target.value)}
                  className={`w-full p-2 text-xs border ${style.inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">Adres URL źródła (skąd pobrano):</label>
              <input
                type="text"
                placeholder="np. https://github.com/phishing/gophish/master.zip"
                value={newDlUrl}
                onChange={(e) => setNewDlUrl(e.target.value)}
                className={`w-full p-2 text-xs border ${style.inputBg}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">Narzędzie pobierające:</label>
                <select
                  value={newDlMethod}
                  onChange={(e) => setNewDlMethod(e.target.value as any)}
                  className={`w-full p-2 text-xs border cursor-pointer ${style.inputBg}`}
                >
                  <option value="wget">WGET (Pobranie pliku/ZIP)</option>
                  <option value="curl">CURL (Skrypt instalacyjny)</option>
                  <option value="zip-extract">ZIP-EXTRACT (Archiwum ZIP)</option>
                  <option value="installer-script">INSTALLER (Skrypt bash)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">Użytkownik instalujący:</label>
                <select
                  value={newDlInstaller}
                  onChange={(e) => setNewDlInstaller(e.target.value)}
                  className={`w-full p-2 text-xs border cursor-pointer ${style.inputBg}`}
                >
                  <option value="kali">kali (Standardowy użytkownik)</option>
                  <option value="root">root (Administrator)</option>
                  <option value="operator">operator (Audytor)</option>
                </select>
              </div>

              <div className="flex items-center pt-5 pl-2">
                <input
                  id="simulate-sudo-checkbox"
                  type="checkbox"
                  checked={newDlSudo}
                  onChange={(e) => setNewDlSudo(e.target.checked)}
                  className="mr-2 h-4 w-4 bg-[#0c1015] border-[#1a1f26] rounded-none cursor-pointer"
                />
                <label htmlFor="simulate-sudo-checkbox" className="text-zinc-300 font-bold uppercase tracking-wider text-[10px] cursor-pointer">
                  Zastosuj SUDO
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">
                Kooperujące aplikacje / biblioteki (oddziel przecinkami):
              </label>
              <input
                type="text"
                placeholder="np. python3, libc6, libssl3, nmap"
                value={newDlCollaborators}
                onChange={(e) => setNewDlCollaborators(e.target.value)}
                className={`w-full p-2 text-xs border ${style.inputBg}`}
              />
            </div>

            <div>
              <label className="block text-[#4d5b6e] uppercase tracking-wider text-[10px] mb-1 font-bold">
                Utworzone ścieżki plików na dysku (jedna ścieżka na wiersz):
              </label>
              <textarea
                rows={3}
                placeholder="/opt/tool/executable&#10;/opt/tool/config.json&#10;/opt/tool/db.sqlite"
                value={newDlFiles}
                onChange={(e) => setNewDlFiles(e.target.value)}
                className={`w-full p-2 text-xs border focus:outline-none ${style.inputBg}`}
              />
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={simDlLoading}
                className={`px-6 py-2.5 rounded-none font-bold text-xs uppercase cursor-pointer transition-all flex items-center gap-2 ${
                  variant === 'Forge' ? 'bg-[#ff3e3e]/20 border border-[#ff3e3e]/60 text-[#ff3e3e] hover:bg-[#ff3e3e]/35' :
                  variant === 'Atlas' ? 'bg-white/20 border border-white/60 text-white hover:bg-white/35' :
                  variant === 'Pulse' ? 'bg-[#00f2ff]/20 border border-[#00f2ff]/60 text-[#00f2ff] hover:bg-[#00f2ff]/35' :
                  'bg-[#f2a100]/20 border border-[#f2a100]/60 text-[#f2a100] hover:bg-[#f2a100]/35'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 animate-bounce" />
                <span>{simDlLoading ? 'Uruchamianie symulacji...' : 'Zatwierdź i Zasymuluj Pobranie'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RECOMMENDATION EXPLAINER MODAL (WHY/IMPACT/ROLLBACK per pack) */}
      {recommendationPackage && (
        <div id="recommendation-modal" className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg rounded-none border border-[#1a1f26] bg-[#0c1015] shadow-2xl p-6 text-[#e0e6ed]">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Raport Usuwania: {recommendationPackage.name}</h4>
                <p className="text-[10px] opacity-50">SpaceGuard System Optimization Intelligence Report</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Space to Save */}
              <div className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                <span className="font-semibold opacity-75">Odzyskane miejsce na dysku:</span>
                <span className="text-sm font-bold font-mono">{(recommendationPackage.actualSizeKb / 1024).toFixed(1)} MB</span>
              </div>

              {/* Provenance details */}
              <div className="bg-[#0c1015] border border-white/5 p-2 text-[10px] space-y-1 text-zinc-400">
                <div>• Zainstalowane przez: <span className="text-white font-bold">{recommendationPackage.installedBy || 'root'}</span> (Sudo: {recommendationPackage.hasSudo ? 'TAK' : 'NIE'})</div>
                <div>• Data wdrożenia: <span className="text-white">{recommendationPackage.installedAt ? new Date(recommendationPackage.installedAt).toLocaleString() : 'brak'}</span></div>
                <div>• Sposób instalacji: <span className="text-emerald-400 font-bold uppercase">{recommendationPackage.installMethod || 'apt'}</span></div>
                <div>• Adres URL/źródło: <span className="text-blue-400 break-all">{recommendationPackage.sourceUrl || 'Standard Debian Mirror'}</span></div>
              </div>

              {/* WHY */}
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 opacity-50">1. Dlaczego (WHY):</span>
                <p className="leading-relaxed border-l-2 border-amber-500 pl-2 text-zinc-300">
                  {recommendationPackage.whyRecommend || 'Pakiet oznaczony jako opcjonalny, z niską oceną krytyczności systemowej.'}
                </p>
              </div>

              {/* IMPACT */}
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 opacity-50">2. Konsekwencje Usunięcia (IMPACT):</span>
                <p className="leading-relaxed border-l-2 border-rose-500 pl-2 text-zinc-300">
                  Usunięty zostanie plik binarny programu oraz powiązane z nim pliki na dysku (łącznie {recommendationPackage.createdFiles?.length || 0} ścieżek). Pliki konfiguracyjne w katalogach domowych użytkownika zostaną zachowane.
                </p>
              </div>

              {/* ROLLBACK */}
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 opacity-50">3. Przywrócenie Systemu (ROLLBACK):</span>
                <p className="leading-relaxed border-l-2 border-emerald-500 pl-2 font-mono bg-black/30 p-2 rounded text-emerald-400">
                  {recommendationPackage.isCustomFootprint 
                    ? `${recommendationPackage.installMethod === 'wget' ? 'wget' : 'curl'} ${recommendationPackage.sourceUrl}`
                    : `sudo apt-get install ${recommendationPackage.name}`
                  }
                </p>
              </div>

              {/* RISK */}
              <div className="flex justify-between text-[11px] font-mono border-t border-white/5 pt-3">
                <span>Ryzyko destabilizacji:</span>
                <span className={`font-bold uppercase ${
                  recommendationPackage.rollbackRisk === 'high' ? 'text-red-500' :
                  recommendationPackage.rollbackRisk === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>{recommendationPackage.rollbackRisk}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 mt-6 border-t border-white/5 pt-4">
              <button
                onClick={() => setRecommendationPackage(null)}
                className={`px-4 py-2 rounded text-xs font-bold cursor-pointer transition-all ${
                  variant === 'Atlas' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850'
                }`}
              >
                Anuluj
              </button>
              <button
                onClick={() => handleRemove(recommendationPackage.name)}
                disabled={loading === recommendationPackage.name}
                className="px-4 py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{loading === recommendationPackage.name ? 'Usuwanie...' : 'Zatwierdź Usuwanie (Clean)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
