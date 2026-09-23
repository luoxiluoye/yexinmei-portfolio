"use client";

import {
  ContactShadows,
  Image as DreiImage,
  RoundedBox,
  useCursor,
} from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";

export type PortfolioZoneId = "writing" | "photography" | "aigc" | "video";

type StudioSceneProps = {
  onSelect: (zone: PortfolioZoneId) => void;
};

const C = {
  wall: "#f3f4f4",
  wallWarm: "#f7f4ef",
  blue: "#c8d8e6",
  blue2: "#b9cfdf",
  cream: "#f2ede5",
  cream2: "#e9e1d7",
  paper: "#fbf8f1",
  paper2: "#e8e2da",
  white: "#fffefa",
  ink: "#34383e",
  charcoal: "#484b50",
  silver: "#c8c9ca",
  silver2: "#9ba0a5",
  red: "#a94e49",
  green: "#6f8c62",
  green2: "#819a70",
  wood: "#d7c9b9",
  writingGlow: "#f2a27e",
  photoGlow: "#8db9ef",
  visualGlow: "#f1c375",
  videoGlow: "#ec8d8e",
};

function Mat({
  color,
  roughness = 0.58,
  metalness = 0.02,
  clearcoat = 0.08,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      clearcoat={clearcoat}
      clearcoatRoughness={0.45}
    />
  );
}

function Box({
  position,
  scale,
  color,
  radius = 0.08,
  rotation = [0, 0, 0],
  roughness,
  metalness,
  clearcoat,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  radius?: number;
  rotation?: [number, number, number];
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
}) {
  return (
    <RoundedBox
      args={scale}
      radius={radius}
      smoothness={6}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <Mat
        color={color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={clearcoat}
      />
    </RoundedBox>
  );
}

function GlowFrame({
  width,
  height,
  color,
  hovered,
  z = 0.58,
}: {
  width: number;
  height: number;
  color: string;
  hovered: boolean;
  z?: number;
}) {
  const edgeOpacity = hovered ? 0.92 : 0.14;
  const haloOpacity = hovered ? 0.18 : 0.018;
  const edge = hovered ? 0.055 : 0.036;
  const halo = 0.12;

  const glowMaterial = (opacity: number) => (
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
      <mesh position={[0, height / 2, z]}>
        <boxGeometry args={[width, edge, edge]} />
        {glowMaterial(edgeOpacity)}
      </mesh>
      <mesh position={[0, -height / 2, z]}>
        <boxGeometry args={[width, edge, edge]} />
        {glowMaterial(edgeOpacity)}
      </mesh>
      <mesh position={[-width / 2, 0, z]}>
        <boxGeometry args={[edge, height, edge]} />
        {glowMaterial(edgeOpacity)}
      </mesh>
      <mesh position={[width / 2, 0, z]}>
        <boxGeometry args={[edge, height, edge]} />
        {glowMaterial(edgeOpacity)}
      </mesh>

      {hovered ? (
        <>
          <mesh position={[0, height / 2, z - 0.02]}>
            <boxGeometry args={[width + 0.08, halo, halo]} />
            {glowMaterial(haloOpacity)}
          </mesh>
          <mesh position={[0, -height / 2, z - 0.02]}>
            <boxGeometry args={[width + 0.08, halo, halo]} />
            {glowMaterial(haloOpacity)}
          </mesh>
          <mesh position={[-width / 2, 0, z - 0.02]}>
            <boxGeometry args={[halo, height + 0.08, halo]} />
            {glowMaterial(haloOpacity)}
          </mesh>
          <mesh position={[width / 2, 0, z - 0.02]}>
            <boxGeometry args={[halo, height + 0.08, halo]} />
            {glowMaterial(haloOpacity)}
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function CornerDot({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.075, 24, 16]} />
        <meshStandardMaterial color={C.red} roughness={0.38} />
      </mesh>
      <pointLight color="#ffb18c" intensity={0.15} distance={0.8} />
    </group>
  );
}

function InteractiveZone({
  id,
  position,
  size,
  glow,
  onSelect,
  children,
}: {
  id: PortfolioZoneId;
  position: [number, number, number];
  size: [number, number];
  glow: string;
  onSelect: (zone: PortfolioZoneId) => void;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = hovered ? 1.012 : 1;
    const s = THREE.MathUtils.damp(
      group.current.scale.x,
      targetScale,
      10,
      delta
    );
    group.current.scale.setScalar(s);
  });

  function onPointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(true);
  }

  function onPointerOut(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(false);
  }

  function onClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(id);
  }

  return (
    <group ref={group} position={position}>
      {children}
      <GlowFrame
        width={size[0]}
        height={size[1]}
        color={glow}
        hovered={hovered}
      />
      <mesh
        position={[0, 0, 0.75]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <boxGeometry args={[size[0], size[1], 0.34]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Book({
  position,
  size,
  color = C.paper,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <Box
      position={position}
      scale={size}
      color={color}
      radius={0.025}
      rotation={rotation}
      roughness={0.72}
      clearcoat={0.02}
    />
  );
}

function Leaf({
  position,
  rotation = 0,
  scale = 1,
  color = C.green,
}: {
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  color?: string;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, 0, rotation]}
      scale={[1.15 * scale, 0.78 * scale, 0.45 * scale]}
      castShadow
    >
      <sphereGeometry args={[0.16, 20, 14]} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}

function PottedPlant({
  position,
  scale = 1,
  hanging = false,
}: {
  position: [number, number, number];
  scale?: number;
  hanging?: boolean;
}) {
  const leaves = useMemo(
    () =>
      [
        [-0.24, 0.34, 0.03, -0.65, 0.95],
        [0.2, 0.42, 0.02, 0.55, 1],
        [-0.05, 0.57, 0.04, -0.1, 1.05],
        [0.28, 0.68, 0.02, 0.72, 0.86],
        [-0.32, 0.72, 0.03, -0.82, 0.9],
        [0.04, 0.9, 0.02, 0.12, 1],
      ] as const,
    []
  );

  const vines = hanging
    ? [
        [-0.28, 0.05, 0.02, -0.2, 0.8],
        [-0.34, -0.22, 0.03, 0.35, 0.72],
        [-0.4, -0.46, 0.02, -0.35, 0.7],
        [-0.43, -0.7, 0.01, 0.2, 0.64],
      ] as const
    : [];

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.38, 28]} />
        <meshStandardMaterial color="#f5f1e9" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.018, 0.027, 0.95, 10]} />
        <meshStandardMaterial color="#657956" roughness={0.8} />
      </mesh>
      {leaves.map(([x, y, z, r, s], index) => (
        <Leaf
          key={index}
          position={[x, y, z]}
          rotation={r}
          scale={s}
          color={index % 2 ? C.green : C.green2}
        />
      ))}
      {vines.map(([x, y, z, r, s], index) => (
        <group key={index}>
          <mesh position={[x + 0.12, y + 0.2, z]}>
            <cylinderGeometry args={[0.009, 0.012, 0.34, 8]} />
            <meshStandardMaterial color="#667a58" roughness={0.86} />
          </mesh>
          <Leaf
            position={[x, y, z]}
            rotation={r}
            scale={s}
            color={index % 2 ? C.green2 : C.green}
          />
        </group>
      ))}
    </group>
  );
}

function Bear({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <sphereGeometry args={[0.21, 24, 18]} />
        <meshStandardMaterial color="#faf7f1" roughness={0.72} />
      </mesh>
      <mesh position={[0, -0.02, 0]} castShadow>
        <sphereGeometry args={[0.25, 24, 18]} />
        <meshStandardMaterial color="#f6f2ea" roughness={0.72} />
      </mesh>
      <mesh position={[-0.15, 0.5, 0]}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshStandardMaterial color="#faf7f1" />
      </mesh>
      <mesh position={[0.15, 0.5, 0]}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshStandardMaterial color="#faf7f1" />
      </mesh>
      <mesh position={[-0.065, 0.36, 0.19]}>
        <sphereGeometry args={[0.015, 12, 8]} />
        <meshStandardMaterial color="#2c2d31" />
      </mesh>
      <mesh position={[0.065, 0.36, 0.19]}>
        <sphereGeometry args={[0.015, 12, 8]} />
        <meshStandardMaterial color="#2c2d31" />
      </mesh>
    </group>
  );
}

function MoonOrb({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.26, 28, 20]} />
        <meshPhysicalMaterial
          color="#fff0c9"
          emissive="#ffdba2"
          emissiveIntensity={0.45}
          roughness={0.6}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight color="#ffd99f" intensity={0.8} distance={2.2} />
      <Box
        position={[0, -0.31, 0]}
        scale={[0.5, 0.12, 0.42]}
        color="#ded8cf"
        radius={0.04}
      />
    </group>
  );
}

function ShelfFrame({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  const border = 0.16;
  return (
    <group>
      <Box
        position={[0, 0, -depth / 2 + 0.05]}
        scale={[width, height, 0.12]}
        color="#e6e6e3"
        radius={0.16}
        roughness={0.78}
      />
      <Box
        position={[-width / 2 + border / 2, 0, 0]}
        scale={[border, height, depth]}
        color={C.cream}
        radius={0.08}
      />
      <Box
        position={[width / 2 - border / 2, 0, 0]}
        scale={[border, height, depth]}
        color={C.cream}
        radius={0.08}
      />
      <Box
        position={[0, height / 2 - border / 2, 0]}
        scale={[width, border, depth]}
        color={C.cream}
        radius={0.08}
      />
      <Box
        position={[0, -height / 2 + border / 2, 0]}
        scale={[width, border, depth]}
        color={C.cream}
        radius={0.08}
      />
    </group>
  );
}

function WritingShelf({
  onSelect,
}: {
  onSelect: StudioSceneProps["onSelect"];
}) {
  return (
    <InteractiveZone
      id="writing"
      position={[-4.42, 0.62, 0]}
      size={[3.18, 4.78]}
      glow={C.writingGlow}
      onSelect={onSelect}
    >
      <ShelfFrame width={3.18} height={4.78} depth={0.52} />
      <Box
        position={[0, 0, -0.1]}
        scale={[3.0, 4.62, 0.26]}
        color="#dfe3e4"
        radius={0.12}
        roughness={0.84}
      />

      {[1.1, -0.45, -1.58].map((y) => (
        <Box
          key={y}
          position={[0, y, 0.34]}
          scale={[2.78, 0.12, 0.64]}
          color="#f4f0e8"
          radius={0.04}
        />
      ))}

      <PottedPlant
        position={[-0.92, 1.36, 0.62]}
        scale={0.9}
        hanging
      />
      <Book position={[0.32, 1.42, 0.66]} size={[0.2, 0.98, 0.42]} />
      <Book
        position={[0.55, 1.42, 0.66]}
        size={[0.22, 1.08, 0.42]}
        color="#ddd7d0"
      />
      <Book
        position={[0.8, 1.39, 0.66]}
        size={[0.22, 1.02, 0.42]}
        color="#ece7df"
      />
      <Book
        position={[1.03, 1.37, 0.66]}
        size={[0.18, 0.94, 0.42]}
        color="#d6d1ca"
      />
      <Bear position={[1.02, 0.76, 0.63]} scale={0.9} />

      <Book
        position={[-0.94, -0.05, 0.66]}
        size={[0.2, 0.96, 0.42]}
        color="#e4ded6"
      />
      <Book
        position={[-0.7, -0.05, 0.66]}
        size={[0.22, 1.08, 0.42]}
        color="#d6d1cb"
      />
      <Book
        position={[-0.44, -0.07, 0.66]}
        size={[0.2, 1.0, 0.42]}
      />
      <Book
        position={[-0.18, -0.1, 0.66]}
        size={[0.2, 0.94, 0.42]}
        color="#ece6dd"
      />
      <Book
        position={[0.12, -0.17, 0.67]}
        size={[0.68, 0.88, 0.4]}
        color="#f3eee6"
      />
      <MoonOrb position={[0.92, -0.15, 0.7]} />

      <Box
        position={[-0.82, -1.98, 0.68]}
        scale={[1.02, 0.52, 0.52]}
        color="#e9e4dc"
        radius={0.08}
      />
      <Box
        position={[-0.82, -1.94, 0.96]}
        scale={[0.54, 0.04, 0.03]}
        color="#4f5054"
        radius={0.01}
      />
      <Book
        position={[0.42, -1.85, 0.7]}
        size={[1.05, 0.14, 0.48]}
        color="#f6f1e9"
      />
      <Book
        position={[0.5, -2.02, 0.7]}
        size={[1.28, 0.14, 0.5]}
        color="#e3ddd4"
      />
      <PottedPlant position={[1.12, -1.9, 0.64]} scale={0.62} />

      <CornerDot position={[-1.38, 2.05, 0.68]} />
    </InteractiveZone>
  );
}

const PHOTO_ASSETS = [
  "/assets/photos/portrait/portrait-01.jpeg",
  "/assets/photos/yu-chaoying-concert/concert-03.jpeg",
  "/assets/photos/happy-mahua/still-02.jpeg",
  "/assets/photos/portrait/portrait-06.jpeg",
  "/assets/photos/ziroom-campaign/campaign-02.jpeg",
  "/assets/photos/meituan-product/product-02.jpeg",
];

function Polaroid({
  url,
  position,
  width,
  height,
  rotation,
}: {
  url: string;
  position: [number, number, number];
  width: number;
  height: number;
  rotation: number;
}) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <Box
        position={[0, 0, -0.03]}
        scale={[width + 0.12, height + 0.16, 0.05]}
        color="#fffdfa"
        radius={0.02}
        roughness={0.7}
      />
      <DreiImage url={url} scale={[width, height]} />
    </group>
  );
}

function CameraProp({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <Box
        position={[0, 0, 0]}
        scale={[1.02, 0.6, 0.44]}
        color="#4a4b4e"
        radius={0.07}
        roughness={0.42}
        metalness={0.18}
      />
      <Box
        position={[-0.2, 0.2, 0.04]}
        scale={[0.44, 0.14, 0.44]}
        color="#c7c5c0"
        radius={0.04}
        metalness={0.32}
        roughness={0.36}
      />
      <mesh position={[0.2, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.34, 0.36, 32]} />
        <meshPhysicalMaterial
          color="#16171a"
          roughness={0.26}
          metalness={0.34}
          clearcoat={0.2}
        />
      </mesh>
      <mesh position={[0.2, 0, 0.51]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 0.08, 32]} />
        <meshPhysicalMaterial
          color="#0e0f12"
          roughness={0.18}
          metalness={0.2}
          clearcoat={0.45}
        />
      </mesh>
      <mesh position={[0.36, 0.17, 0.43]}>
        <sphereGeometry args={[0.035, 18, 12]} />
        <meshStandardMaterial color={C.red} roughness={0.4} />
      </mesh>
    </group>
  );
}

function PegBoard({
  onSelect,
}: {
  onSelect: StudioSceneProps["onSelect"];
}) {
  const pegs = useMemo(() => {
    const items: [number, number, number][] = [];
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        items.push([-1.72 + col * 0.38, 1.95 - row * 0.52, 0.27]);
      }
    }
    return items;
  }, []);

  return (
    <InteractiveZone
      id="photography"
      position={[-0.35, 0.63, 0.02]}
      size={[4.12, 4.8]}
      glow={C.photoGlow}
      onSelect={onSelect}
    >
      <ShelfFrame width={4.12} height={4.8} depth={0.46} />
      <Box
        position={[0, 0, -0.08]}
        scale={[3.94, 4.62, 0.25]}
        color="#e5e3de"
        radius={0.11}
        roughness={0.88}
      />

      {pegs.map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]}>
          <circleGeometry args={[0.025, 10]} />
          <meshStandardMaterial color="#b5b1aa" roughness={0.95} />
        </mesh>
      ))}

      <Polaroid
        url={PHOTO_ASSETS[0]}
        position={[-1.1, 1.25, 0.52]}
        width={0.88}
        height={0.76}
        rotation={-0.04}
      />
      <Polaroid
        url={PHOTO_ASSETS[1]}
        position={[0.02, 1.42, 0.54]}
        width={1.08}
        height={0.82}
        rotation={0.015}
      />
      <Polaroid
        url={PHOTO_ASSETS[2]}
        position={[1.16, 1.18, 0.52]}
        width={0.94}
        height={0.8}
        rotation={0.045}
      />
      <Polaroid
        url={PHOTO_ASSETS[3]}
        position={[-0.92, 0.15, 0.55]}
        width={0.9}
        height={0.92}
        rotation={0.07}
      />
      <Polaroid
        url={PHOTO_ASSETS[4]}
        position={[0.18, 0.22, 0.55]}
        width={1.02}
        height={0.76}
        rotation={-0.025}
      />
      <Polaroid
        url={PHOTO_ASSETS[5]}
        position={[1.14, 0.05, 0.54]}
        width={0.82}
        height={0.96}
        rotation={-0.055}
      />

      {[
        [-1.05, 1.72],
        [0.02, 1.88],
        [1.1, 1.62],
        [-0.9, 0.68],
        [0.18, 0.66],
        [1.16, 0.57],
      ].map(([x, y], index) => (
        <mesh key={index} position={[x, y, 0.64]} castShadow>
          <sphereGeometry args={[0.055, 18, 12]} />
          <meshStandardMaterial
            color={index % 2 ? "#ece6dd" : C.red}
            roughness={0.52}
          />
        </mesh>
      ))}

      <PottedPlant position={[-1.55, -1.75, 0.58]} scale={0.58} />
      <CameraProp position={[-0.02, -1.72, 0.64]} />

      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[0.82 + index * 0.25, -1.75, 0.64]}>
          <cylinderGeometry args={[0.075, 0.075, 0.46, 18]} />
          <meshStandardMaterial
            color={index === 2 ? "#d9a257" : index % 2 ? "#77736d" : "#24262a"}
            roughness={0.44}
          />
        </mesh>
      ))}

      <mesh position={[1.48, -1.65, 0.63]}>
        <cylinderGeometry args={[0.18, 0.16, 0.58, 22]} />
        <meshStandardMaterial color="#f4efe7" roughness={0.76} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[1.38 + index * 0.1, -1.33 + index * 0.03, 0.67]}
          rotation={[0, 0, 0.12 + index * 0.08]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.68, 8]} />
          <meshStandardMaterial color={index === 0 ? C.red : C.ink} />
        </mesh>
      ))}

      <CornerDot position={[-1.8, 2.08, 0.65]} />
    </InteractiveZone>
  );
}

function AbstractCard({
  position,
  size,
  base,
  accent,
  rotation = 0,
  accent2 = "#8fa5b8",
}: {
  position: [number, number, number];
  size: [number, number];
  base: string;
  accent: string;
  rotation?: number;
  accent2?: string;
}) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <Box
        position={[0, 0, 0]}
        scale={[size[0], size[1], 0.06]}
        color={base}
        radius={0.03}
        roughness={0.76}
      />
      <mesh position={[size[0] * 0.18, size[1] * 0.17, 0.05]}>
        <circleGeometry args={[Math.min(size[0], size[1]) * 0.2, 36]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>
      <mesh position={[-size[0] * 0.12, -size[1] * 0.1, 0.052]}>
        <circleGeometry args={[Math.min(size[0], size[1]) * 0.14, 36]} />
        <meshStandardMaterial color={accent2} roughness={0.72} />
      </mesh>
    </group>
  );
}

function OrganizerRack({
  onSelect,
}: {
  onSelect: StudioSceneProps["onSelect"];
}) {
  return (
    <InteractiveZone
      id="aigc"
      position={[3.83, 1.63, 0.05]}
      size={[3.16, 2.58]}
      glow={C.visualGlow}
      onSelect={onSelect}
    >
      <ShelfFrame width={3.16} height={2.58} depth={0.52} />
      <Box
        position={[0, 0, -0.08]}
        scale={[3.0, 2.42, 0.26]}
        color={C.blue}
        radius={0.11}
      />

      <AbstractCard
        position={[-0.5, 0.2, 0.34]}
        size={[1.08, 1.55]}
        base="#f2ece5"
        accent="#c27569"
        rotation={-0.025}
      />
      <AbstractCard
        position={[0.26, 0.32, 0.38]}
        size={[1.16, 1.68]}
        base="#f6f1e9"
        accent="#dd8f69"
        accent2="#7a91a7"
        rotation={0.02}
      />
      <AbstractCard
        position={[0.83, 0.02, 0.42]}
        size={[0.92, 1.36]}
        base="#e7edf1"
        accent="#829ab0"
        rotation={0.035}
      />

      <Box
        position={[0.35, -0.72, 0.56]}
        scale={[2.24, 0.72, 0.76]}
        color="#ebe5dc"
        radius={0.12}
      />
      <Box
        position={[-0.72, -0.57, 0.62]}
        scale={[0.12, 0.46, 0.82]}
        color="#d6d0c8"
        radius={0.03}
      />
      {[0.05, 0.25, 0.45, 0.65, 0.85].map((x, index) => (
        <Book
          key={x}
          position={[x, -0.3 + index * 0.015, 0.7]}
          size={[0.11, 0.85 - index * 0.035, 0.38]}
          color={index % 2 ? "#ece6de" : "#faf6f0"}
        />
      ))}

      <CornerDot position={[-1.36, 1.06, 0.67]} />
    </InteractiveZone>
  );
}

function Monitor({
  onSelect,
}: {
  onSelect: StudioSceneProps["onSelect"];
}) {
  const speakerDots = useMemo(() => {
    const dots: [number, number][] = [];
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        dots.push([1.08 + col * 0.08, -0.18 - row * 0.08]);
      }
    }
    return dots;
  }, []);

  return (
    <InteractiveZone
      id="video"
      position={[3.83, -1.1, 0.08]}
      size={[3.16, 2.32]}
      glow={C.videoGlow}
      onSelect={onSelect}
    >
      <ShelfFrame width={3.16} height={2.32} depth={0.5} />
      <Box
        position={[0, 0, -0.08]}
        scale={[3.0, 2.16, 0.26]}
        color={C.blue2}
        radius={0.11}
      />

      <Box
        position={[-0.08, 0.08, 0.38]}
        scale={[2.28, 1.58, 0.54]}
        color="#e9e2d8"
        radius={0.18}
      />
      <Box
        position={[-0.29, 0.16, 0.69]}
        scale={[1.6, 1.05, 0.08]}
        color="#1d2229"
        radius={0.1}
      />
      <group position={[-0.29, 0.16, 0.745]}>
        <DreiImage
          url="/assets/projects/red-leaf/gameplay-scene-hires.png"
          scale={[1.48, 0.93]}
        />
        <mesh position={[0, 0, 0.04]}>
          <ringGeometry args={[0.11, 0.17, 32]} />
          <meshBasicMaterial
            color="#fffefa"
            transparent
            opacity={0.95}
            toneMapped={false}
          />
        </mesh>
        <mesh
          position={[0.025, 0, 0.05]}
          rotation={[0, 0, -Math.PI / 2]}
        >
          <coneGeometry args={[0.065, 0.14, 3]} />
          <meshBasicMaterial color="#fffefa" />
        </mesh>
      </group>

      <mesh position={[0.8, 0.55, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
        <meshStandardMaterial color="#8e8b84" roughness={0.38} />
      </mesh>
      <mesh position={[0.8, 0.27, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
        <meshStandardMaterial color="#8e8b84" roughness={0.38} />
      </mesh>

      {speakerDots.map(([x, y], index) => (
        <mesh key={index} position={[x, y, 0.7]}>
          <circleGeometry args={[0.018, 10]} />
          <meshStandardMaterial color="#9b978f" roughness={0.8} />
        </mesh>
      ))}

      <PottedPlant position={[-1.12, -0.8, 0.62]} scale={0.48} />
      <CornerDot position={[-1.36, 0.96, 0.67]} />
    </InteractiveZone>
  );
}

function DeskLamp() {
  return (
    <group position={[-5.44, -2.4, 0.9]}>
      <Box
        position={[0, 0, 0]}
        scale={[0.72, 0.14, 0.64]}
        color="#ece5db"
        radius={0.06}
        metalness={0.1}
      />
      <mesh
        position={[0.02, 0.78, 0.04]}
        rotation={[0, 0, -0.58]}
        castShadow
      >
        <cylinderGeometry args={[0.045, 0.045, 1.55, 14]} />
        <meshPhysicalMaterial
          color="#c5c3bf"
          metalness={0.56}
          roughness={0.28}
        />
      </mesh>
      <mesh
        position={[0.56, 1.34, 0.05]}
        rotation={[0, 0, -0.1]}
        castShadow
      >
        <coneGeometry args={[0.42, 0.32, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e6ddd0"
          side={THREE.DoubleSide}
          metalness={0.15}
          roughness={0.42}
        />
      </mesh>
      <pointLight
        position={[0.56, 1.16, 0.2]}
        color="#ffd9a1"
        intensity={1.5}
        distance={3.2}
      />
    </group>
  );
}

function PendantLamp() {
  return (
    <group position={[-0.3, 3.76, 0.86]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.6, 14]} />
        <meshPhysicalMaterial
          color="#63676a"
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <coneGeometry args={[0.48, 0.36, 36, 1, true]} />
        <meshPhysicalMaterial
          color="#7b8084"
          side={THREE.DoubleSide}
          metalness={0.42}
          roughness={0.34}
        />
      </mesh>
      <mesh position={[0, -0.18, 0.02]}>
        <sphereGeometry args={[0.13, 24, 16]} />
        <meshStandardMaterial
          color="#ffe0a9"
          emissive="#ffd295"
          emissiveIntensity={1.2}
        />
      </mesh>
      <spotLight
        position={[0, -0.1, 0.3]}
        angle={0.8}
        penumbra={0.65}
        intensity={3.2}
        distance={7}
        color="#ffe3b8"
        castShadow
      />
    </group>
  );
}

function Mug() {
  return (
    <group position={[4.55, -2.74, 0.72]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.48, 28]} />
        <meshStandardMaterial color="#f4eee5" roughness={0.72} />
      </mesh>
      <mesh
        position={[0.26, 0.04, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <torusGeometry args={[0.16, 0.04, 16, 32]} />
        <meshStandardMaterial color="#f4eee5" roughness={0.72} />
      </mesh>
      <mesh position={[0.02, 0.05, 0.23]}>
        <sphereGeometry args={[0.045, 18, 12]} />
        <meshStandardMaterial color={C.red} />
      </mesh>
    </group>
  );
}

function PhoneStand() {
  return (
    <group position={[3.35, -2.72, 0.72]}>
      <Box
        position={[0, -0.1, 0]}
        scale={[0.78, 0.12, 0.54]}
        color="#ded8d0"
        radius={0.06}
      />
      <Box
        position={[0, 0.35, 0.08]}
        scale={[0.48, 0.9, 0.12]}
        color="#1f2228"
        radius={0.08}
        rotation={[-0.12, 0, 0]}
        roughness={0.3}
        clearcoat={0.28}
      />
    </group>
  );
}

function DeskAndForeground() {
  return (
    <group>
      <Box
        position={[0, -3.08, -0.12]}
        scale={[11.6, 0.42, 2.05]}
        color="#eeeae4"
        radius={0.18}
        roughness={0.5}
        clearcoat={0.14}
      />
      <Box
        position={[0, -3.32, -0.35]}
        scale={[11.2, 0.24, 1.92]}
        color="#d7e0e6"
        radius={0.12}
        roughness={0.62}
      />

      <Box
        position={[4.35, -4.06, -0.38]}
        scale={[2.5, 1.42, 1.68]}
        color={C.blue2}
        radius={0.16}
        roughness={0.5}
        clearcoat={0.15}
      />
      <Box
        position={[4.35, -3.7, 0.48]}
        scale={[2.18, 0.07, 0.06]}
        color="#9eabb4"
        radius={0.03}
      />
      <mesh position={[4.35, -3.72, 0.56]} castShadow>
        <sphereGeometry args={[0.11, 22, 16]} />
        <meshStandardMaterial color={C.red} roughness={0.38} />
      </mesh>

      <DeskLamp />

      <Book
        position={[-4.34, -2.82, 0.7]}
        size={[1.7, 0.15, 0.76]}
        color="#f3eee6"
      />
      <Book
        position={[-4.28, -3.0, 0.7]}
        size={[1.95, 0.15, 0.78]}
        color="#ddd8d1"
      />
      <mesh position={[-3.05, -2.78, 0.72]}>
        <cylinderGeometry args={[0.16, 0.14, 0.58, 24]} />
        <meshStandardMaterial color="#eee8df" roughness={0.78} />
      </mesh>
      {[-0.08, 0.04, 0.16].map((x, i) => (
        <mesh
          key={x}
          position={[-3.05 + x, -2.48 + i * 0.02, 0.73]}
          rotation={[0, 0, -0.04 + i * 0.1]}
        >
          <cylinderGeometry args={[0.011, 0.011, 0.62, 8]} />
          <meshStandardMaterial color={i === 0 ? C.ink : C.red} />
        </mesh>
      ))}

      <Box
        position={[0.25, -2.88, 0.72]}
        scale={[4.15, 0.05, 1.15]}
        color="#b6c3ce"
        radius={0.06}
        roughness={0.9}
        clearcoat={0}
      />
      <Box
        position={[-0.12, -2.75, 0.84]}
        scale={[2.9, 0.16, 1.2]}
        color="#c9c9c7"
        radius={0.06}
        roughness={0.38}
        metalness={0.24}
        clearcoat={0.18}
      />
      <Box
        position={[-0.12, -2.65, 0.85]}
        scale={[2.64, 0.07, 1.0]}
        color="#e5e4e2"
        radius={0.04}
        roughness={0.36}
        metalness={0.1}
      />

      <mesh position={[1.65, -2.78, 0.82]} castShadow>
        <sphereGeometry args={[0.13, 24, 16]} />
        <meshStandardMaterial color="#f5f5f1" roughness={0.48} />
      </mesh>

      <PhoneStand />
      <Mug />

      <Box
        position={[5.15, -2.76, 0.72]}
        scale={[0.92, 0.12, 0.68]}
        color="#eae4dc"
        radius={0.05}
      />
      <Box
        position={[5.15, -2.68, 0.78]}
        scale={[0.62, 0.06, 0.42]}
        color="#f9f6f0"
        radius={0.03}
      />

      <group position={[-0.2, -4.62, 1.05]}>
        <Box
          position={[0, 0.64, 0]}
          scale={[3.25, 1.16, 0.34]}
          color="#e9e5de"
          radius={0.18}
          roughness={0.62}
        />
        <Box
          position={[0, -0.42, 0.42]}
          scale={[3.52, 0.32, 1.28]}
          color="#e2ddd5"
          radius={0.14}
          roughness={0.64}
        />
        <mesh
          position={[-1.38, -0.4, 0.2]}
          rotation={[0, 0, 0.05]}
        >
          <cylinderGeometry args={[0.035, 0.035, 1.52, 12]} />
          <meshPhysicalMaterial
            color="#9fa2a5"
            metalness={0.7}
            roughness={0.22}
          />
        </mesh>
        <mesh
          position={[1.38, -0.4, 0.2]}
          rotation={[0, 0, -0.05]}
        >
          <cylinderGeometry args={[0.035, 0.035, 1.52, 12]} />
          <meshPhysicalMaterial
            color="#9fa2a5"
            metalness={0.7}
            roughness={0.22}
          />
        </mesh>
      </group>
    </group>
  );
}

function WorkspaceBackbone() {
  return (
    <group>
      <Box
        position={[0, 0.1, -1.45]}
        scale={[13.4, 8.1, 0.22]}
        color={C.wall}
        radius={0.22}
        roughness={0.94}
        clearcoat={0}
      />
      <Box
        position={[0, -1.93, -0.72]}
        scale={[10.6, 0.18, 0.7]}
        color="#dce2e5"
        radius={0.07}
        roughness={0.62}
      />
      <Box
        position={[0, -2.07, -0.38]}
        scale={[10.9, 0.12, 0.65]}
        color="#f1ede7"
        radius={0.05}
        roughness={0.62}
      />
    </group>
  );
}

function CameraRig() {
  useFrame(({ camera, pointer }, delta) => {
    const targetX = pointer.x * 0.12;
    const targetY = 0.32 + pointer.y * 0.055;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 14.9, 3.8, delta);
    camera.lookAt(0, -0.52, 0);
  });
  return null;
}

export function StudioScene({ onSelect }: StudioSceneProps) {
  return (
    <>
      <color attach="background" args={["#f2f4f6"]} />
      <fog attach="fog" args={["#f2f4f6", 18, 28]} />

      <ambientLight intensity={0.9} />
      <hemisphereLight
        intensity={1.15}
        color="#fbfdff"
        groundColor="#d4d9dd"
      />
      <directionalLight
        position={[5.5, 8.5, 8]}
        intensity={1.8}
        color="#fff3df"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[7, 5, 7]}
        angle={0.72}
        penumbra={0.85}
        intensity={1.25}
        color="#edf4ff"
        castShadow
      />
      <pointLight
        position={[-5, 1.8, 5]}
        intensity={0.38}
        color="#ffd0b0"
        distance={9}
      />
      <pointLight
        position={[5, 1.6, 5]}
        intensity={0.34}
        color="#d9e8ff"
        distance={9}
      />

      <CameraRig />

      <group position={[0, -0.08, 0]} scale={0.92}>
        <WorkspaceBackbone />
        <WritingShelf onSelect={onSelect} />
        <PegBoard onSelect={onSelect} />
        <OrganizerRack onSelect={onSelect} />
        <Monitor onSelect={onSelect} />
        <DeskAndForeground />
        <PendantLamp />
      </group>

      <ContactShadows
        position={[0, -5.03, 0]}
        opacity={0.2}
        scale={18}
        blur={2.4}
        far={7}
      />
    </>
  );
}
