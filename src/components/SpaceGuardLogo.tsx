/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SpaceGuardLogoProps {
  className?: string;
  size?: number;
}

export default function SpaceGuardLogo({ className = '', size = 42 }: SpaceGuardLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={`shrink-0 drop-shadow-[0_0_12px_rgba(0,242,255,0.3)] ${className}`}
    >
      <defs>
        <linearGradient id="shieldNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id="glowBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#00f2ff" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="cyanStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00f2ff" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Background Shield */}
      <path
        d="M64 8 L112 28 V76 C112 100 92 114 64 122 C36 114 16 100 16 76 V28 Z"
        fill="url(#shieldNavyGrad)"
        stroke="url(#cyanStroke)"
        strokeWidth="2.5"
      />

      {/* Storage Stack */}
      <rect x="36" y="44" width="56" height="10" rx="2" fill="#3b82f6" opacity="0.4" />
      <rect x="36" y="58" width="56" height="10" rx="2" fill="#00f2ff" opacity="0.6" />
      <rect x="36" y="72" width="56" height="10" rx="2" fill="url(#glowBlueGrad)" />

      {/* Storage Activity Lights */}
      <circle cx="44" cy="49" r="2.5" fill="#60a5fa" />
      <circle cx="44" cy="63" r="2.5" fill="#00f2ff" />
      <circle cx="44" cy="77" r="2.5" fill="#ffffff" />

      {/* Security Arch */}
      <path
        d="M40 32 Q64 24 88 32"
        fill="none"
        stroke="#00f2ff"
        strokeWidth="2"
        strokeDasharray="3,2"
      />
    </svg>
  );
}
