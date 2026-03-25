/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import SpaceBackground from './components/SpaceBackground';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050510] text-gray-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative flex flex-col items-center justify-center p-4">
      <SpaceBackground />
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse uppercase">
            Snaked and Beats
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-2 tracking-widest uppercase">
            Eat. Grow. Vibe.
          </p>
        </header>

        <SnakeGame />
        <MusicPlayer />
      </div>
    </div>
  );
}
