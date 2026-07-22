/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Terminal, Shield, Eye, Download } from 'lucide-react';

interface LogoGeneratorProps {
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
}

const PYTHON_SCRIPT_CODE = `#!/usr/bin/env python3
"""
SpaceGuard Logo SVG Generator Script
Generates vector brand assets (full, mono, and symbolic) using Python standard libraries.
"""
import os

SVG_FULL = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Full Brand Color Shield Logo -->
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b0707" />
      <stop offset="50%" stop-color="#180202" />
      <stop offset="100%" stop-color="#050000" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
  </defs>
  <!-- Background Shield -->
  <path d="M64 8 L112 28 V76 C112 100 92 114 64 122 C36 114 16 100 16 76 V28 Z" fill="url(#shieldGrad)" stroke="#ef4444" stroke-width="2.5" />
  <!-- Storage Stack -->
  <rect x="36" y="44" width="56" height="10" rx="2" fill="#ef4444" opacity="0.3" />
  <rect x="36" y="58" width="56" height="10" rx="2" fill="#ef4444" opacity="0.5" />
  <rect x="36" y="72" width="56" height="10" rx="2" fill="url(#glowGrad)" />
  <!-- Storage Activity Lights -->
  <circle cx="44" cy="49" r="2.5" fill="#ef4444" />
  <circle cx="44" cy="63" r="2.5" fill="#ef4444" />
  <circle cx="44" cy="77" r="2.5" fill="#ffffff" />
  <!-- Security Arch -->
  <path d="M40 32 Q64 24 88 32" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="2,2" />
</svg>"""

SVG_MONO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <!-- Monochromatic Hacking Identity Logo -->
  <path d="M64 8 L112 28 V76 C112 100 92 114 64 122 C36 114 16 100 16 76 V28 Z" fill="none" stroke="#ffffff" stroke-width="3" />
  <rect x="36" y="44" width="56" height="10" rx="2" fill="none" stroke="#ffffff" stroke-width="2" />
  <rect x="36" y="58" width="56" height="10" rx="2" fill="none" stroke="#ffffff" stroke-width="2" />
  <rect x="36" y="72" width="56" height="10" rx="2" fill="#ffffff" />
</svg>"""

SVG_SYMBOLIC = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <!-- Mini Symbolic Status Tray Logo -->
  <path d="M8 1 L14 3.5 V8.5 C14 11.5 11 13.5 8 15 C5 13.5 2 11.5 2 8.5 V3.5 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
  <line x1="5" y1="9" x2="11" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>"""

def main():
    print("[*] Generating SpaceGuard brand vector SVG files...")
    
    with open("spaceguard_full.svg", "w") as f:
        f.write(SVG_FULL)
        print(" -> Created 'spaceguard_full.svg' (Full branding)")
        
    with open("spaceguard_mono.svg", "w") as f:
        f.write(SVG_MONO)
        print(" -> Created 'spaceguard_mono.svg' (Monochromatic icon)")
        
    with open("spaceguard_symbolic.svg", "w") as f:
        f.write(SVG_SYMBOLIC)
        print(" -> Created 'spaceguard_symbolic.svg' (Ayatana tray symbolic)")
        
    print("[+] Assets created successfully.")

if __name__ == '__main__':
    main()
`;

export default function LogoGenerator({ variant }: LogoGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeBoxStyle = () => {
    switch (variant) {
      case 'Forge':
        return 'bg-[#0c1015] border-[#1a1f26] text-[#ff3e3e]';
      case 'Atlas':
        return 'bg-[#0c1015] border-[#1a1f26] text-white';
      case 'Pulse':
        return 'bg-[#0c1015] border-[#1a1f26] text-[#00f2ff]';
      case 'Zen':
        return 'bg-[#0c1015] border-[#1a1f26] text-[#f2a100]';
    }
  };

  const getAccentHex = () => {
    switch (variant) {
      case 'Forge': return 'text-[#ff3e3e]';
      case 'Atlas': return 'text-white';
      case 'Pulse': return 'text-[#00f2ff]';
      case 'Zen': return 'text-[#f2a100]';
    }
  };

  return (
    <div id="logo-generator-card" className="p-4 rounded-none border bg-[#080b0f] border-[#1a1f26]">
      <div className="pb-3 border-b border-[#1a1f26] mb-4">
        <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${getAccentHex()}`}>
          <Shield className="w-4 h-4" />
          Brand & Vector Assets: Generator Logo SVG (Kali spec)
        </h3>
        <p className="text-xs opacity-50">Generowanie wariantów logotypu bezpośrednio przy użyciu skryptu Python / standard xml.</p>
      </div>

      {/* SVG Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Full Logo */}
        <div className="flex flex-col items-center justify-center border border-[#1a1f26] bg-[#0c1015]/60 p-4 rounded-none text-center">
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-3">1. Wariant Pełny (Full Color)</span>
          <div className="w-24 h-24 flex items-center justify-center p-2 bg-[#0c1015] rounded-none border border-[#1a1f26]">
            {/* Embedded Live SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-full h-full">
              <defs>
                <linearGradient id="shieldGradLive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b0707" />
                  <stop offset="50%" stopColor="#180202" />
                  <stop offset="100%" stopColor="#050000" />
                </linearGradient>
                <linearGradient id="glowGradLive" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>
              <path d="M64 8 L112 28 V76 C112 100 92 114 64 122 C36 114 16 100 16 76 V28 Z" fill="url(#shieldGradLive)" stroke="#ef4444" strokeWidth="2.5" />
              <rect x="36" y="44" width="56" height="10" rx="0" fill="#ef4444" opacity="0.3" />
              <rect x="36" y="58" width="56" height="10" rx="0" fill="#ef4444" opacity="0.5" />
              <rect x="36" y="72" width="56" height="10" rx="0" fill="url(#glowGradLive)" />
              <circle cx="44" cy="49" r="2.5" fill="#ef4444" />
              <circle cx="44" cy="63" r="2.5" fill="#ef4444" />
              <circle cx="44" cy="77" r="2.5" fill="#ffffff" />
              <path d="M40 32 Q64 24 88 32" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
            </svg>
          </div>
          <span className="text-[9px] font-mono opacity-40 mt-3">spaceguard_full.svg</span>
        </div>

        {/* Mono Logo */}
        <div className="flex flex-col items-center justify-center border border-[#1a1f26] bg-[#0c1015]/60 p-4 rounded-none text-center">
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-3">2. Wariant Monochromatyczny (Mono)</span>
          <div className="w-24 h-24 flex items-center justify-center p-2 bg-[#0c1015] rounded-none border border-[#1a1f26]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-full h-full text-white">
              <path d="M64 8 L112 28 V76 C112 100 92 114 64 122 C36 114 16 100 16 76 V28 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              <rect x="36" y="44" width="56" height="10" rx="0" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="36" y="58" width="56" height="10" rx="0" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="36" y="72" width="56" height="10" rx="0" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[9px] font-mono opacity-40 mt-3">spaceguard_mono.svg</span>
        </div>

        {/* Symbolic Logo */}
        <div className="flex flex-col items-center justify-center border border-[#1a1f26] bg-[#0c1015]/60 p-4 rounded-none text-center">
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-3">3. Wariant Symboliczny (Tray Badge)</span>
          <div className="w-24 h-24 flex items-center justify-center p-2 bg-[#0c1015] rounded-none border border-[#1a1f26]">
            <div className="p-3 bg-[#ff3e3e]/10 text-[#ff3e3e] rounded-none border border-[#ff3e3e]/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-10 h-10 text-red-500">
                <path d="M8 1 L14 3.5 V8.5 C14 11.5 11 13.5 8 15 C5 13.5 2 11.5 2 8.5 V3.5 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="5" y1="9" x2="11" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-mono opacity-40 mt-3">spaceguard_symbolic.svg</span>
        </div>
      </div>

      {/* Code Area */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-semibold flex items-center gap-1.5 opacity-70">
            <Terminal className="w-3.5 h-3.5" />
            Skrypt generatora (logo_gen.py)
          </span>
          <button
            onClick={handleCopy}
            className={`px-2.5 py-1 rounded-none text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-all ${
              variant === 'Forge' ? 'bg-[#ff3e3e]/10 border border-[#ff3e3e]/40 text-[#ff3e3e] hover:bg-[#ff3e3e]/25' :
              variant === 'Atlas' ? 'bg-white/10 border border-white/40 text-white hover:bg-white/25' :
              variant === 'Pulse' ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] hover:bg-[#00f2ff]/25' :
              'bg-[#f2a100]/10 border border-[#f2a100]/40 text-[#f2a100] hover:bg-[#f2a100]/25'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Skopiowano!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Kopiuj skrypt Pythona</span>
              </>
            )}
          </button>
        </div>
        <pre className={`p-3 rounded-none text-[11px] font-mono overflow-x-auto max-h-[180px] border ${codeBoxStyle()}`}>
          {PYTHON_SCRIPT_CODE}
        </pre>
      </div>
    </div>
  );
}
