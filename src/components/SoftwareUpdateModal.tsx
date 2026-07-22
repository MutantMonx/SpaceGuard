/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, Sparkles, X, Shield, ArrowUpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SoftwareUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
  onUpdateSuccess: (newVersion: string) => void;
}

export default function SoftwareUpdateModal({
  isOpen,
  onClose,
  variant,
  onUpdateSuccess
}: SoftwareUpdateModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{
    currentVersion: string;
    latestVersion: string;
    hasUpdate: boolean;
    release?: { version: string; releaseDate: string; changelog: string[] };
  } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!isOpen) return null;

  const checkUpdates = async () => {
    setLoading(true);
    setUpdateSuccess(false);
    try {
      const res = await fetch('/api/update/check');
      const data = await res.json();
      setUpdateInfo(data);
      setChecked(true);
    } catch (err) {
      console.error('Update check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/update/apply', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUpdateSuccess(true);
        if (updateInfo) {
          setUpdateInfo({
            ...updateInfo,
            currentVersion: data.version,
            hasUpdate: false
          });
        }
        onUpdateSuccess(data.version);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border border-[#1a1f26] bg-[#0c1015] text-[#e0e6ed] p-6 rounded-none shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#1a1f26] pb-4 mb-4">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ArrowUpCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              {t('btnCheckUpdates')}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              SpaceGuard Update Management System
            </p>
          </div>
        </div>

        {/* State 1: Initial Check Button */}
        {!checked && !loading && (
          <div className="text-center py-6 space-y-4">
            <Shield className="w-12 h-12 mx-auto text-cyan-400 opacity-80" />
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Check official SpaceGuard repository for software updates, patch releases, and security database updates.
            </p>
            <button
              onClick={checkUpdates}
              className="px-6 py-2.5 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono font-bold text-xs uppercase hover:bg-cyan-500/30 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('btnCheckUpdates')}
            </button>
          </div>
        )}

        {/* State 2: Loading animation */}
        {loading && (
          <div className="text-center py-8 space-y-3 font-mono">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
            <p className="text-xs text-cyan-400">{t('updateChecking')}</p>
          </div>
        )}

        {/* State 3: Up to date */}
        {checked && !loading && updateInfo && !updateInfo.hasUpdate && (
          <div className="text-center py-6 space-y-4 font-mono">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
            <div className="text-sm font-bold text-white">
              {t('updateLatest', { ver: updateInfo.currentVersion })}
            </div>
            <p className="text-xs text-slate-400">
              Your SpaceGuard installation is fully up-to-date. All protection modules are active.
            </p>
            <button
              onClick={checkUpdates}
              className="px-4 py-2 border border-white/20 text-xs hover:bg-white/10 transition-all cursor-pointer"
            >
              Re-check Repository
            </button>
          </div>
        )}

        {/* State 4: Update Available */}
        {checked && !loading && updateInfo && updateInfo.hasUpdate && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 flex justify-between items-center">
              <div>
                <span className="font-bold text-sm block">
                  {t('updateAvailableTitle', { ver: updateInfo.latestVersion })}
                </span>
                <span className="text-[10px] text-slate-400">
                  Current: v{updateInfo.currentVersion} • Released: {updateInfo.release?.releaseDate}
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            </div>

            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider block mb-2">
                {t('updateReleaseNotes')}
              </span>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                {updateInfo.release?.changelog.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 bg-black/40 border border-white/10 text-[10.5px] text-slate-400">
              💡 Updating preserves all custom rules, logs, telemetry history, and container registries.
            </div>

            {updating ? (
              <div className="py-4 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                <span className="text-cyan-400 text-xs block">{t('updatingProgress')}</span>
              </div>
            ) : updateSuccess ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-center font-bold">
                {t('updateSuccess', { ver: updateInfo.latestVersion })}
              </div>
            ) : (
              <button
                onClick={applyUpdate}
                className="w-full py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('updateBtn')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
