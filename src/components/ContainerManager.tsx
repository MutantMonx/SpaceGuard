/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { HardDrive, Trash2, Layers, RefreshCw, Database, Activity, HelpCircle, Box } from 'lucide-react';
import { DiskStatus, DockerImage, DockerContainer, UIViewVariant } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContainerManagerProps {
  variant: UIViewVariant;
  onActionComplete: (msg: string) => void;
  disk: DiskStatus;
  fetchData: () => Promise<void>;
}

export default function ContainerManager({ variant, onActionComplete, disk, fetchData }: ContainerManagerProps) {
  const { t } = useLanguage();
  const [dockerImages, setDockerImages] = useState<DockerImage[]>([]);
  const [dockerContainers, setDockerContainers] = useState<DockerContainer[]>([]);
  const [podmanImages, setPodmanImages] = useState<DockerImage[]>([]);
  const [podmanContainers, setPodmanContainers] = useState<DockerContainer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/containers/resources');
      if (res.ok) {
        const data = await res.json();
        setDockerImages(data.dockerImages);
        setDockerContainers(data.dockerContainers);
        setPodmanImages(data.podmanImages);
        setPodmanContainers(data.podmanContainers);
      }
    } catch (err) {
      console.error('Error fetching container resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleRemove = async (engine: 'docker' | 'podman', type: 'image' | 'container', id: string, name: string) => {
    try {
      const res = await fetch('/api/containers/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine, type, id })
      });
      if (res.ok) {
        onActionComplete(t('msgRemovedResource', { type: type === 'image' ? t('contImage') : t('contContainer'), name, engine }));
        fetchResources();
        fetchData();
      } else {
        const errData = await res.json();
        onActionComplete(t('msgRemoveError', { error: errData.error || t('msgCannotRemove') }));
      }
    } catch (err) {
      onActionComplete(t('msgRemoveConnError'));
    }
  };

  const handlePrune = async (engine: 'docker' | 'podman') => {
    try {
      const res = await fetch('/api/containers/prune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.freedMb > 0) {
          onActionComplete(t('msgPruneSuccess', { engine, mb: data.freedMb }));
        } else {
          onActionComplete(t('msgPruneAlreadyClean', { engine }));
        }
        fetchResources();
        fetchData();
      }
    } catch (err) {
      onActionComplete(t('msgPruneConnError'));
    }
  };

  const getThemeStyles = () => {
    switch (variant) {
      case 'Forge':
        return {
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative rounded-none',
          headerBg: 'bg-[#ff3e3e]/5 border-b border-[#ff3e3e]/20 text-[#ff3e3e]',
          accentText: 'text-[#ff3e3e]',
          accentBg: 'bg-[#ff3e3e]/10',
          accentBorder: 'border-[#ff3e3e]/30',
          buttonPrimary: 'bg-[#ff3e3e]/10 border border-[#ff3e3e]/40 text-[#ff3e3e] hover:bg-[#ff3e3e]/25 font-mono text-[10px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all',
          btnDanger: 'text-[#ff3e3e] hover:bg-[#ff3e3e]/10 border border-[#ff3e3e]/20 hover:border-[#ff3e3e]/50 p-1.5 transition-all cursor-pointer',
          badgeDangling: 'bg-[#ff3e3e]/10 text-[#ff3e3e] border border-[#ff3e3e]/30 font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider',
          badgeEngine: 'bg-[#ff3e3e]/10 text-[#ff3e3e] border border-[#ff3e3e]/30 font-mono text-[10px] px-2 py-0.5'
        };
      case 'Atlas':
        return {
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative rounded-none',
          headerBg: 'bg-white/5 border-b border-white/20 text-white',
          accentText: 'text-white',
          accentBg: 'bg-white/10',
          accentBorder: 'border-white/30',
          buttonPrimary: 'bg-white/10 border border-white/40 text-white hover:bg-white/25 font-mono text-[10px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all',
          btnDanger: 'text-red-400 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/50 p-1.5 transition-all cursor-pointer',
          badgeDangling: 'bg-white/10 text-white border border-white/30 font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider',
          badgeEngine: 'bg-white/10 text-white border border-white/30 font-mono text-[10px] px-2 py-0.5'
        };
      case 'Pulse':
        return {
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative rounded-none',
          headerBg: 'bg-[#00f2ff]/5 border-b border-[#00f2ff]/20 text-[#00f2ff]',
          accentText: 'text-[#00f2ff]',
          accentBg: 'bg-[#00f2ff]/10',
          accentBorder: 'border-[#00f2ff]/30',
          buttonPrimary: 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] hover:bg-[#00f2ff]/25 font-mono text-[10px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all',
          btnDanger: 'text-red-400 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/50 p-1.5 transition-all cursor-pointer',
          badgeDangling: 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider',
          badgeEngine: 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 font-mono text-[10px] px-2 py-0.5'
        };
      case 'Zen':
        return {
          card: 'bg-[#080b0f] border border-[#1a1f26] text-[#e0e6ed] relative rounded-none',
          headerBg: 'bg-[#f2a100]/5 border-b border-[#f2a100]/20 text-[#f2a100]',
          accentText: 'text-[#f2a100]',
          accentBg: 'bg-[#f2a100]/10',
          accentBorder: 'border-[#f2a100]/30',
          buttonPrimary: 'bg-[#f2a100]/10 border border-[#f2a100]/40 text-[#f2a100] hover:bg-[#f2a100]/25 font-mono text-[10px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all',
          btnDanger: 'text-red-400 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/50 p-1.5 transition-all cursor-pointer',
          badgeDangling: 'bg-[#f2a100]/10 text-[#f2a100] border border-[#f2a100]/30 font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider',
          badgeEngine: 'bg-[#f2a100]/10 text-[#f2a100] border border-[#f2a100]/30 font-mono text-[10px] px-2 py-0.5'
        };
    }
  };

  const style = getThemeStyles();

  const renderEngineSection = (
    engine: 'docker' | 'podman',
    images: DockerImage[],
    containers: DockerContainer[],
    sizeMb: number = 0
  ) => {
    const exitedContainers = containers.filter(c => c.status === 'exited');
    const danglingImages = images.filter(img => img.isDangling);
    const potentialPruneSpace = exitedContainers.reduce((sum, c) => sum + c.sizeMb, 0) + danglingImages.reduce((sum, img) => sum + img.sizeMb, 0);

    return (
      <div className={`p-6 border border-[#1a1f26] bg-[#06090d] space-y-6 ${style.card}`}>
        {/* Engine Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1a1f26] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-black/40 border border-[#1a1f26] ${style.accentText}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  {t('contEngineLabel', { engine: engine === 'docker' ? 'Docker' : 'Podman' })}
                </h3>
                <span className={style.badgeEngine}>{t('statusActive')}</span>
              </div>
              <p className="text-[10px] text-[#4d5b6e] font-mono mt-0.5 uppercase">
                {t('contTotalResourceSize')} <strong className="text-white">{(sizeMb / 1024).toFixed(2)} GB</strong> ({sizeMb.toFixed(0)} MB)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handlePrune(engine)}
              disabled={potentialPruneSpace === 0}
              className={`${style.buttonPrimary} disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {t('contSystemPruneBtn', { mb: potentialPruneSpace })}
            </button>
            <button
              onClick={fetchResources}
              className="p-2 border border-[#1a1f26] bg-[#0c1015] hover:bg-[#1a1f26] transition-all cursor-pointer text-[#4d5b6e] hover:text-white"
              title={t('contRefreshState')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Containers List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4d5b6e] font-mono">
              {t('contContainersTitle', { count: containers.length })}
            </span>
          </div>

          {containers.length === 0 ? (
            <div className="border border-dashed border-[#1a1f26] py-6 text-center text-xs text-[#4d5b6e] font-mono uppercase">
              {t('contNoContainers', { engine })}
            </div>
          ) : (
            <div className="border border-[#1a1f26] overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-[#0c1015] border-b border-[#1a1f26] text-[#4d5b6e] uppercase text-[10px]">
                    <th className="p-2.5">{t('thContainerName')}</th>
                    <th className="p-2.5">{t('thBaseImage')}</th>
                    <th className="p-2.5">{t('thStatus')}</th>
                    <th className="p-2.5 text-right">{t('thWritableLayer')}</th>
                    <th className="p-2.5 text-center w-12">{t('thDelete')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1f26] text-[#e0e6ed]/90">
                  {containers.map(c => (
                    <tr key={c.id} className="hover:bg-[#0c1015]/40 transition-colors">
                      <td className="p-2.5 font-bold">{c.name}</td>
                      <td className="p-2.5 opacity-60 text-[10px]">{c.image}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] uppercase font-bold ${
                          c.status === 'running' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-white">{c.sizeMb} MB</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleRemove(engine, 'container', c.id, c.name)}
                          disabled={c.status === 'running'}
                          className={`${style.btnDanger} disabled:opacity-25 disabled:cursor-not-allowed`}
                          title={c.status === 'running' ? t('contRunningDeleteWarning') : t('contDeleteContainerTitle')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Images List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4d5b6e] font-mono">
              {t('contImagesTitle', { count: images.length })}
            </span>
          </div>

          {images.length === 0 ? (
            <div className="border border-dashed border-[#1a1f26] py-6 text-center text-xs text-[#4d5b6e] font-mono uppercase">
              {t('contNoImages', { engine })}
            </div>
          ) : (
            <div className="border border-[#1a1f26] overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-[#0c1015] border-b border-[#1a1f26] text-[#4d5b6e] uppercase text-[10px]">
                    <th className="p-2.5">{t('thRepository')}</th>
                    <th className="p-2.5">{t('thTag')}</th>
                    <th className="p-2.5">{t('thImageId')}</th>
                    <th className="p-2.5 text-right">{t('thImageSize')}</th>
                    <th className="p-2.5 text-center w-12">{t('thDelete')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1f26] text-[#e0e6ed]/90">
                  {images.map(img => (
                    <tr key={img.id} className="hover:bg-[#0c1015]/40 transition-colors">
                      <td className="p-2.5 font-bold flex items-center gap-2">
                        <span>{img.repository}</span>
                        {img.isDangling && (
                          <span className={style.badgeDangling}>dangling</span>
                        )}
                      </td>
                      <td className="p-2.5 opacity-60">{img.tag}</td>
                      <td className="p-2.5 text-[#4d5b6e]">{img.id}</td>
                      <td className="p-2.5 text-right font-bold text-white">{img.sizeMb} MB</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleRemove(engine, 'image', img.id, img.repository)}
                          className={style.btnDanger}
                          title={t('contDeleteImageTitle')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="containerization-manager-section" className="space-y-6">
      {/* Informative Scifi Header Alert Banner */}
      <div className={`p-4 border flex items-start gap-3.5 ${style.headerBg}`}>
        <Box className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-widest block font-sans">
            {t('contBannerTitle')}
          </span>
          <p className="opacity-80 leading-relaxed font-mono">
            {t('contBannerDesc')}
          </p>
        </div>
      </div>

      {/* Grid of Engine Managers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderEngineSection('docker', dockerImages, dockerContainers, disk.dockerSizeMb)}
        {renderEngineSection('podman', podmanImages, podmanContainers, disk.podmanSizeMb)}
      </div>
    </div>
  );
}
