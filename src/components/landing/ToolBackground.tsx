"use client";

import { motion } from "framer-motion";

const BACKGROUND_PARTICLES = [
  { id: 1, size: 6, x: "15%", y: "25%", duration: 14, delay: 0 },
  { id: 2, size: 10, x: "75%", y: "15%", duration: 18, delay: 1 },
  { id: 3, size: 8, x: "45%", y: "45%", duration: 16, delay: 0.5 },
  { id: 4, size: 5, x: "85%", y: "60%", duration: 12, delay: 2 },
  { id: 5, size: 12, x: "20%", y: "75%", duration: 22, delay: 3 },
  { id: 6, size: 7, x: "65%", y: "80%", duration: 15, delay: 1.5 },
  { id: 7, size: 9, x: "10%", y: "50%", duration: 19, delay: 2.5 },
  { id: 8, size: 4, x: "90%", y: "30%", duration: 10, delay: 0.2 },
  { id: 9, size: 11, x: "35%", y: "10%", duration: 20, delay: 4 },
  { id: 10, size: 6, x: "55%", y: "70%", duration: 13, delay: 0.8 },
];

export function ToolBackground() {
  return (
    <>
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0b1329] to-slate-950 pointer-events-none z-0" />

      {/* Top Border Highlight separator beam */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent pointer-events-none z-0" />

      {/* ── Dynamic Luminous Aurora Mesh Background at Page Root ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Aurora Glow Orbs matching homepage Hero */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.7, 0.8, 0.7, 0.7],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-500/35 via-cyan-500/20 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -90, 50, 0],
            y: [0, 70, -40, 0],
            scale: [1, 1.15, 0.85, 1],
            opacity: [0.6, 0.7, 0.6, 0.6],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/35 via-purple-500/25 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 60, -70, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-[35%] w-[450px] h-[450px] rounded-full bg-gradient-to-t from-emerald-500/30 via-teal-500/20 to-transparent blur-[90px]"
        />

        {/* Ambient Floating Particles matching homepage Hero */}
        {BACKGROUND_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-teal-400/20 backdrop-blur-md"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.15, 0.4, 0.2, 0.15],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Cyber Matrix Dot Grid Overlay at Page Root ── */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
    </>
  );
}
