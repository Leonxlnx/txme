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

  // Click Wave Uniforms
  uniform vec2 uClickPos;
  uniform float uClickTime;
  uniform float uClickDuration;
  
  varying vec2 vUv;
  
  // Bayer 4x4 dithering pattern
  float bayer4x4(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int index = x + y * 4;
    
    float pattern[16];
    pattern[0] = 0.0;    pattern[1] = 8.0;    pattern[2] = 2.0;    pattern[3] = 10.0;
    pattern[4] = 12.0;   pattern[5] = 4.0;    pattern[6] = 14.0;   pattern[7] = 6.0;
    pattern[8] = 3.0;    pattern[9] = 11.0;   pattern[10] = 1.0;   pattern[11] = 9.0;
    pattern[12] = 15.0;  pattern[13] = 7.0;   pattern[14] = 13.0;  pattern[15] = 5.0;
    
    // Manual index lookup for GLSL 1.0 compatibility
    if (index == 0) return pattern[0] / 16.0;
    if (index == 1) return pattern[1] / 16.0;
    if (index == 2) return pattern[2] / 16.0;
    if (index == 3) return pattern[3] / 16.0;
    if (index == 4) return pattern[4] / 16.0;
    if (index == 5) return pattern[5] / 16.0;
    if (index == 6) return pattern[6] / 16.0;
    if (index == 7) return pattern[7] / 16.0;
    if (index == 8) return pattern[8] / 16.0;
    if (index == 9) return pattern[9] / 16.0;
    if (index == 10) return pattern[10] / 16.0;
    if (index == 11) return pattern[11] / 16.0;
    if (index == 12) return pattern[12] / 16.0;
    if (index == 13) return pattern[13] / 16.0;
    if (index == 14) return pattern[14] / 16.0;
    return pattern[15] / 16.0;
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime;
    
    // ── Distortions ──
    float waveStrength = uWaveAmplitude * 0.1;
    float wave1 = sin(uv.y * uWaveFrequency + time * uWaveSpeed) * waveStrength;
    float wave2 = sin(uv.x * uWaveFrequency * 0.7 + time * uWaveSpeed * 0.8) * waveStrength * 0.5;
    
    vec2 distortedUv = uv;
    distortedUv.x += wave1;
    distortedUv.y += wave2;
    
    // Hover Distortion (No Color Reveal anymore)
    if (uMouseActive > 0.01) {
        float dist = distance(uv, uMouse);
        float mouseInfluence = smoothstep(uMouseRadius, 0.0, dist);
        float hoverDistort = sin(dist * 10.0 - time * 2.0) * 0.02 * mouseInfluence * uMouseActive;
        distortedUv += normalize(uv - uMouse + 0.0001) * hoverDistort;
    }

    // Click Ripple Distortion & Reveal
    float clickElapsed = time - uClickTime;
    float clickProgress = clamp(clickElapsed / uClickDuration, 0.0, 1.0);
    float revealAmount = 0.0;
    
    if (clickProgress > 0.0 && clickProgress < 1.0) {
        float clickDist = distance(uv, uClickPos);
        float waveRadius = clickProgress * 1.5; // Expanding circle
        float waveInner = waveRadius - 0.2;
        float waveOuter = waveRadius;
        
        // The wave itself causes extra distortion
        float waveStrength = (1.0 - clickProgress) * 0.05;
        float waveFactor = smoothstep(waveInner, waveOuter, clickDist) * smoothstep(waveOuter + 0.1, waveOuter, clickDist);
        distortedUv += normalize(uv - uClickPos + 0.0001) * waveFactor * waveStrength;
        
        // Reveal Logic: Everything inside the wave becomes colored temporarily
        revealAmount = smoothstep(waveOuter, waveInner, clickDist) * (1.0 - clickProgress);
    }
    
    vec4 texColor = texture2D(uTexture, distortedUv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Dithering
    vec2 pixelCoord = floor(gl_FragCoord.xy / uPixelSize);
    float dither = bayer4x4(pixelCoord);
    
    float quantized;
    float adjusted = gray + (dither - 0.5) * 0.6;
    if (adjusted < 0.33) quantized = 0.0;
    else if (adjusted < 0.66) quantized = 0.5;
    else quantized = 1.0;
    
    vec3 bwColor = vec3(quantized);
    vec3 finalColor = mix(bwColor, texColor.rgb, revealAmount);
    
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
    clickState: { pos: THREE.Vector2; time: number };
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
    clickState,
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
            uClickPos: { value: new THREE.Vector2(-10, -10) },
            uClickTime: { value: -100 },
            uClickDuration: { value: 1.5 },
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
        if (aspectRatio > 1) return [aspectRatio * 2, 2, 1];
        return [2, 2 / aspectRatio, 1];
    }, [aspectRatio]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            material.uniforms.uClickPos.value.copy(clickState.pos);
            material.uniforms.uClickTime.value = clickState.time;

            if (isMouseInCanvas) hasEnteredRef.current = true;

            const targetActive = isMouseInCanvas ? 1 : 0;
            const easingSpeed = 0.08;
            mouseActiveRef.current += (targetActive - mouseActiveRef.current) * easingSpeed;
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
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
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
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [clickState, setClickState] = useState({ pos: new THREE.Vector2(-10, -10), time: -100 });

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
    }, [src]);

    return (
        <div
            className={`relative overflow-hidden cursor-crosshair ${className}`}
            onMouseEnter={() => setIsMouseInCanvas(true)}
            onMouseLeave={() => setIsMouseInCanvas(false)}
            onClickCapture={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = 1.0 - (e.clientY - rect.top) / rect.height;
                setClickState({ pos: new THREE.Vector2(x, y), time: performance.now() / 1000 });
            }}
        >
            {aspectRatio !== null && (
                <Canvas
                    style={{ width: "100%", height: "100%", display: "block" }}
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
                        clickState={clickState}
                    />
                </Canvas>
            )}
        </div>
    );
};
