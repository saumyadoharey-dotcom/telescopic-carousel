import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Tag, Calendar, Layers, ExternalLink } from 'lucide-react';

/**
 * DetailView displays the full high-resolution artwork or design work preview on the right pane
 * corresponding to the item selected from the telescopic carousel on the left pane.
 */
export default function DetailView({ selectedWork, works, onSelectWork }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!selectedWork) return null;

  const currentIndex = works.findIndex((w) => w.id === selectedWork.id);
  const totalWorks = works.length;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + totalWorks) % totalWorks;
    onSelectWork(works[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % totalWorks;
    onSelectWork(works[nextIdx]);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-y-auto border-l border-white/10 select-none">
      {/* Top Bar Navigation & Actions */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-red-500 font-bold">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalWorks).padStart(2, '0')}
          </span>
          <span className="w-1 h-1 rounded-full bg-neutral-600" />
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            {selectedWork.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Previous/Next Controls */}
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-md transition-colors"
              title="Previous Work"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-md transition-colors"
              title="Next Work"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-lg transition-colors"
            title="Fullscreen View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview Work Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 min-h-[420px] relative bg-neutral-950/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedWork.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative max-w-2xl max-h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900 group"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={selectedWork.image}
              alt={selectedWork.title}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover max-h-[520px]"
            />
            {/* Subtle overlay accent */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Metadata & Portfolio Info Panel */}
      <div className="p-6 md:p-8 bg-neutral-950 border-t border-white/10 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 mb-2 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              {selectedWork.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {selectedWork.title}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{selectedWork.year}</span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm leading-relaxed max-w-xl">
          {selectedWork.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2">
          {selectedWork.tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs text-neutral-300 bg-neutral-900/90 border border-white/10 px-3 py-1 rounded-full"
            >
              <Tag className="w-3 h-3 text-red-500" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 bg-neutral-800/80 hover:bg-neutral-700 text-white rounded-full transition-colors border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedWork.image}
            alt={selectedWork.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
