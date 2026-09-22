import React, { useState } from "framer";
import { motion, AnimatePresence } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";

/**
 * Telescope Carousel Framer Code Component
 *
 * Instructions for Framer:
 * 1. Open Framer (framer.com or Framer Desktop).
 * 2. Create a new Code Component (Assets -> Code -> New Component).
 * 3. Paste this entire file into the component editor.
 * 4. Drag the component onto your canvas!
 */

export default function TelescopeCarousel(props) {
  const {
    items = [],
    initialActiveIndex = 0,
    accentColor = "#FF3366",
    backgroundColor = "#000000",
    showDetailPanel = true,
  } = props;

  const sampleItems = [
    {
      title: "Silhouettes in Velvet",
      category: "Fashion",
      year: "2024",
      description: "Flowing drape study exploring movement, dark tones, and dramatic contour lighting on sleek textured silhouettes.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Neon Horizon",
      category: "Digital Art",
      year: "2024",
      description: "A cyberpunk cityscape illuminated by vivid neon architecture and atmospheric reflective mist.",
      image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Monolith & Lunar Fog",
      category: "3D Motion",
      year: "2023",
      description: "Surreal architectural exploration surrounded by volumetric fog and stark moonlight.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Quantum Flux",
      category: "Branding",
      year: "2024",
      description: "Generative brand design system built on fluid particle simulations and spectral gradients.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Urban Reflection",
      category: "Photography",
      year: "2023",
      description: "High contrast architectural geometry reflected in modern metropolis glass surfaces.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const worksList = items.length > 0 ? items : sampleItems;
  const [activeIndex, setActiveIndex] = useState(
    initialActiveIndex >= 0 && initialActiveIndex < worksList.length ? initialActiveIndex : 0
  );

  const activeWork = worksList[activeIndex] || worksList[0];

  const handleSelect = (idx) => {
    setActiveIndex(idx);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % worksList.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + worksList.length) % worksList.length);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        backgroundColor: backgroundColor,
        color: "#ffffff",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Left Pane: Orbital Telescope View */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: showDetailPanel ? "1px solid rgba(255,255,255,0.1)" : "none",
        }}
      >
        {/* Concentric Orbit Rings */}
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />

        {/* Orbital Thumbnails */}
        {worksList.map((item, idx) => {
          const total = worksList.length;
          const isActive = idx === activeIndex;
          const angle = ((idx - activeIndex) / total) * 2 * Math.PI - Math.PI / 2;
          const radius = isActive ? 0 : idx % 2 === 0 ? 160 : 260;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={idx}
              animate={{
                x: isActive ? 0 : x,
                y: isActive ? 0 : y,
                scale: isActive ? 1.25 : 0.75,
                zIndex: isActive ? 20 : 10,
                opacity: isActive ? 1 : 0.7,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={() => handleSelect(idx)}
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: isActive
                  ? `0 0 35px ${accentColor}88, 0 10px 25px rgba(0,0,0,0.5)`
                  : "0 4px 15px rgba(0,0,0,0.4)",
                border: isActive ? `2px solid ${accentColor}` : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 8,
                    background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                    fontSize: 11,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Right Pane: Detail View */}
      {showDetailPanel && activeWork && (
        <div
          style={{
            flex: 1,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#08080a",
          }}
        >
          {/* Header Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: accentColor, letterSpacing: 1 }}>
              {String(activeIndex + 1).padStart(2, "0")} / {String(worksList.length).padStart(2, "0")} • {activeWork.category?.toUpperCase()}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handlePrev}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ←
              </button>
              <button
                onClick={handleNext}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Main Artwork Preview */}
          <div style={{ flex: 1, margin: "24px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={activeWork.image}
                alt={activeWork.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  borderRadius: 20,
                  objectFit: "cover",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                }}
              />
            </AnimatePresence>
          </div>

          {/* Info Block */}
          <div>
            <h2 style={{ fontSize: 28, margin: "0 0 8px 0", fontWeight: 700 }}>{activeWork.title}</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>
              {activeWork.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Framer Canvas Property Controls
addPropertyControls(TelescopeCarousel, {
  accentColor: {
    type: ControlType.Color,
    title: "Accent",
    defaultValue: "#FF3366",
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background",
    defaultValue: "#000000",
  },
  showDetailPanel: {
    type: ControlType.Boolean,
    title: "Show Preview",
    defaultValue: true,
  },
  initialActiveIndex: {
    type: ControlType.Number,
    title: "Initial Index",
    defaultValue: 0,
    min: 0,
  },
  items: {
    type: ControlType.Array,
    title: "Works",
    control: {
      type: ControlType.Object,
      controls: {
        title: { type: ControlType.String, title: "Title" },
        category: { type: ControlType.String, title: "Category" },
        year: { type: ControlType.String, title: "Year" },
        description: { type: ControlType.String, title: "Description" },
        image: { type: ControlType.Image, title: "Image" },
      },
    },
  },
});
