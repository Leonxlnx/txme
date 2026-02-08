"use client";

import { RevealWaveImage } from "@/components/ui/reveal-wave-image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Instagram, Github } from "lucide-react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  // Scroll-reveal refs
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = useCallback(
    (id: string) => visibleItems.has(id),
    [visibleItems]
  );



  return (
    <div className="relative bg-black">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── HERO SECTION ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="relative h-screen w-screen overflow-hidden">
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

        {/* ── Dark Overlay ── */}
        <div className="pointer-events-none absolute inset-0 bg-black/50" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        {/* ── Content Layer ── */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-6 py-6 md:px-12 md:py-10">
          {/* ── Top Bar ── */}
          <div
            className={`flex items-start justify-between transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-white/60" />
              <span
                className="text-[0.7rem] font-medium tracking-[0.35em] uppercase text-white/70"
                style={{ fontFamily: "var(--font-space)" }}
              >
                TXME Studio
              </span>
            </div>
            <span
              className="text-[0.65rem] tracking-[0.2em] uppercase text-white/70"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Munich — 2026
            </span>
          </div>

          {/* ── Center: Main Typography ── */}
          <div className="flex flex-col items-center justify-center flex-1 relative">
            <div
              className={`mb-6 transition-all duration-[1400ms] delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              {/* Pill Badge */}
              <span className="group/pill relative inline-block rounded-full p-[1px] transition-all duration-500 pointer-events-auto cursor-default">
                <span
                  className="absolute inset-0 rounded-full group-hover/pill:opacity-0 transition-opacity duration-500 pointer-events-none"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover/pill:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 0 16px rgba(255,255,255,0.08), 0 0 4px rgba(255,255,255,0.06)",
                  }}
                />
                <span
                  className="relative z-10 block text-[0.6rem] md:text-[0.7rem] tracking-[0.5em] uppercase text-white/60 group-hover/pill:text-white/80 px-6 py-2.5 rounded-full transition-all duration-500"
                  style={{
                    fontFamily: "var(--font-space)",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%), rgba(10,10,12,0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  Creative Studio for Digital Experiences
                </span>
              </span>
            </div>

            {/* Main headline */}
            <h1
              className={`text-center leading-[0.85] transition-all duration-[1600ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-[0.96]"
                }`}
              style={{ fontFamily: "var(--font-syne)" }}
            >
              <span
                className="block text-[clamp(3.5rem,15vw,12rem)] font-extrabold tracking-[-0.04em] drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)] transition-[filter] duration-[800ms] ease-out"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center 40%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: btnHover ? "grayscale(0)" : "grayscale(1)",
                }}
              >
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
                We craft digital experiences that move people — where code meets
                art and pixels push beyond their comfort zone.
              </span>
            </p>

            {/* CTA Buttons */}
            <div
              className={`pointer-events-auto mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-[2000ms] delay-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <button
                className="group relative px-10 py-3.5 bg-white/90 text-black text-[0.7rem] font-semibold tracking-[0.2em] uppercase rounded-lg hover:bg-white hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-all duration-300 overflow-hidden"
                style={{
                  fontFamily: "var(--font-space)",
                  boxShadow: "0 4px 24px rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  setBtnHover(true);
                  e.currentTarget.style.boxShadow =
                    "0 12px 50px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  setBtnHover(false);
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(255,255,255,0.1)";
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <span className="absolute top-1 left-1.5 text-[0.5rem] text-black/15 leading-none font-light group-hover:text-black/40 transition-colors duration-300">
                  +
                </span>
                <span className="absolute top-1 right-1.5 text-[0.5rem] text-black/15 leading-none font-light group-hover:text-black/40 transition-colors duration-300">
                  +
                </span>
                <span className="absolute bottom-0.5 left-1.5 text-[0.5rem] text-black/15 leading-none font-light group-hover:text-black/40 transition-colors duration-300">
                  +
                </span>
                <span className="absolute bottom-0.5 right-1.5 text-[0.5rem] text-black/15 leading-none font-light group-hover:text-black/40 transition-colors duration-300">
                  +
                </span>
                <span className="relative z-10">Start a project</span>
              </button>
              <button
                className="group relative px-10 py-3.5 text-white/70 text-[0.7rem] font-medium tracking-[0.2em] uppercase rounded-lg hover:text-white/95 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-all duration-300 overflow-hidden"
                style={{
                  fontFamily: "var(--font-space)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), rgba(10,10,12,0.35)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  setBtnHover(true);
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.boxShadow =
                    "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 40px rgba(255,255,255,0.08), 0 0 30px rgba(255,255,255,0.04)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%), rgba(10,10,12,0.35)";
                }}
                onMouseLeave={(e) => {
                  setBtnHover(false);
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.boxShadow =
                    "inset 0 1px 0 rgba(255,255,255,0.06)";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), rgba(10,10,12,0.35)";
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                <span className="absolute top-1 left-1.5 text-[0.5rem] text-white/15 leading-none font-light group-hover:text-white/40 transition-colors duration-300">
                  +
                </span>
                <span className="absolute top-1 right-1.5 text-[0.5rem] text-white/15 leading-none font-light group-hover:text-white/40 transition-colors duration-300">
                  +
                </span>
                <span className="absolute bottom-0.5 left-1.5 text-[0.5rem] text-white/15 leading-none font-light group-hover:text-white/40 transition-colors duration-300">
                  +
                </span>
                <span className="absolute bottom-0.5 right-1.5 text-[0.5rem] text-white/15 leading-none font-light group-hover:text-white/40 transition-colors duration-300">
                  +
                </span>
                <span className="relative z-10">View our work</span>
              </button>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div
            className={`flex items-end justify-end transition-all duration-[2000ms] delay-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <div className="flex items-center gap-6 pointer-events-auto">
              <a
                href="#"
                className="text-white/50 hover:text-white hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href="https://x.com/LexnLin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-white hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                  <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                  <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-white hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                <Github size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Corner Decorations ── */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div
            className={`absolute top-5 left-5 md:top-9 md:left-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="w-6 h-6 border-l border-t border-white/10" />
          </div>
          <div
            className={`absolute top-5 right-5 md:top-9 md:right-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="w-6 h-6 border-r border-t border-white/10" />
          </div>
          <div
            className={`absolute bottom-5 left-5 md:bottom-9 md:left-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="w-6 h-6 border-l border-b border-white/10" />
          </div>
          <div
            className={`absolute bottom-5 right-5 md:bottom-9 md:right-11 transition-all duration-[2000ms] delay-[1200ms] ${loaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="w-6 h-6 border-r border-b border-white/10" />
          </div>
        </div>

        {/* ── Hero bottom fade: diagonal via skewY (left higher, right lower) ── */}
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 z-20 h-56 md:h-72"
          style={{
            transformOrigin: "top left",
            transform: "skewY(-5deg)",
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.75) 60%, black 85%)",
          }}
        />
        {/* + grid overlay with same skew */}
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 z-20 h-44 md:h-56 select-none"
          style={{
            transformOrigin: "top left",
            transform: "skewY(-5deg)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Ctext x='18' y='20' text-anchor='middle' dominant-baseline='middle' font-family='monospace' font-size='7' fill='rgba(255,255,255,0.12)'%3E%2B%3C/text%3E%3C/svg%3E")`,
            backgroundSize: "36px 36px",
            maskImage: "linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.3) 70%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.3) 70%, transparent 95%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: ABOUT ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="relative bg-black overflow-hidden"
      >
        {/* Grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute top-20 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
        />
        <div className="pointer-events-none absolute bottom-10 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.015]"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32">
          {/* ── Section Label ── */}
          <div
            id="about-label"
            data-reveal
            className={`flex items-center gap-6 mb-20 md:mb-28 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("about-label")
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8"
              }`}
          >
            {/* Frosty pill label — matching hero style */}
            <span className="group/pill relative inline-block rounded-full p-[1px]">
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <span
                className="relative z-10 block text-[0.55rem] tracking-[0.5em] uppercase text-white/50 px-5 py-2 rounded-full"
                style={{
                  fontFamily: "var(--font-space)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), rgba(10,10,12,0.5)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                About
              </span>
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
            {/* Corner marks */}
            <span className="text-[0.45rem] text-white/15" style={{ fontFamily: "var(--font-space)" }}>+</span>
          </div>

          {/* ── Main Content: Editorial Split ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-28 md:mb-36">
            {/* Left Column: Big headline (7 cols) */}
            <div
              id="about-headline"
              data-reveal
              className={`lg:col-span-7 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("about-headline")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
                }`}
            >
              <h2
                className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.08] tracking-[-0.03em]"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                <span className="text-white/90">Born at the</span>
                <br />
                <span className="text-white/90">intersection of</span>
                <br />
                <span
                  className="inline-block mt-1"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.15))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  design &amp; technology.
                </span>
              </h2>

              {/* Decorative detail under headline */}
              <div className="flex items-center gap-3 mt-8">
                <div className="h-[1px] w-12 bg-white/10" />
                <span className="text-[0.5rem] text-white/15" style={{ fontFamily: "var(--font-space)" }}>+</span>
                <div className="h-[1px] w-8 bg-white/[0.06]" />
              </div>
            </div>

            {/* Right Column: Glass body card (5 cols) */}
            <div
              id="about-body"
              data-reveal
              className={`lg:col-span-5 flex flex-col justify-end transition-all duration-[1400ms] delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("about-body")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
                }`}
            >
              {/* Frosted glass card */}
              <div
                className="relative rounded-xl p-6 md:p-8"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%), rgba(10,10,14,0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.3)",
                }}
              >
                {/* Card corner decorations */}
                <span className="absolute top-2 left-3 text-[0.4rem] text-white/10 leading-none" style={{ fontFamily: "var(--font-space)" }}>+</span>
                <span className="absolute top-2 right-3 text-[0.4rem] text-white/10 leading-none" style={{ fontFamily: "var(--font-space)" }}>+</span>
                <span className="absolute bottom-2 left-3 text-[0.4rem] text-white/10 leading-none" style={{ fontFamily: "var(--font-space)" }}>+</span>
                <span className="absolute bottom-2 right-3 text-[0.4rem] text-white/10 leading-none" style={{ fontFamily: "var(--font-space)" }}>+</span>

                <p
                  className="text-[0.82rem] md:text-[0.9rem] leading-[1.85] text-white/45 font-light tracking-wide"
                  style={{ fontFamily: "var(--font-space)" }}
                >
                  I&apos;m a designer, developer, and visual thinker who believes
                  the web should feel alive. Every project I touch becomes an
                  experience — not just a page.
                </p>
                <p
                  className="mt-4 text-[0.82rem] md:text-[0.9rem] leading-[1.85] text-white/35 font-light tracking-wide"
                  style={{ fontFamily: "var(--font-space)" }}
                >
                  From WebGL-driven microsites to interactive installations —
                  I push pixels beyond their comfort zone.
                </p>

                {/* Subtle inner glow at top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          </div>

          {/* ── Stats Row: Frosted Glass Cards ── */}
          <div
            id="about-stats"
            data-reveal
            className={`transition-all duration-[1400ms] delay-[100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("about-stats")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-16"
              }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { value: "2026", label: "Founded", detail: "EST." },
                { value: "Munich", label: "Based in", detail: "DE" },
                { value: "15+", label: "Projects shipped", detail: "WRK" },
                { value: "3", label: "Disciplines", detail: "SKL" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  id={`stat-${i}`}
                  data-reveal
                  className={`group/stat relative rounded-xl p-5 md:p-6 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default ${isVisible(`stat-${i}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                    }`}
                  style={{
                    transitionDelay: `${i * 120}ms`,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%), rgba(12,12,16,0.6)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Hover glow border overlay */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: "0 0 20px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  />

                  {/* Corner + */}
                  <span className="absolute top-2 right-2.5 text-[0.4rem] text-white/8 group-hover/stat:text-white/25 transition-colors duration-500 leading-none" style={{ fontFamily: "var(--font-space)" }}>+</span>

                  {/* Tiny detail label */}
                  <span
                    className="text-[0.45rem] tracking-[0.4em] uppercase text-white/15 group-hover/stat:text-white/30 transition-colors duration-500 block mb-3"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {stat.detail}
                  </span>

                  {/* Value */}
                  <div
                    className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-[-0.02em] text-white/75 group-hover/stat:text-white/95 transition-colors duration-500 mb-1.5"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div
                    className="text-[0.55rem] tracking-[0.25em] uppercase text-white/20 group-hover/stat:text-white/40 transition-colors duration-500"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom decorative row */}
          <div className="flex items-center justify-between mt-16 md:mt-20">
            <div className="flex items-center gap-2">
              <span className="text-[0.4rem] text-white/10" style={{ fontFamily: "var(--font-space)" }}>+</span>
              <div className="h-[1px] w-8 bg-white/[0.06]" />
            </div>
            <span
              className="text-[0.5rem] tracking-[0.5em] uppercase text-white/12"
              style={{ fontFamily: "var(--font-space)" }}
            >
              TXME — Munich, DE
            </span>
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-8 bg-white/[0.06]" />
              <span className="text-[0.4rem] text-white/10" style={{ fontFamily: "var(--font-space)" }}>+</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="h-24 bg-gradient-to-b from-transparent to-black" />
      </section>
    </div>
  );
}

