import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Sparkles, Move, ZoomIn } from 'lucide-react';

/**
 * TelescopeCarousel renders items in concentric orbital rings around a central active image.
 * Gives a telescopic perspective depth effect like the reference image with interactive drag/rotate.
 */
export default function TelescopeCarousel({ works, selectedWork, onSelectWork }) {
  const [rotationOffset, setRotationOffset] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Active work stays in center focus
  const centerWork = selectedWork || works[0];
  const remainingWorks = works.filter((w) => w.id !== centerWork.id);

  // Divide remaining items into concentric orbit rings
  const innerRingItems = remainingWorks.slice(0, 5);
  const outerRingItems = remainingWorks.slice(5);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    startX.current = e.clientX;
    setRotationOffset((prev) => prev + deltaX * 0.4);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e) => {
    setRotationOffset((prev) => prev + e.deltaY * 0.15);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950 select-none cursor-grab active:cursor-grabbing"
    >
      {/* Background Radial Rings & Telescopic Lens Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[280px] h-[280px] rounded-full border border-neutral-200 dark:border-white/10" />
        <div className="absolute w-[470px] h-[470px] rounded-full border border-neutral-300 dark:border-white/15 border-dashed" />
        <div className="absolute w-[680px] h-[680px] rounded-full border border-neutral-200 dark:border-white/5" />
        <div className="absolute w-[300px] h-[300px] bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header Info Tag */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-neutral-100/90 dark:bg-neutral-900/90 backdrop-blur border border-neutral-200 dark:border-white/10 px-3.5 py-1.5 rounded-full text-xs text-neutral-800 dark:text-neutral-200 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-red-500" />
        <span className="font-semibold">Telescopic View</span>
        <span className="text-neutral-400 dark:text-neutral-600">|</span>
        <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline">Click thumbnail to inspect on right</span>
      </div>

      {/* Orbit Container */}
      <div className="relative w-[700px] h-[700px] flex items-center justify-center">
        {/* CENTER FOCAL TILE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`center-${centerWork.id}`}
            layoutId={`work-${centerWork.id}`}
            className="absolute z-30 cursor-pointer group"
            style={{ width: '200px', height: '235px' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => onSelectWork(centerWork)}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-neutral-900 dark:border-white shadow-2xl shadow-neutral-900/40 dark:shadow-red-500/20 bg-neutral-900 relative">
              <img
                src={centerWork.thumbnail}
                alt={centerWork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-white tracking-wide truncate">{centerWork.title}</p>
                  <p className="text-[10px] text-red-400 font-semibold">{centerWork.category}</p>
                </div>
                <span className="p-1 rounded-md bg-white/20 backdrop-blur text-white text-[10px] font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-red-500/60 pointer-events-none" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* INNER CONCENTRIC RING (5 Floating Works) */}
        {innerRingItems.map((work, idx) => {
          const total = innerRingItems.length;
          const angleDeg = (idx * 360) / total + rotationOffset;
          const angleRad = (angleDeg * Math.PI) / 180;
          const radius = 210;

          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          const depthFactor = (Math.sin(angleRad) + 1) / 2; // 0..1
          const scale = 0.72 + depthFactor * 0.22;
          const opacity = 0.7 + depthFactor * 0.3;
          const isHovered = hoveredId === work.id;

          const isRedAccent = work.accentColor === '#dc2626' || work.accentColor === '#e11d48' || work.accentColor === '#ef4444';

          return (
            <motion.div
              key={work.id}
              className="absolute z-20 cursor-pointer"
              style={{
                left: `calc(50% + ${x}px - 55px)`,
                top: `calc(50% + ${y}px - 65px)`,
                width: '110px',
                height: '130px',
                scale: isHovered ? scale * 1.15 : scale,
                opacity: isHovered ? 1 : opacity,
                zIndex: Math.round(depthFactor * 10) + 10,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onMouseEnter={() => setHoveredId(work.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWork(work);
              }}
            >
              <div
                className={`w-full h-full rounded-xl overflow-hidden border-2 ${
                  isRedAccent
                    ? 'border-red-500 shadow-lg shadow-red-500/40 ring-2 ring-red-500/20'
                    : 'border-white/30 dark:border-white/20 shadow-md'
                } bg-neutral-900 relative group transition-all duration-300`}
              >
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                {isHovered && (
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/85 backdrop-blur text-center">
                    <p className="text-[10px] font-semibold text-white truncate">{work.title}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* OUTER CONCENTRIC RING (Remaining Floating Works) */}
        {outerRingItems.map((work, idx) => {
          const total = outerRingItems.length;
          const angleDeg = (idx * 360) / total - rotationOffset * 0.7;
          const angleRad = (angleDeg * Math.PI) / 180;
          const radius = 320;

          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          const depthFactor = (Math.sin(angleRad) + 1) / 2;
          const scale = 0.48 + depthFactor * 0.18;
          const opacity = 0.45 + depthFactor * 0.45;
          const isHovered = hoveredId === work.id;

          const isRedAccent = work.accentColor === '#dc2626' || work.accentColor === '#e11d48' || work.accentColor === '#ef4444';

          return (
            <motion.div
              key={work.id}
              className="absolute cursor-pointer"
              style={{
                left: `calc(50% + ${x}px - 40px)`,
                top: `calc(50% + ${y}px - 45px)`,
                width: '80px',
                height: '90px',
                scale: isHovered ? scale * 1.25 : scale,
                opacity: isHovered ? 1 : opacity,
                zIndex: Math.round(depthFactor * 5),
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onMouseEnter={() => setHoveredId(work.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWork(work);
              }}
            >
              <div
                className={`w-full h-full rounded-lg overflow-hidden border ${
                  isRedAccent
                    ? 'border-red-500 shadow-md shadow-red-500/50'
                    : 'border-white/20 dark:border-white/10 shadow-sm'
                } bg-neutral-900 relative group`}
              >
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Rotate Trigger */}
      <button
        onClick={() => setRotationOffset((prev) => prev + 60)}
        className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 text-xs px-4 py-2 rounded-full shadow-lg transition-colors"
      >
        <RotateCw className="w-3.5 h-3.5 text-red-500" />
        <span>Rotate Lens</span>
      </button>
    </div>
  );
}
