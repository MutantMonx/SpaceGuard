/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { CommandHistoryItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TerminalProps {
  onCommandExecuted: (output: string) => void;
  variant: 'Forge' | 'Atlas' | 'Pulse' | 'Zen';
}

export default function Terminal({ onCommandExecuted, variant }: TerminalProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'system-init',
      output: t('cliInitMsg', { ver: '1.2.0' }),
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setLoading(true);
    // Add command to physical terminal list
    const newHistoryItem: CommandHistoryItem = {
      command: trimmed,
      output: '...',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setHistory(prev => [...prev, newHistoryItem]);
    setCommandHistory(prev => [trimmed, ...prev.filter(c => c !== trimmed)]);
    setHistoryIdx(-1);

    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed })
      });
      const data = await res.json();
      
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = data.output || data.error || 'Error.';
        return updated;
      });

      // Notify parent to refresh list or disk status
      onCommandExecuted(data.output);
    } catch (err: any) {
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = t('cliErrorConn');
        return updated;
      });
    } finally {
      setLoading(false);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < commandHistory.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  const clearConsole = () => {
    setHistory([]);
  };

  const autocompleteCommand = (cmd: string) => {
    setInput(cmd);
    inputRef.current?.focus();
  };

  // Color schemes based on variant
  const terminalStyle = () => {
    switch (variant) {
      case 'Forge':
        return {
          bg: 'bg-[#080b0f] border-[#1a1f26]',
          text: 'text-[#ff3e3e] font-mono',
          prompt: 'text-[#ff3e3e] font-bold font-mono',
          output: 'text-[#e0e6ed]/95 whitespace-pre-wrap font-mono leading-relaxed text-xs',
          input: 'text-white focus:outline-none placeholder-red-900/60 font-mono text-xs',
          accent: 'border-[#ff3e3e]/30 bg-[#ff3e3e]/10 text-[#ff3e3e]'
        };
      case 'Atlas':
        return {
          bg: 'bg-[#080b0f] border-[#1a1f26]',
          text: 'text-white font-mono',
          prompt: 'text-white font-bold font-mono',
          output: 'text-[#e0e6ed]/95 whitespace-pre-wrap font-mono leading-relaxed text-xs',
          input: 'text-white focus:outline-none placeholder-zinc-500 font-mono text-xs',
          accent: 'border-white/30 bg-white/10 text-white'
        };
      case 'Pulse':
        return {
          bg: 'bg-[#080b0f] border-[#1a1f26]',
          text: 'text-[#00f2ff] font-mono',
          prompt: 'text-[#00f2ff] font-bold font-mono',
          output: 'text-[#e0e6ed]/95 whitespace-pre-wrap font-mono leading-relaxed text-xs',
          input: 'text-white focus:outline-none placeholder-[#00f2ff]/40 font-mono text-xs',
          accent: 'border-[#00f2ff]/30 bg-[#00f2ff]/10 text-[#00f2ff]'
        };
      case 'Zen':
        return {
          bg: 'bg-[#080b0f] border-[#1a1f26]',
          text: 'text-[#f2a100] font-mono',
          prompt: 'text-[#f2a100] font-bold font-mono',
          output: 'text-[#e0e6ed]/95 whitespace-pre-wrap font-mono leading-relaxed text-xs',
          input: 'text-white focus:outline-none placeholder-amber-900/60 font-mono text-xs',
          accent: 'border-[#f2a100]/30 bg-[#f2a100]/10 text-[#f2a100]'
        };
    }
  };

  const style = terminalStyle();

  const getAccentColor = () => {
    switch (variant) {
      case 'Forge': return 'text-[#ff3e3e]';
      case 'Atlas': return 'text-white';
      case 'Pulse': return 'text-[#00f2ff]';
      case 'Zen': return 'text-[#f2a100]';
    }
  };

  return (
    <div id="cli-terminal-card" className={`flex flex-col h-[480px] rounded-none border overflow-hidden ${style.bg}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1f26] bg-[#0c1015]">
        <div className="flex items-center space-x-2">
          <TerminalIcon className={`w-4 h-4 ${getAccentColor()}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${style.text}`}>{t('cliConsoleTitle')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearConsole}
            title={t('cliClearBtn')}
            className="p-1 rounded-none hover:bg-white/5 text-neutral-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex space-x-1">
            <span className="w-2.5 h-2.5 rounded-none border border-[#1a1f26] bg-red-500/20"></span>
            <span className="w-2.5 h-2.5 rounded-none border border-[#1a1f26] bg-yellow-500/20"></span>
            <span className="w-2.5 h-2.5 rounded-none border border-[#1a1f26] bg-green-500/20"></span>
          </div>
        </div>
      </div>

      {/* Terminal logs */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 select-text text-sm bg-[#080b0f] text-[#e0e6ed]">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.command !== 'system-init' && (
              <div className="flex items-start space-x-2 text-xs font-mono">
                <span className={style.prompt}>spaceguard@system:~$</span>
                <span className="font-semibold text-white">{item.command}</span>
                <span className="text-[10px] ml-auto opacity-40">{item.timestamp}</span>
              </div>
            )}
            <div className={`pl-2 border-l border-[#1a1f26] py-0.5 ${style.output}`}>
              {item.output}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs animate-pulse opacity-60 font-mono">
            <span className={style.prompt}>spaceguard@system:~$</span>
            <span className="font-semibold text-white">{t('cliExecuting')}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick command buttons */}
      <div className="px-4 py-2 border-t border-[#1a1f26] flex flex-wrap gap-1.5 text-xs bg-[#0c1015]">
        <span className="self-center mr-1 text-[11px] opacity-50">{t('cliQuickCmds')}</span>
        <button onClick={() => autocompleteCommand('spaceguard status')} className={`px-2 py-0.5 rounded-none border text-[11px] transition-all cursor-pointer ${style.accent}`}>status</button>
        <button onClick={() => autocompleteCommand('spaceguard scan')} className={`px-2 py-0.5 rounded-none border text-[11px] transition-all cursor-pointer ${style.accent}`}>scan</button>
        <button onClick={() => autocompleteCommand('spaceguard packages list')} className={`px-2 py-0.5 rounded-none border text-[11px] transition-all cursor-pointer ${style.accent}`}>packages list</button>
        <button onClick={() => autocompleteCommand('spaceguard free --target 5GB')} className={`px-2 py-0.5 rounded-none border text-[11px] transition-all cursor-pointer ${style.accent}`}>free --target 5GB</button>
        <button onClick={() => autocompleteCommand('spaceguard clean')} className={`px-2 py-0.5 rounded-none border text-[11px] transition-all cursor-pointer ${style.accent}`}>clean</button>
        <button onClick={() => autocompleteCommand('spaceguard report')} className={`px-2 py-0.5 rounded-none border text-[11px] transition-all cursor-pointer ${style.accent}`}>report</button>
      </div>

      {/* Terminal Input */}
      <div className="p-3 border-t border-[#1a1f26] flex items-center space-x-2 bg-[#0c1015]">
        <span className={style.prompt}>spaceguard@system:~$</span>
        <input
          id="cli-input-box"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={t('cliInputPlaceholder')}
          className={`flex-1 bg-transparent text-sm font-mono border-none focus:outline-none ${style.input}`}
        />
        <button
          onClick={() => handleCommand(input)}
          disabled={loading || !input.trim()}
          className={`p-1.5 rounded-none transition-all cursor-pointer ${loading || !input.trim() ? 'opacity-30' : 'opacity-100 hover:scale-105'} ${
            variant === 'Forge' ? 'bg-[#ff3e3e]/10 border border-[#ff3e3e]/40 text-[#ff3e3e]' :
            variant === 'Atlas' ? 'bg-white/10 border border-white/40 text-white' :
            variant === 'Pulse' ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff]' :
            'bg-[#f2a100]/10 border border-[#f2a100]/40 text-[#f2a100]'
          }`}
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
