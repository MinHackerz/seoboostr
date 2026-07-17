"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, animate } from "framer-motion";

interface IPadMockupProps {
  children: React.ReactNode;
}

export function IPadMockup({ children }: IPadMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tracking cursor relative to container center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Motion values for the initial 3D float-in presentation animation
  const introRotateX = useMotionValue(12); // Tilted back on mount
  const introRotateY = useMotionValue(-15); // Rotated slightly sideways
  const introScale = useMotionValue(0.92); // Zoom in
  const introY = useMotionValue(30); // Float up

  // Spring configuration for ultra-smooth realistic movement
  const springConfig = { damping: 24, stiffness: 90, mass: 0.6 };
  
  // Smooth out the motion values
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothIntroRotateX = useSpring(introRotateX, { damping: 18, stiffness: 45, mass: 1 });
  const smoothIntroRotateY = useSpring(introIntroRotateYVar(), { damping: 18, stiffness: 45, mass: 1 });
  
  function introIntroRotateYVar() {
    return introRotateY;
  }
  
  const smoothIntroScale = useSpring(introScale, { damping: 20, stiffness: 50 });
  const smoothIntroY = useSpring(introY, { damping: 20, stiffness: 50 });

  // Map mouse positions to 3D angles for interactive hover tilt (+/- 6 to 8 degrees)
  const hoverRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const hoverRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  // Combine intro animations with mouse-tracking hover tilts
  const finalRotateX = useTransform(
    [smoothIntroRotateX, hoverRotateX],
    ([introX, hoverX]) => (introX as number) + (hoverX as number)
  );

  const finalRotateY = useTransform(
    [smoothIntroRotateY, hoverRotateY],
    ([introYVal, hoverY]) => (introYVal as number) + (hoverY as number)
  );

  // Glare / light reflection movement coordinates mapped to mouse tilt
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [-180, 180]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [-180, 180]);

  // Trigger the float-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Smoothly animate intro values to their baseline/centered values
      animate(introRotateX, 0, { type: "spring", stiffness: 35, damping: 15 });
      animate(introRotateY, 0, { type: "spring", stiffness: 35, damping: 15 });
      animate(introScale, 1, { type: "spring", stiffness: 30, damping: 14 });
      animate(introY, 0, { type: "spring", stiffness: 30, damping: 14 });
    }, 400);

    return () => clearTimeout(timer);
  }, [introRotateX, introRotateY, introScale, introY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize coordinates between -0.5 and 0.5 relative to center of component
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to center
    animate(mouseX, 0, { duration: 0.5, ease: "easeOut" });
    animate(mouseY, 0, { duration: 0.5, ease: "easeOut" });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full flex flex-col items-center justify-center py-8 select-none"
      style={{
        perspective: "1800px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* 3D iPad Chassis */}
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX: finalRotateX,
          rotateY: finalRotateY,
          scale: smoothIntroScale,
          y: smoothIntroY,
        }}
        className="w-full max-w-5xl relative flex flex-col items-center transition-all duration-300 ease-out"
      >
        {/* Luminous aurora background glow directly behind the tablet */}
        <motion.div
          animate={{
            scale: [0.96, 1.04, 0.98, 0.96],
            opacity: [0.3, 0.5, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-8 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 rounded-[40px] blur-3xl pointer-events-none z-0"
        />

        {/* Shadow under the iPad for grounding */}
        <div 
          className="absolute -bottom-10 left-[5%] right-[5%] h-12 bg-slate-950/80 blur-2xl rounded-full pointer-events-none transition-transform duration-300"
          style={{
            transform: `translateZ(-60px) scale(${isHovered ? 1.03 : 1})`,
          }}
        />

        {/* Outer Edge Buttons (iPad physical details) */}
        {/* Power Button (Top Edge, Right side) */}
        <div className="absolute top-0 right-16 w-10 h-[5px] bg-[#334155] rounded-t border-t border-slate-500/30 -translate-y-full z-0" />
        
        {/* Volume Buttons (Right Edge, Top side) */}
        <div className="absolute top-16 right-0 w-[5px] h-8 bg-[#334155] rounded-r border-r border-slate-500/30 translate-x-full z-0" />
        <div className="absolute top-28 right-0 w-[5px] h-8 bg-[#334155] rounded-r border-r border-slate-500/30 translate-x-full z-0" />

        {/* ── IPAD BODY CONTAINER ── */}
        <div
          style={{
            transformStyle: "preserve-3d",
          }}
          className="w-full relative z-10 aspect-[4/3] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-[36px] p-[4px] border border-slate-500/35 shadow-2xl transition-all duration-100 flex items-center justify-center"
        >
          {/* Outer metal casing rim highlight */}
          <div className="absolute inset-px rounded-[34px] border border-slate-400/20 pointer-events-none z-30" />

          {/* Sleek, uniform iPad glass screen bezel */}
          <div className="w-full h-full bg-slate-950 rounded-[32px] p-3.5 sm:p-5 relative flex flex-col overflow-hidden border border-slate-950 shadow-[inset_0_0_15px_rgba(0,0,0,0.85)]">
            
            {/* Webcam / Front camera notch centered in top bezel (Landscape View) */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
              {/* Camera lens glass circle */}
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center shadow-inner">
                <div className="w-[3px] h-[3px] rounded-full bg-blue-900/60" />
              </div>
              {/* Ambient light sensor dot */}
              <div className="w-1 h-1 rounded-full bg-slate-900/40" />
            </div>

            {/* Screen Content Wrapper */}
            <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden relative border border-white/5 flex flex-col">
              {children}
            </div>

            {/* Glossy screen glass reflection overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[30px] z-30">
              <motion.div
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.01) 65%, rgba(255,255,255,0.07) 100%)",
                  x: glareX,
                  y: glareY,
                }}
                className="absolute -inset-full opacity-65 mix-blend-screen pointer-events-none"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
