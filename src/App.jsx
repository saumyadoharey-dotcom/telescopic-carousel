import React, { useState } from 'react';
import TelescopeCarousel from './components/TelescopeCarousel';
import DetailView from './components/DetailView';
import { WORKS } from './data/works';
import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedWork, setSelectedWork] = useState(WORKS[0]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden select-none font-sans">
      {/* Top Header */}
      <header className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/90 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white flex items-center gap-2">
              TELESCOPE CAROUSEL
              <span className="text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">Interactive Work Preview Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Click any orbital image on the left to preview work</span>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left Pane: Telescopic Orbital Carousel */}
        <div className="h-full w-full relative">
          <TelescopeCarousel
            works={WORKS}
            selectedWork={selectedWork}
            onSelectWork={setSelectedWork}
          />
        </div>

        {/* Right Pane: Work Preview & Details */}
        <div className="h-full w-full relative">
          <DetailView
            selectedWork={selectedWork}
            works={WORKS}
            onSelectWork={setSelectedWork}
          />
        </div>
      </main>
    </div>
  );
}
