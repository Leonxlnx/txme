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
  
  // Custom 8x8 Cluster Dot Dithering for a more high-end 'printed' look
  float cluster8x8(vec2 pos) {
    int x = int(mod(pos.x, 8.0));
    int y = int(mod(pos.y, 8.0));
    int index = x + y * 8;
    
    // Cluster pattern table
    float p[64];
    p[0]=0.73; p[1]=0.84; p[2]=0.89; p[3]=0.83; p[4]=0.72; p[5]=0.55; p[6]=0.47; p[7]=0.53;
    p[8]=0.86; p[9]=0.95; p[10]=0.98; p[11]=0.94; p[12]=0.81; p[13]=0.34; p[14]=0.22; p[15]=0.31;
    p[16]=0.91; p[17]=1.00; p[18]=0.97; p[19]=0.88; p[20]=0.69; p[21]=0.19; p[22]=0.02; p[23]=0.16;
    p[24]=0.78; p[25]=0.92; p[26]=0.77; p[27]=0.63; p[28]=0.44; p[29]=0.27; p[30]=0.09; p[31]=0.25;
    p[32]=0.61; p[33]=0.42; p[34]=0.28; p[35]=0.11; p[36]=0.24; p[37]=0.59; p[38]=0.75; p[39]=0.90;
    p[40]=0.39; p[41]=0.13; p[42]=0.00; p[43]=0.14; p[44]=0.38; p[45]=0.70; p[46]=0.93; p[47]=0.99;
    p[48]=0.48; p[49]=0.20; p[50]=0.03; p[51]=0.17; p[52]=0.45; p[53]=0.80; p[54]=0.96; p[55]=0.87;
    p[56]=0.56; p[57]=0.36; p[58]=0.23; p[59]=0.33; p[60]=0.58; p[61]=0.71; p[62]=0.85; p[63]=0.74;

    for (int i = 0; i < 64; i++) {
        if (i == index) return p[i];
    }
    return 0.0;
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // ── Compound Wave Motion (Dynamic & Unique) ──
    float w1 = sin(uv.y * uWaveFrequency + time * uWaveSpeed) * 0.6;
    float w2 = sin(uv.x * uWaveFrequency * 0.8 - time * uWaveSpeed * 0.7) * 0.4;
    float w3 = sin((uv.x + uv.y) * uWaveFrequency * 0.5 + time * uWaveSpeed * 1.2) * 0.3;
    
    float totalWave = (w1 + w2 + w3) * uWaveAmplitude * 0.1;
    vec2 distortedUv = uv + vec2(totalWave, totalWave * 0.5);
    
    // ── Interaction Ripple (Enhanced) ──
    if (uMouseActive > 0.01) {
        float dist = distance(uv, uMouse);
        float ripple = sin(dist * uWaveFrequency * 6.0 - time * uWaveSpeed * 3.0);
        distortedUv += normalize(uv - uMouse + 0.001) * ripple * uWaveAmplitude * 0.04 * smoothstep(uMouseRadius, 0.0, dist) * uMouseActive;
    }
    
    // ── Grayscale & Contrast ──
    vec4 texColor = texture2D(uTexture, distortedUv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    gray = smoothstep(-0.05, 1.05, gray); // Slightly boost dynamic range
    
    // ── Temporal Cluster Dither ──
    // We add a tiny 'jitter' based on time to make the dither feel alive
    float jitter = (fract(sin(time * 60.0) * 43758.5453) - 0.5) * 0.015;
    vec2 pixelCoord = gl_FragCoord.xy / uPixelSize;
    float ditherVal = cluster8x8(pixelCoord);
    
    float limit = ditherVal + jitter;
    float quantized = gray > limit ? 1.0 : (gray > limit * 0.5 ? 0.5 : 0.0);
    vec3 bwColor = vec3(quantized);
    
    // ── Reveal with Chromatic Aberration ──
    float revealDist = distance(uv, uMouse);
    float edge = smoothstep(uRevealRadius, uRevealRadius * (1.0 - uRevealSoftness), revealDist) * uMouseActive;
    
    // Sample channels separately for a tiny color fringe on the reveal edge
    float shift = 0.003 * edge;
    vec3 colorLow = texture2D(uTexture, distortedUv + vec2(shift, 0.0)).rgb;
    vec3 colorMid = texture2D(uTexture, distortedUv).rgb;
    vec3 colorHigh = texture2D(uTexture, distortedUv - vec2(shift, 0.0)).rgb;
    vec3 revealColor = vec3(colorLow.r, colorMid.g, colorHigh.b);
    
    vec3 finalColor = mix(bwColor, revealColor, edge);
    
    // Subtle scanline overlay for texture
    finalColor *= 0.97 + 0.03 * sin(gl_FragCoord.y * 1.5);
    
    gl_FragColor = vec4(finalColor, texColor.a);
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
