"use client";

import { RevealWaveImage } from "@/components/ui/reveal-wave-image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Instagram, Github, ArrowUpRight } from "lucide-react";

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

  const projects = [
    {
      id: "proj-1",
      number: "01",
      title: "Meridian",
      subtitle: "Brand Identity & Web",
      description:
        "A complete rebrand for a luxury wellness platform — from visual identity to a fully immersive digital experience.",
      tags: ["Branding", "UI/UX", "Development"],
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      year: "2026",
    },
    {
      id: "proj-2",
      number: "02",
      title: "Aether",
      subtitle: "E-Commerce Experience",
      description:
        "Reimagining online retail with spatial design principles and cinematic product storytelling.",
      tags: ["E-Commerce", "3D", "Motion"],
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
      year: "2025",
    },
    {
      id: "proj-3",
      number: "03",
      title: "Solstice",
      subtitle: "Interactive Campaign",
      description:
        "An award-winning interactive campaign that blurred the line between art installation and digital marketing.",
      tags: ["Campaign", "WebGL", "Creative Dev"],
      image:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      year: "2025",
    },
  ];

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
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: SELECTED WORK ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="relative bg-[#060608] overflow-hidden"
      >
        {/* Subtle grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top gradient transition from hero */}
        <div className="h-32 bg-gradient-to-b from-black to-transparent" />

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Label + Line */}
          <div
            id="work-label"
            data-reveal
            className={`flex items-center gap-6 mb-16 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("work-label")
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8"
              }`}
          >
            <span
              className="text-[0.6rem] tracking-[0.5em] uppercase text-white/40"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Selected Work
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/15 to-transparent" />
            <span
              className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25"
              style={{ fontFamily: "var(--font-space)" }}
            >
              03 Projects
            </span>
          </div>

          {/* Section Title */}
          <div
            id="work-title"
            data-reveal
            className={`mb-24 md:mb-32 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("work-title")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
              }`}
          >
            <h2
              className="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white/90"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Stories we&apos;ve
              <br />
              <span className="text-white/30">brought to life</span>
            </h2>
            <p
              className="mt-6 max-w-md text-[0.85rem] leading-relaxed text-white/35 font-light tracking-wide"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Each project is a partnership — a deep dive into vision, craft,
              and the relentless pursuit of something remarkable.
            </p>
          </div>

          {/* ── Project Cards ── */}
          <div className="space-y-0">
            {projects.map((project, i) => (
              <div
                key={project.id}
                id={project.id}
                data-reveal
                className={`group/card transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible(project.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
                  }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Top divider */}
                <div className="h-[1px] bg-white/[0.06]" />

                <div className="py-12 md:py-16 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
                    {/* Left: Number + Meta */}
                    <div className="flex-shrink-0 md:w-16">
                      <span
                        className="text-[0.65rem] tracking-[0.3em] text-white/20 group-hover/card:text-white/50 transition-colors duration-500"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        {project.number}
                      </span>
                    </div>

                    {/* Center: Title + Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-4 mb-3">
                        <h3
                          className="text-[clamp(1.8rem,3.5vw,3rem)] font-bold tracking-[-0.02em] text-white/85 group-hover/card:text-white transition-colors duration-500"
                          style={{ fontFamily: "var(--font-syne)" }}
                        >
                          {project.title}
                        </h3>
                        <span
                          className="hidden md:inline text-[0.65rem] tracking-[0.2em] uppercase text-white/25 group-hover/card:text-white/45 transition-colors duration-500"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          {project.subtitle}
                        </span>
                        {/* Arrow that slides in on hover */}
                        <div className="hidden md:flex items-center ml-auto opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500">
                          <ArrowUpRight
                            size={20}
                            className="text-white/60"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      <p
                        className="max-w-lg text-[0.8rem] leading-relaxed text-white/30 group-hover/card:text-white/50 transition-colors duration-500"
                        style={{ fontFamily: "var(--font-space)" }}
                      >
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1 rounded-full text-white/25 group-hover/card:text-white/50 transition-all duration-500"
                            style={{
                              fontFamily: "var(--font-space)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        <span
                          className="text-[0.55rem] tracking-[0.2em] uppercase px-3 py-1 text-white/15 group-hover/card:text-white/30 transition-colors duration-500"
                          style={{ fontFamily: "var(--font-space)" }}
                        >
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Right: Image preview (appears on hover) */}
                    <div className="md:w-64 lg:w-80 flex-shrink-0 overflow-hidden rounded-lg relative">
                      <div
                        className="aspect-[16/10] bg-white/[0.03] overflow-hidden rounded-lg group-hover/card:scale-[1.02] transition-transform duration-700 ease-out"
                        style={{
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-40 grayscale group-hover/card:opacity-80 group-hover/card:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover/card:scale-100"
                        />
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent opacity-60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom divider */}
            <div className="h-[1px] bg-white/[0.06]" />
          </div>

          {/* ── View All CTA ── */}
          <div
            id="view-all"
            data-reveal
            className={`flex justify-center py-20 md:py-28 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible("view-all")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            <button
              className="group relative flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase text-white/40 hover:text-white/80 transition-all duration-500"
              style={{ fontFamily: "var(--font-space)" }}
            >
              <span className="relative">
                View all projects
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[1px] bg-white/40 transition-all duration-500" />
              </span>
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Bottom gradient fade to black */}
        <div className="h-24 bg-gradient-to-b from-transparent to-black" />
      </section>
    </div>
  );
}

