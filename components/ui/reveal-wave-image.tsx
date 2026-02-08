"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";

/* =========================================================
   RevealWaveImage Component (Optimized)
   - B&W 2-level dithering by default.
   - Animated continuous waves.
   - Mouse-interactive flashlight reveal of original color.
   - Mouse-interactive water ripples.
   - Smooth fading when mouse enters/leaves.
   - Uses CSS object-fit: cover for standard responsive sizing.
   ========================================================= */

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRevealRadius;
  uniform float uRevealSoftness;
  uniform float uPixelSize;
  uniform float uMouseActive;
  
  uniform float uWaveSpeed;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;
  uniform float uMouseRadius;
  
  varying vec2 vUv;
  
  // Simplex-style noise for organic movement
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Halftone dot pattern
  float halftone(vec2 coord, float gray) {
    vec2 cellSize = vec2(uPixelSize * 1.5);
    vec2 cell = mod(coord, cellSize) / cellSize - 0.5;
    float dotDist = length(cell);
    float dotRadius = gray * 0.5;
    return smoothstep(dotRadius + 0.05, dotRadius - 0.05, dotDist);
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // ── Organic noise-based waves (3 layers) ──
    float n1 = noise(uv * uWaveFrequency * 2.0 + time * uWaveSpeed * 0.3);
    float n2 = noise(uv * uWaveFrequency * 4.0 - time * uWaveSpeed * 0.2 + 50.0);
    float n3 = noise(uv * uWaveFrequency * 1.0 + time * uWaveSpeed * 0.15 + 100.0);
    
    float waveStrength = uWaveAmplitude * 0.06;
    vec2 distortedUv = uv;
    distortedUv.x += (n1 - 0.5) * waveStrength + (n3 - 0.5) * waveStrength * 0.5;
    distortedUv.y += (n2 - 0.5) * waveStrength + sin(uv.x * 8.0 + time * uWaveSpeed * 0.5) * waveStrength * 0.3;
    
    // ── Mouse ripple with organic distortion ──
    if (uMouseActive > 0.01) {
      vec2 mousePos = uMouse;
      float dist = distance(uv, mousePos);
      float mouseInfluence = smoothstep(uMouseRadius, 0.0, dist);
      
      float ripple = sin(dist * uWaveFrequency * 8.0 - time * uWaveSpeed * 2.0);
      ripple *= uWaveAmplitude * 0.03 * mouseInfluence * uMouseActive;
      
      vec2 dir = normalize(uv - mousePos + 0.001);
      distortedUv += dir * ripple;
    }
    
    // ── Sample texture ──
    vec4 color = texture2D(uTexture, distortedUv);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    // ── Apply contrast curve — pushed darker ──
    gray = smoothstep(0.2, 0.95, gray);
    gray *= 0.75;
    
    // ── Halftone dithering ──
    float ht = halftone(gl_FragCoord.xy, gray);
    vec3 bwColor = vec3(ht);
    
    // ── Subtle CRT scanlines ──
    float scanline = sin(gl_FragCoord.y * 1.5) * 0.03 + 1.0;
    bwColor *= scanline;
    
    // ── Cinematic vignette ──
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.8);
    bwColor *= mix(0.7, 1.0, vignette);
    
    // ── Flashlight reveal ──
    float revealDist = distance(uv, uMouse);
    float innerRadius = uRevealRadius * (1.0 - uRevealSoftness);
    float outerRadius = uRevealRadius;
    float revealAmount = 1.0 - smoothstep(innerRadius, outerRadius, revealDist);
    revealAmount *= uMouseActive;
    
    // Revealed area: smooth original color with slight film grain
    float grain = (hash(uv * 500.0 + time) - 0.5) * 0.04;
    vec3 revealColor = color.rgb + grain;
    
    vec3 finalColor = mix(bwColor, revealColor, revealAmount);
    
    gl_FragColor = vec4(finalColor, color.a);
  }
`;

interface ImagePlaneProps {
    src: string;
    aspectRatio: number;
    revealRadius: number;
    revealSoftness: number;
    pixelSize: number;
    waveSpeed: number;
    waveFrequency: number;
    waveAmplitude: number;
    mouseRadius: number;
    isMouseInCanvas: boolean;
}

function ImagePlane({
    src,
    aspectRatio,
    revealRadius,
    revealSoftness,
    pixelSize,
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    mouseRadius,
    isMouseInCanvas,
}: ImagePlaneProps) {
    const texture = useTexture(src);
    const meshRef = useRef<THREE.Mesh>(null);
    const { pointer } = useThree();
    const mouseActiveRef = useRef(0);
    const hasEnteredRef = useRef(false);

    const uniforms = useMemo(
        () => ({
            uTexture: { value: texture },
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(-10, -10) },
            uRevealRadius: { value: revealRadius },
            uRevealSoftness: { value: revealSoftness },
            uPixelSize: { value: pixelSize },
            uMouseActive: { value: 0 },
            uWaveSpeed: { value: waveSpeed },
            uWaveFrequency: { value: waveFrequency },
            uWaveAmplitude: { value: waveAmplitude },
            uMouseRadius: { value: mouseRadius },
        }),
        [
            texture,
            revealRadius,
            revealSoftness,
            pixelSize,
            waveSpeed,
            waveFrequency,
            waveAmplitude,
            mouseRadius,
        ],
    );

    const scale = useMemo<[number, number, number]>(() => {
        // Canvas clip-space is square (-1..1)
        if (aspectRatio > 1) {
            // Image is wider than tall
            return [aspectRatio, 1, 1];
        } else {
            // Image is taller than wide
            return [1, 1 / aspectRatio, 1];
        }
    }, [aspectRatio]);
    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;

            if (isMouseInCanvas) {
                hasEnteredRef.current = true;
            }

            const targetActive = isMouseInCanvas ? 1 : 0;
            const easingSpeed = 0.08;
            mouseActiveRef.current +=
                (targetActive - mouseActiveRef.current) * easingSpeed;
            material.uniforms.uMouseActive.value = mouseActiveRef.current;

            if (hasEnteredRef.current) {
                material.uniforms.uMouse.value.set(
                    (pointer.x + 1) / 2,
                    (pointer.y + 1) / 2,
                );
            }
        }
    });

    return (
        <mesh ref={meshRef} scale={scale}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

interface RevealWaveImageProps {
    src: string;
    revealRadius?: number;
    revealSoftness?: number;
    pixelSize?: number;
    waveSpeed?: number;
    waveFrequency?: number;
    waveAmplitude?: number;
    mouseRadius?: number;
    className?: string;
}

export const RevealWaveImage = ({
    src,
    revealRadius = 0.2,
    revealSoftness = 0.5,
    pixelSize = 3,
    waveSpeed = 0.5,
    waveFrequency = 3.0,
    waveAmplitude = 0.2,
    mouseRadius = 0.2,
    className = "h-full w-full",
}: RevealWaveImageProps) => {
    const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(16 / 9);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use viewport aspect ratio as immediate fallback
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                setAspectRatio(rect.width / rect.height);
            }
        }

        // Then load the actual image aspect ratio
        const img = document.createElement("img");
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
    }, [src]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={() => setIsMouseInCanvas(true)}
            onMouseLeave={() => setIsMouseInCanvas(false)}
        >
            <Canvas
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    position: "absolute",
                    inset: 0,
                }}
                gl={{ antialias: false }}
                camera={{ position: [0, 0, 1] }}
            >
                <ImagePlane
                    src={src}
                    aspectRatio={aspectRatio}
                    revealRadius={revealRadius}
                    revealSoftness={revealSoftness}
                    pixelSize={pixelSize}
                    waveSpeed={waveSpeed}
                    waveFrequency={waveFrequency}
                    waveAmplitude={waveAmplitude}
                    mouseRadius={mouseRadius}
                    isMouseInCanvas={isMouseInCanvas}
                />
            </Canvas>
        </div>
    );
};
