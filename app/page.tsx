"use client";

import { RevealWaveImage } from "@/components/ui/reveal-wave-image";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Navbar */}
      <nav className="pointer-events-none absolute top-0 left-0 right-0 z-10 px-8 py-6 md:px-12">
        <span className="text-xl font-bold tracking-[0.25em] uppercase text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          TXME
        </span>
      </nav>

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

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
    </div>
  );
}
