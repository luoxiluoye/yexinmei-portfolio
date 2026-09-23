"use client";

import { ContactShadows, Image as DreiImage, RoundedBox, useCursor } from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

export type PortfolioZoneId = "writing" | "photography" | "aigc" | "video";

type StudioSceneProps = {
  onSelect: (zone: PortfolioZoneId) => void;
};

const COLORS = {
  blue: "#cfddea",
  blueDeep: "#b8cddd",
  cream: "#f5f0e7",
  paper: "#fbf8f1",
  white: "#fffefd",
  ink: "#3f4248",
  red: "#a65252",
  writingGlow: "#f0a17f",
  photoGlow: "#8bb9ef",
  visualGlow: "#f3c276",
  videoGlow: "#ef8b8c",
};

function material(color: string, roughness = 0.62, metalness = 0.02) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function Box({
  position,
  scale,
  color,
  radius = 0.08,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  radius?: number;
  rotation?: [number, number, number];
}) {
  return (
    <RoundedBox args={scale} radius={radius} smoothness={4} position={position} rotation={rotation} castShadow receiveShadow>
      {material(color)}
    </RoundedBox>
  );
}

function GlowBorder({
  width,
  height,
  color,
  hovered,
  z = 0.42,
}: {
  width: number;
  height: number;
  color: string;
  hovered: boolean;
  z?: number;
}) {
  const alpha = hovered ? 0.98 : 0.34;
  const haloAlpha = hovered ? 0.25 : 0.07;
  const edge = 0.045;
  const halo = 0.095;
  const mat = (opacity: number) => (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      toneMapped={false}
    />
  );

  return (
    <group>
      <mesh position={[0, height / 2, z]}><boxGeometry args={[width, edge, edge]} />{mat(alpha)}</mesh>
      <mesh position={[0, -height / 2, z]}><boxGeometry args={[width, edge, edge]} />{mat(alpha)}</mesh>
      <mesh position={[-width / 2, 0, z]}><boxGeometry args={[edge, height, edge]} />{mat(alpha)}</mesh>
      <mesh position={[width / 2, 0, z]}><boxGeometry args={[edge, height, edge]} />{mat(alpha)}</mesh>

      <mesh position={[0, height / 2, z - 0.015]}><boxGeometry args={[width + 0.08, halo, halo]} />{mat(haloAlpha)}</mesh>
      <mesh position={[0, -height / 2, z - 0.015]}><boxGeometry args={[width + 0.08, halo, halo]} />{mat(haloAlpha)}</mesh>
      <mesh position={[-width / 2, 0, z - 0.015]}><boxGeometry args={[halo, height + 0.08, halo]} />{mat(haloAlpha)}</mesh>
      <mesh position={[width / 2, 0, z - 0.015]}><boxGeometry args={[halo, height + 0.08, halo]} />{mat(haloAlpha)}</mesh>
    </group>
  );
}

function Hotspot({
  position,
  color,
  active,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
}) {
  return (
    <group position={position} scale={active ? 1.12 : 1}>
      <mesh>
        <ringGeometry args={[0.095, 0.145, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.72} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.055, 32]} />
        <meshBasicMaterial color="#fffdf8" transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={active ? 1.7 : 0.55} distance={1.8} />
    </group>
  );
}

function InteractiveZone({
  id,
  position,
  size,
  glow,
  hotspot,
  onSelect,
  children,
}: {
  id: PortfolioZoneId;
  position: [number, number, number];
  size: [number, number];
  glow: string;
  hotspot: [number, number, number];
  onSelect: (zone: PortfolioZoneId) => void;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.018 : 1;
    const next = THREE.MathUtils.damp(group.current.scale.x, target, 8, delta);
    group.current.scale.setScalar(next);
  });

  function handleOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(true);
  }

  function handleOut(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(false);
  }

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(id);
  }

  return (
    <group ref={group} position={position}>
      {children}
      <GlowBorder width={size[0]} height={size[1]} color={glow} hovered={hovered} />
      <Hotspot position={hotspot} color={glow} active={hovered} />
      <mesh
        position={[0, 0, 0.55]}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <boxGeometry args={[size[0], size[1], 0.28]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Book({
  position,
  size,
  color = COLORS.paper,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return <Box position={position} scale={size} color={color} radius={0.025} rotation={rotation} />;
}

function TinyPlant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leaves = useMemo(
    () => [
      [-0.22, 0.34, 0.04, -0.6],
      [0.18, 0.42, 0.02, 0.55],
      [-0.08, 0.58, 0.02, -0.2],
      [0.28, 0.68, 0, 0.75],
      [-0.30, 0.74, 0.01, -0.8],
      [0.02, 0.88, 0, 0.1],
    ] as const,
    []
  );

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.36, 24]} />
        <meshStandardMaterial color="#f6f1e8" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.018, 0.026, 0.9, 10]} />
        <meshStandardMaterial color="#667b58" />
      </mesh>
      {leaves.map(([x, y, z, r], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, 0, r]} castShadow>
          <sphereGeometry args={[0.16, 16, 10]} />
          <meshStandardMaterial color={index % 2 ? "#6f8d60" : "#7f9c6a"} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Bear({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 18]} />
        <meshStandardMaterial color="#fbfaf5" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <sphereGeometry args={[0.25, 24, 18]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.72} />
      </mesh>
      <mesh position={[-0.15, 0.52, 0]}><sphereGeometry args={[0.08, 16, 12]} />{material("#fbfaf5")}</mesh>
      <mesh position={[0.15, 0.52, 0]}><sphereGeometry args={[0.08, 16, 12]} />{material("#fbfaf5")}</mesh>
      <mesh position={[-0.07, 0.38, 0.2]}><sphereGeometry args={[0.018, 12, 8]} />{material("#33343a")}</mesh>
      <mesh position={[0.07, 0.38, 0.2]}><sphereGeometry args={[0.018, 12, 8]} />{material("#33343a")}</mesh>
    </group>
  );
}

function LeftShelf({ onSelect }: { onSelect: StudioSceneProps["onSelect"] }) {
  return (
    <InteractiveZone
      id="writing"
      position={[-4.25, 0.55, 0]}
      size={[3.05, 5.45]}
      glow={COLORS.writingGlow}
      hotspot={[0.95, 0.7, 0.6]}
      onSelect={onSelect}
    >
      <Box position={[0, 0, 0]} scale={[3.05, 5.45, 0.48]} color={COLORS.blue} radius={0.2} />
      <Box position={[-1.34, 0, 0.2]} scale={[0.17, 5.1, 0.68]} color={COLORS.cream} radius={0.06} />
      <Box position={[1.34, 0, 0.2]} scale={[0.17, 5.1, 0.68]} color={COLORS.cream} radius={0.06} />
      {[1.75, 0.25, -1.28].map((y) => (
        <Box key={y} position={[0, y, 0.24]} scale={[2.62, 0.13, 0.72]} color={COLORS.cream} radius={0.045} />
      ))}
      <TinyPlant position={[-0.58, 1.82, 0.62]} scale={0.95} />
      <Book position={[0.28, 1.02, 0.6]} size={[0.25, 1.12, 0.42]} color="#f1eee8" />
      <Book position={[0.58, 1.0, 0.61]} size={[0.28, 1.0, 0.42]} color="#ded9d1" />
      <Book position={[0.88, 0.98, 0.61]} size={[0.24, 0.92, 0.42]} color="#f8f4ed" />
      <Bear position={[0.0, 0.58, 0.63]} />
      <Book position={[-0.62, -0.52, 0.6]} size={[0.52, 1.05, 0.38]} color="#f1ede6" />
      <Book position={[-0.08, -0.54, 0.6]} size={[0.23, 0.98, 0.38]} color="#dedad4" />
      <Book position={[0.18, -0.55, 0.6]} size={[0.21, 0.86, 0.38]} color="#f7f4ee" />
      <Book position={[0.44, -0.58, 0.6]} size={[0.22, 0.82, 0.38]} color="#d4d0ca" />
      <Book position={[0.66, -1.02, 0.65]} size={[0.95, 0.14, 0.5]} color="#f7f4ee" />
      <Book position={[0.70, -1.20, 0.65]} size={[1.10, 0.13, 0.5]} color="#e3ded6" />
      <mesh position={[1.0, -0.73, 0.67]}>
        <cylinderGeometry args={[0.22, 0.2, 0.65, 24]} />
        <meshStandardMaterial color="#f5efe6" roughness={0.72} />
      </mesh>
    </InteractiveZone>
  );
}

const photoAssets = [
  "/assets/photos/portrait/portrait-01.jpeg",
  "/assets/photos/yu-chaoying-concert/concert-03.jpeg",
  "/assets/photos/happy-mahua/still-02.jpeg",
  "/assets/photos/portrait/portrait-06.jpeg",
  "/assets/photos/ziroom-campaign/campaign-02.jpeg",
  "/assets/photos/meituan-product/product-02.jpeg",
];

function CameraProp() {
  return (
    <group position={[0.05, -1.86, 0.72]}>
      <Box position={[0, 0, 0]} scale={[1.05, 0.58, 0.45]} color="#4a4c50" radius={0.07} />
      <Box position={[-0.18, 0.18, 0.04]} scale={[0.42, 0.16, 0.46]} color="#d9d6ce" radius={0.04} />
      <mesh position={[0.19, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.34, 0.34, 28]} />
        <meshStandardMaterial color="#1f2024" roughness={0.34} metalness={0.28} />
      </mesh>
      <mesh position={[0.19, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.1, 28]} />
        <meshStandardMaterial color="#111217" roughness={0.2} metalness={0.25} />
      </mesh>
    </group>
  );
}

function PhotoBoard({ onSelect }: { onSelect: StudioSceneProps["onSelect"] }) {
  const placements = [
    [-1.05, 1.42, 0.52, 1.0, 0.72, -0.04],
    [0.15, 1.55, 0.53, 1.18, 0.82, 0.025],
    [1.16, 1.25, 0.52, 1.0, 0.78, -0.02],
    [-0.86, 0.28, 0.55, 0.82, 0.95, 0.06],
    [0.25, 0.38, 0.55, 1.05, 0.82, -0.03],
    [1.16, 0.26, 0.55, 0.82, 0.95, 0.05],
  ] as const;

  return (
    <InteractiveZone
      id="photography"
      position={[-0.4, 0.62, 0.02]}
      size={[4.05, 5.3]}
      glow={COLORS.photoGlow}
      hotspot={[1.42, 0.92, 0.67]}
      onSelect={onSelect}
    >
      <Box position={[0, 0, 0]} scale={[4.05, 5.3, 0.35]} color="#e6e4df" radius={0.2} />
      {Array.from({ length: 54 }).map((_, index) => {
        const col = index % 9;
        const row = Math.floor(index / 9);
        return (
          <mesh key={index} position={[-1.68 + col * 0.42, 2.12 - row * 0.65, 0.2]}>
            <circleGeometry args={[0.025, 10]} />
            <meshStandardMaterial color="#b8b5af" roughness={0.9} />
          </mesh>
        );
      })}

      {placements.map(([x, y, z, w, h, r], index) => (
        <group key={photoAssets[index]} position={[x, y, z]} rotation={[0, 0, r]}>
          <Box position={[0, 0, -0.03]} scale={[w + 0.12, h + 0.16, 0.05]} color="#fffdf8" radius={0.02} />
          <DreiImage url={photoAssets[index]} scale={[w, h]} />
        </group>
      ))}

      <CameraProp />
      <TinyPlant position={[-1.55, -2.08, 0.55]} scale={0.72} />
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[0.88 + index * 0.24, -1.98, 0.65]}>
          <cylinderGeometry args={[0.075, 0.075, 0.48, 18]} />
          <meshStandardMaterial color={index % 2 ? "#d39c5b" : "#2c2d31"} roughness={0.45} />
        </mesh>
      ))}
    </InteractiveZone>
  );
}

function AbstractCard({
  position,
  size,
  base,
  accent,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size: [number, number];
  base: string;
  accent: string;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 0, 0]} scale={[size[0], size[1], 0.06]} color={base} radius={0.035} />
      <mesh position={[size[0] * 0.18, size[1] * 0.16, 0.05]}>
        <circleGeometry args={[Math.min(size[0], size[1]) * 0.22, 36]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>
    </group>
  );
}

function VisualOrganizer({ onSelect }: { onSelect: StudioSceneProps["onSelect"] }) {
  return (
    <InteractiveZone
      id="aigc"
      position={[3.82, 1.36, 0.08]}
      size={[3.55, 3.32]}
      glow={COLORS.visualGlow}
      hotspot={[1.05, 0.4, 0.68]}
      onSelect={onSelect}
    >
      <Box position={[0, 0, 0]} scale={[3.55, 3.32, 0.42]} color={COLORS.blueDeep} radius={0.2} />
      <AbstractCard position={[-0.86, 0.34, 0.36]} size={[1.05, 1.55]} base="#f5efe7" accent="#c06c68" rotation={[0, 0, -0.03]} />
      <AbstractCard position={[-0.02, 0.24, 0.40]} size={[1.15, 1.62]} base="#eee6dc" accent="#7e91a5" rotation={[0, 0, 0.025]} />
      <AbstractCard position={[0.72, 0.18, 0.44]} size={[1.12, 1.48]} base="#f5f0e7" accent="#b45b57" rotation={[0, 0, -0.015]} />

      <Box position={[0.62, -0.8, 0.53]} scale={[2.35, 0.95, 0.72]} color="#efe8dd" radius={0.12} />
      <Box position={[-0.53, -0.55, 0.64]} scale={[0.12, 0.72, 0.78]} color="#d9d1c7" radius={0.04} />
      <Box position={[0.35, -0.55, 0.64]} scale={[0.12, 0.72, 0.78]} color="#d9d1c7" radius={0.04} />
      {[0.18, 0.37, 0.56, 0.75, 0.94].map((x, i) => (
        <Book
          key={x}
          position={[x, -0.12 + i * 0.015, 0.72]}
          size={[0.12, 1.28 - i * 0.07, 0.42]}
          color={i % 2 ? "#eee7de" : "#fbf7f1"}
        />
      ))}
    </InteractiveZone>
  );
}

function MonitorProp({ onSelect }: { onSelect: StudioSceneProps["onSelect"] }) {
  return (
    <InteractiveZone
      id="video"
      position={[4.0, -1.6, 0.14]}
      size={[3.15, 2.6]}
      glow={COLORS.videoGlow}
      hotspot={[0.7, 0.08, 0.72]}
      onSelect={onSelect}
    >
      <Box position={[0, 0, 0]} scale={[3.15, 2.6, 0.58]} color={COLORS.blueDeep} radius={0.18} />
      <Box position={[0, 0.12, 0.38]} scale={[2.25, 1.72, 0.5]} color="#e8e0d6" radius={0.2} />
      <Box position={[0, 0.17, 0.66]} scale={[1.82, 1.25, 0.08]} color="#22262e" radius={0.12} />
      <group position={[0, 0.17, 0.72]}>
        <DreiImage url="/assets/projects/red-leaf/gameplay-scene-hires.png" scale={[1.66, 1.08]} />
        <mesh position={[0, 0, 0.04]}>
          <ringGeometry args={[0.12, 0.18, 32]} />
          <meshBasicMaterial color={COLORS.videoGlow} transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <mesh position={[0.02, 0, 0.05]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.16, 3]} />
          <meshBasicMaterial color="#fffdf8" />
        </mesh>
      </group>
      <Box position={[0, -0.78, 0.62]} scale={[0.9, 0.16, 0.14]} color="#c7c2bb" radius={0.04} />
      <mesh position={[0.72, -0.76, 0.69]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 20]} />
        <meshStandardMaterial color="#8f8b84" />
      </mesh>
      <TinyPlant position={[-1.22, -0.66, 0.65]} scale={0.58} />
      <group position={[1.68, 0.1, 0.32]} rotation={[0, 0, -0.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.43, 0.06, 16, 36, Math.PI]} />
          <meshStandardMaterial color="#f4efe7" roughness={0.5} />
        </mesh>
        <mesh position={[-0.35, -0.08, 0]}><cylinderGeometry args={[0.15, 0.15, 0.24, 20]} />{material("#e8e2da")}</mesh>
        <mesh position={[0.35, -0.08, 0]}><cylinderGeometry args={[0.15, 0.15, 0.24, 20]} />{material("#e8e2da")}</mesh>
      </group>
    </InteractiveZone>
  );
}

function DeskAndForeground() {
  return (
    <group>
      <Box position={[0, -3.15, -0.45]} scale={[10.5, 0.42, 2.25]} color="#edf0f2" radius={0.18} />
      <Box position={[3.3, -4.0, -0.38]} scale={[2.8, 1.28, 1.7]} color={COLORS.blueDeep} radius={0.14} />
      <mesh position={[4.16, -3.95, 0.5]}>
        <sphereGeometry args={[0.1, 20, 14]} />
        <meshStandardMaterial color={COLORS.red} roughness={0.5} />
      </mesh>

      <group position={[0, -2.98, 0.65]}>
        <Box position={[0, 0, 0]} scale={[2.7, 0.12, 1.45]} color="#c9ccd1" radius={0.05} />
        <Box position={[0, 0.08, 0]} scale={[2.4, 0.08, 1.18]} color="#e6e7e9" radius={0.04} />
        <mesh position={[0, 0.15, 0.57]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 20]} />
          <meshStandardMaterial color="#6d7076" />
        </mesh>
      </group>

      <Box position={[2.3, -3.0, 0.72]} scale={[1.4, 0.05, 0.86]} color="#aebbc7" radius={0.05} />
      <mesh position={[2.0, -2.91, 0.86]}>
        <sphereGeometry args={[0.1, 20, 12]} />
        <meshStandardMaterial color="#f7f7f5" roughness={0.5} />
      </mesh>

      <group position={[-0.25, -4.6, 1.05]}>
        <Box position={[0, 0.55, 0]} scale={[3.55, 1.15, 0.35]} color="#eee9e1" radius={0.18} />
        <Box position={[0, -0.48, 0.45]} scale={[3.8, 0.35, 1.5]} color="#e8e4de" radius={0.14} />
        <mesh position={[-1.55, -0.45, 0.25]} rotation={[0, 0, 0.06]}>
          <cylinderGeometry args={[0.035, 0.035, 1.55, 12]} />
          <meshStandardMaterial color="#9b9da3" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[1.55, -0.45, 0.25]} rotation={[0, 0, -0.06]}>
          <cylinderGeometry args={[0.035, 0.035, 1.55, 12]} />
          <meshStandardMaterial color="#9b9da3" metalness={0.7} roughness={0.25} />
        </mesh>
      </group>

      <Book position={[-4.6, -2.78, 0.78]} size={[1.55, 0.16, 0.78]} />
      <Book position={[-4.56, -2.97, 0.79]} size={[1.72, 0.16, 0.8]} color="#e7e3dc" />
      <Book position={[-4.62, -3.16, 0.79]} size={[1.88, 0.16, 0.82]} color="#dad7d2" />
    </group>
  );
}

function Lamp() {
  return (
    <group position={[-0.4, 3.45, 0.55]}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 14]} />
        <meshStandardMaterial color="#51545a" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <coneGeometry args={[0.34, 0.34, 32, 1, true]} />
        <meshStandardMaterial color="#55575b" side={THREE.DoubleSide} metalness={0.45} roughness={0.3} />
      </mesh>
      <pointLight position={[0, -0.28, 0.12]} color="#ffd9a3" intensity={2.6} distance={5.5} />
    </group>
  );
}

function CameraRig() {
  useFrame(({ camera, pointer }, delta) => {
    const targetX = pointer.x * 0.18;
    const targetY = 0.58 + pointer.y * 0.08;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 13.6, 3.2, delta);
    camera.lookAt(0, -0.4, 0);
  });
  return null;
}

export function StudioScene({ onSelect }: StudioSceneProps) {
  return (
    <>
      <color attach="background" args={["#f6f8fb"]} />
      <fog attach="fog" args={["#f6f8fb", 16, 25]} />
      <ambientLight intensity={1.55} />
      <hemisphereLight intensity={1.15} color="#f9fbff" groundColor="#dfe6eb" />
      <directionalLight
        position={[5, 8, 9]}
        intensity={2.1}
        color="#fff6e9"
        castShadow
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
      />
      <pointLight position={[-5, 2, 6]} intensity={0.9} color="#f4c4a4" distance={10} />
      <pointLight position={[5, 1.5, 6]} intensity={0.85} color="#d5e5ff" distance={10} />

      <CameraRig />

      <group position={[0, -0.12, 0]} scale={0.94}>
        <LeftShelf onSelect={onSelect} />
        <PhotoBoard onSelect={onSelect} />
        <VisualOrganizer onSelect={onSelect} />
        <MonitorProp onSelect={onSelect} />
        <DeskAndForeground />
        <Lamp />
      </group>

      <ContactShadows position={[0, -5.02, 0]} opacity={0.23} scale={17} blur={2.7} far={7} />
    </>
  );
}
