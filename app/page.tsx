"use client";

import { RevealWaveImage } from "@/components/ui/reveal-wave-image";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Stagger the entrance animation
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* ── Shader Background ── */}
      <RevealWaveImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        waveSpeed={0.2}
        waveFrequency={0.7}
        waveAmplitude={0.5}
        revealRadius={0.5}
        revealSoftness={1}
        pixelSize={2}
        mouseRadius={0.4}
        className="h-full w-full"
      />

      {/* ── Dark Overlay: stronger center for text contrast ── */}
      <div className="pointer-events-none absolute inset-0 bg-black/50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* ── Content Layer ── */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-6 py-6 md:px-12 md:py-10">

        {/* ── Top Bar ── */}
        <div
          className={`flex items-start justify-between transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-white/60" />
            <span
              className="text-[0.7rem] font-medium tracking-[0.35em] uppercase text-white/70"
              style={{ fontFamily: "var(--font-space)" }}
            >
              TXME Studio
            </span>
          </div>

          {/* Top Right Tag */}
          <span
            className="text-[0.65rem] tracking-[0.2em] uppercase text-white/70"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Berlin — 2025
          </span>
        </div>

        {/* ── Center: Main Typography ── */}
        <div className="flex flex-col items-center justify-center flex-1 relative">

          {/* Small label above */}
          <div
            className={`mb-6 transition-all duration-[1400ms] delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <span
              className="text-[0.6rem] md:text-[0.7rem] tracking-[0.5em] uppercase text-white/40 border border-white/10 px-5 py-2 rounded-full"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Creative Studio for Digital Experiences
            </span>
          </div>

          {/* Main headline — massive display type */}
          <h1
            className={`text-center leading-[0.85] transition-all duration-[1600ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.96]"
              }`}
            style={{ fontFamily: "var(--font-syne)" }}
          >
            <span className="block text-[clamp(3.5rem,15vw,12rem)] font-extrabold tracking-[-0.04em] text-white/95 drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
              TXME
            </span>
          </h1>

          {/* Decorative line */}
          <div
            className={`my-6 transition-all duration-[1800ms] delay-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
          >
            <div className="h-[1px] w-24 md:w-40 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          {/* Tagline */}
          <p
            className={`text-center max-w-xl mx-auto transition-all duration-[1800ms] delay-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <span
              className="text-[0.85rem] md:text-[1.05rem] leading-relaxed text-white/55 font-light tracking-wide"
              style={{ fontFamily: "var(--font-space)" }}
            >
              We craft digital experiences that move people — where code meets art and pixels push beyond their comfort zone.
            </span>
          </p>

          {/* CTA Buttons */}
          <div
            className={`pointer-events-auto mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-[2000ms] delay-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <button className="group relative px-8 py-3 bg-white/95 text-black text-[0.75rem] font-semibold tracking-[0.2em] uppercase rounded-none hover:bg-white transition-all duration-300 overflow-hidden"
              style={{ fontFamily: "var(--font-space)" }}
            >
              <span className="relative z-10">Start a project</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <button className="px-8 py-3 border border-white/20 text-white/70 text-[0.75rem] font-medium tracking-[0.2em] uppercase rounded-none hover:border-white/50 hover:text-white/90 transition-all duration-300"
              style={{ fontFamily: "var(--font-space)" }}
            >
              View our work
            </button>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          className={`flex items-end justify-between transition-all duration-[2000ms] delay-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          {/* Bottom Left: Scroll Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[1px] h-8 bg-white/50 animate-pulse" />
              <span
                className="text-[0.55rem] tracking-[0.3em] uppercase text-white/50 writing-mode-vertical"
                style={{ fontFamily: "var(--font-space)", writingMode: "vertical-rl" }}
              >
                Scroll
              </span>
            </div>
          </div>

          {/* Bottom Right: Social / Links */}
          <div className="flex flex-col items-end gap-1">
            {["Instagram", "Dribbble", "GitHub"].map((social) => (
              <span
                key={social}
                className="text-[0.55rem] tracking-[0.15em] uppercase text-white/50 hover:text-white/80 transition-colors duration-300 cursor-pointer pointer-events-auto"
                style={{ fontFamily: "var(--font-space)" }}
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Corner Decorations ── */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* Top-left corner bracket */}
        <div className={`absolute top-5 left-5 md:top-9 md:left-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"}`}>
          <div className="w-6 h-6 border-l border-t border-white/10" />
        </div>
        {/* Top-right corner bracket */}
        <div className={`absolute top-5 right-5 md:top-9 md:right-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"}`}>
          <div className="w-6 h-6 border-r border-t border-white/10" />
        </div>
        {/* Bottom-left corner bracket */}
        <div className={`absolute bottom-5 left-5 md:bottom-9 md:left-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"}`}>
          <div className="w-6 h-6 border-l border-b border-white/10" />
        </div>
        {/* Bottom-right corner bracket */}
        <div className={`absolute bottom-5 right-5 md:bottom-9 md:right-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"}`}>
          <div className="w-6 h-6 border-r border-b border-white/10" />
        </div>
      </div>
    </div>
  );
}
