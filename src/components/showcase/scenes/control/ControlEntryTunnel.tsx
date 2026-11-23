"use client";

import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";

import { Canvas, useThree } from "@react-three/fiber";
import { useLocale } from "next-intl";
import { gsap } from "gsap";

import {
  BackSide,
  BufferGeometry,
  CatmullRomCurve3,
  DoubleSide,
  Float32BufferAttribute,
  TubeGeometry,
  Vector3,
} from "three";

import type { Mesh, PointLight } from "three";

import { CONTROL_ENTRY } from "@/components/showcase/scenes/control/controlEntryTiming";
import { ControlIntegratedSystem } from "@/components/showcase/scenes/control/ControlIntegratedSystem";
import { ControlCategoryOverlay } from "@/components/showcase/scenes/control/ControlCategoryOverlay";
import { ControlTerminalStage } from "@/components/showcase/scenes/control/ControlTerminalStage";
import { ControlTerminalBrand } from "@/components/showcase/scenes/control/ControlTerminalBrand";
import { ControlTerminalFlow } from "@/components/showcase/scenes/control/ControlTerminalFlow";
import { ControlTunnelCamera } from "@/components/showcase/scenes/control/ControlTunnelCamera";
import { ControlProductHandoffProjector } from "@/components/showcase/scenes/control/ControlProductHandoffProjector";
import { CONTROL_TERMINAL } from "@/components/showcase/scenes/control/controlWorldConfig";
import {
  HANDOFF_BACKGROUND,
  HANDOFF_STROKE,
  HANDOFF_STROKE_WIDTH,
  HANDOFF_VIEWBOX,
  PRODUCT_HANDOFF_LANES,
} from "@/components/showcase/scenes/shared/controlProductHandoff";

type ControlEntryTunnelProps = {
  revealProgressRef: MutableRefObject<number>;
  travelRef: MutableRefObject<number>;
  reducedMotion?: boolean;
};

type LightKind = "ceiling" | "left" | "right";

type LightPocket = {
  t: number;
  kind: LightKind;
  intensity: number;
  distance: number;
  color: string;
  length?: number;
};

export function ControlEntryTunnel({
  revealProgressRef,
  travelRef,
  reducedMotion = false,
}: ControlEntryTunnelProps) {
  const locale = useLocale();
  const veilRef = useRef<HTMLDivElement>(null);

  const handoffPathRefs =
    useRef<
      Array<
        SVGPathElement | null
      >
    >([]);

  const handoffBackdropRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const veil = veilRef.current;

    if (!veil) {
      return;
    }

    let previousProgress = -1;

    const update = () => {
      const progress = clamp01(revealProgressRef.current);

      if (Math.abs(progress - previousProgress) < 0.00001) {
        return;
      }

      previousProgress = progress;

      const reveal = smootherstep(
        range(progress, CONTROL_ENTRY.tunnelStart, CONTROL_ENTRY.tunnelFull),
      );

      veil.style.opacity = `${1 - reveal}`;
    };

    gsap.ticker.add(update);
    update();

    return () => {
      gsap.ticker.remove(update);
    };
  }, [revealProgressRef]);

  useEffect(() => {
    const backdrop =
      handoffBackdropRef.current;

    if (!backdrop) {
      return;
    }

    let previous =
      Number.NaN;

    const update = () => {
      const travel =
        Math.max(
          0,
          travelRef.current,
        );

      if (
        Number.isFinite(
          previous,
        ) &&
        Math.abs(
          travel -
          previous,
        ) <
          0.00001
      ) {
        return;
      }

      previous =
        travel;

      const amount =
        smootherstep(
          range(
            travel,
            CONTROL_TERMINAL.handoffBackdropStart,
            CONTROL_TERMINAL.handoffBackdropFull,
          ),
        );

      backdrop.style.opacity =
        `${amount}`;
    };

    gsap.ticker.add(
      update,
    );

    update();

    return () => {
      gsap.ticker.remove(
        update,
      );
    };
  }, [travelRef]);

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[20]
        overflow-hidden
        bg-[#030508]
        [contain:layout_paint_style]
      "
    >
      <Canvas
        dpr={[1, 1.45]}
        frameloop="demand"
        camera={{
          position: [0, 0, 13],
          fov: 68,
          near: 0.08,
          far: 240,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#030508", 1);
          gl.toneMappingExposure = 1.42;
        }}
      >
        <TunnelWorld
          travelRef={travelRef}
          reducedMotion={reducedMotion}
          handoffPathRefs={handoffPathRefs}
        />
      </Canvas>

      <div
        ref={handoffBackdropRef}
        className="
          pointer-events-none
          absolute
          inset-0
          z-[45]
          opacity-0
          will-change-opacity
        "
        style={{
          background:
            HANDOFF_BACKGROUND,
        }}
      />

      {/*
       * Final CONTROL -> PRODUCT handoff lives OUTSIDE Canvas.
       * The projector inside Three.js writes exact projected coordinates
       * directly into these paths.
       */}
      <svg
        viewBox={`0 0 ${HANDOFF_VIEWBOX.width} ${HANDOFF_VIEWBOX.height}`}
        preserveAspectRatio="none"
        className="
          pointer-events-none
          absolute
          inset-0
          z-[46]
          h-full
          w-full
          overflow-hidden
        "
      >
        {PRODUCT_HANDOFF_LANES.map(
          (
            lane,
            index,
          ) => (
            <path
              key={lane}
              ref={(
                element,
              ) => {
                handoffPathRefs.current[
                  index
                ] =
                  element;
              }}
              fill="none"
              stroke={HANDOFF_STROKE}
              strokeWidth={HANDOFF_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0"
            />
          ),
        )}
      </svg>

      <ControlCategoryOverlay
        travelRef={travelRef}
        locale={locale}
      />

      <div
        ref={veilRef}
        className="
          absolute
          inset-0
          z-[10]
          bg-[#0A0F14]
          opacity-100
          will-change-opacity
        "
      />
    </div>
  );
}

type TunnelWorldProps = {
  travelRef: MutableRefObject<number>;
  reducedMotion: boolean;

  handoffPathRefs:
    MutableRefObject<
      Array<
        SVGPathElement | null
      >
    >;
};

function TunnelWorld({
  travelRef,
  reducedMotion,
  handoffPathRefs,
}: TunnelWorldProps) {
  const curve = useMemo(() => createTunnelCurve(), []);

  const shellGeometry = useMemo(() => createTunnelShell(curve), [curve]);
  const floorGeometry = useMemo(() => createTunnelFloor(curve, 2.34, 3.72, 220), [curve]);
  const laneGeometry = useMemo(() => createTunnelFloor(curve, 0.64, 3.61, 220), [curve]);

  const floorRef = useRef<Mesh>(null);
  const laneRef = useRef<Mesh>(null);

  const lights = useMemo<LightPocket[]>(
    () => [
      { t: 0.05, kind: "ceiling", intensity: 16, distance: 20, color: "#BFE8FF", length: 4.8 },
      { t: 0.115, kind: "left", intensity: 11.5, distance: 14.5, color: "#76CEF8", length: 2.9 },
      { t: 0.19, kind: "ceiling", intensity: 14.2, distance: 18.5, color: "#A8DDFF", length: 4.2 },
      { t: 0.275, kind: "right", intensity: 10.8, distance: 14, color: "#63C0EE", length: 2.8 },
      { t: 0.355, kind: "ceiling", intensity: 15.5, distance: 19.5, color: "#B7E5FF", length: 4.5 },
      { t: 0.445, kind: "left", intensity: 10.2, distance: 13.5, color: "#67C8F2", length: 2.7 },
      { t: 0.535, kind: "ceiling", intensity: 14.5, distance: 18.5, color: "#AAE1FF", length: 4.2 },
      { t: 0.635, kind: "right", intensity: 10.4, distance: 13.8, color: "#59BCEA", length: 2.7 },
      { t: 0.735, kind: "ceiling", intensity: 13.8, distance: 17.5, color: "#9FD8FA", length: 3.8 },
      { t: 0.82, kind: "left", intensity: 9.5, distance: 12.5, color: "#4CB2E3", length: 2.55 },

      /*
       * Terminal approach:
       * a calmer, more architectural rhythm as the tunnel clears.
       */
      { t: 0.855, kind: "ceiling", intensity: 12.4, distance: 16.5, color: "#A6E0FA", length: 4.0 },
      { t: 0.89, kind: "right", intensity: 8.6, distance: 12.2, color: "#55BCE8", length: 2.45 },
      { t: 0.925, kind: "ceiling", intensity: 11.2, distance: 15.5, color: "#AEE4FB", length: 3.55 },
    ],
    [],
  );

  /*
   * The base floor ribbon has no geometric hole.
   *
   * While the camera is still above the floor, ControlTerminalStage's dark
   * aperture convincingly masks that surface. Once the camera commits to the
   * drop, the broad floor ribbon is hidden behind the aperture so we can
   * physically pass into the shaft without clipping through a solid plane.
   *
   * Scrolling backward restores it.
   */
  useEffect(() => {
    let previousOpen: boolean | null = null;

    const update = () => {
      const open =
        travelRef.current >=
        CONTROL_TERMINAL.floorRelease;

      if (open === previousOpen) {
        return;
      }

      previousOpen = open;

      if (floorRef.current) {
        floorRef.current.visible = !open;
      }

      if (laneRef.current) {
        laneRef.current.visible = !open;
      }
    };

    gsap.ticker.add(update);
    update();

    return () => {
      gsap.ticker.remove(update);
    };
  }, [travelRef]);

  return (
    <>
      <color attach="background" args={["#030508"]} />
      <fog attach="fog" args={["#030508", 38, 122]} />

      <ambientLight intensity={0.24} />
      <hemisphereLight args={["#95D5F7", "#020305", 0.55]} />

      <directionalLight position={[0, 6.5, 13]} intensity={0.88} color="#91D7F8" />
      <directionalLight position={[-5.5, 2.5, 9.5]} intensity={0.34} color="#9BC6DF" />

      <mesh geometry={shellGeometry}>
        <meshStandardMaterial
          color="#132733"
          roughness={0.92}
          metalness={0.035}
          emissive="#091720"
          emissiveIntensity={0.28}
          side={BackSide}
        />
      </mesh>

      <group name="control-floor-surface">
        <mesh
          ref={floorRef}
          geometry={floorGeometry}
        >
          <meshStandardMaterial
            color="#122430"
            roughness={0.52}
            metalness={0.08}
            emissive="#0B1620"
            emissiveIntensity={0.16}
            side={DoubleSide}
          />
        </mesh>

        <mesh
          ref={laneRef}
          geometry={laneGeometry}
        >
          <meshBasicMaterial
            color="#7CCAF0"
            transparent
            opacity={0.085}
            side={DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <group name="control-light-pockets">
        {lights.map((light, index) => (
          <TunnelLightPocket key={`control-light-${index}`} curve={curve} {...light} />
        ))}
      </group>

      <ControlTerminalStage
        curve={curve}
      />

      <ControlTerminalBrand
        curve={curve}
        travelRef={travelRef}
      />

      <ControlIntegratedSystem
        curve={curve}
        travelRef={travelRef}
      />

      <ControlTerminalFlow
        curve={curve}
        travelRef={travelRef}
      />

      <CameraTravelRig travelRef={travelRef} />

      <ControlTunnelCamera
        curve={curve}
        travelRef={travelRef}
        reducedMotion={reducedMotion}
      />

      <ControlProductHandoffProjector
        curve={curve}
        travelRef={travelRef}
        pathRefs={handoffPathRefs}
      />
    </>
  );
}

type CameraTravelRigProps = {
  travelRef: MutableRefObject<number>;
};

function CameraTravelRig({ travelRef }: CameraTravelRigProps) {
  const { camera, invalidate } = useThree();

  const topFillRef = useRef<PointLight>(null);
  const frontFillRef = useRef<PointLight>(null);

  useEffect(() => {
    const topFill = topFillRef.current;
    const frontFill = frontFillRef.current;

    if (!topFill || !frontFill) {
      return;
    }

    let previousTravel = -1;

    const update = () => {
      const travel = Math.max(0, travelRef.current);

      if (Math.abs(travel - previousTravel) < 0.00001) {
        return;
      }

      previousTravel = travel;

      topFill.position.copy(camera.position);
      topFill.position.y += 0.68;
      topFill.position.z += 0.42;

      frontFill.position.copy(camera.position);
      frontFill.position.y -= 0.16;
      frontFill.position.z -= 0.85;

      invalidate();
    };

    gsap.ticker.add(update);
    update();

    return () => {
      gsap.ticker.remove(update);
    };
  }, [camera, invalidate, travelRef]);

  return (
    <>
      <pointLight
        ref={topFillRef}
        color="#9EDDFB"
        intensity={7.6}
        distance={17}
        decay={2}
      />

      <pointLight
        ref={frontFillRef}
        color="#66BFEA"
        intensity={3.7}
        distance={9.5}
        decay={2}
      />
    </>
  );
}

type TunnelLightPocketProps = {
  curve: CatmullRomCurve3;
  t: number;
  kind: LightKind;
  intensity: number;
  distance: number;
  color: string;
  length?: number;
};

function TunnelLightPocket({
  curve,
  t,
  kind,
  intensity,
  distance,
  color,
  length = 3.8,
}: TunnelLightPocketProps) {
  const transform = useMemo(() => getLightTransform(curve, t, kind), [curve, t, kind]);
  const isCeiling = kind === "ceiling";

  return (
    <group position={transform.position} rotation={[0, transform.yaw, 0]}>
      <mesh>
        <boxGeometry args={isCeiling ? [length, 0.05, 0.32] : [0.075, length * 0.78, 0.24]} />
        <meshBasicMaterial color={color} transparent opacity={isCeiling ? 0.86 : 0.68} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={isCeiling ? [length * 1.15, 0.14, 0.5] : [0.18, length * 0.95, 0.44]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isCeiling ? 0.1 : 0.07}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <pointLight color={color} intensity={intensity} distance={distance} decay={2} />
    </group>
  );
}

function createTunnelCurve() {
  return new CatmullRomCurve3(
    [
      new Vector3(0, 0, 18),
      new Vector3(0, 0, 1),
      new Vector3(0.35, 0.06, -18),
      new Vector3(1.6, 0.22, -39),
      new Vector3(3.18, 0.38, -59),
      new Vector3(3.74, 0.08, -81),
      new Vector3(2.08, -0.24, -103),
      new Vector3(-0.92, 0.12, -126),
      new Vector3(-3.48, 0.35, -148),
      new Vector3(-4.74, 0.05, -171),
    ],
    false,
    "catmullrom",
    0.42,
  );
}

function createTunnelShell(curve: CatmullRomCurve3) {
  const geometry = new TubeGeometry(curve, 280, 5.05, 32, false);
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;

  const point = new Vector3();
  const normal = new Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    normal.fromBufferAttribute(normals, index);

    const primaryWave = Math.sin(point.z * 0.115 + point.x * 0.41) * 0.022;
    const secondaryWave = Math.sin(point.z * 0.052 + point.y * 0.74) * 0.014;
    const tertiaryWave = Math.sin(point.z * 0.081 + point.x * 0.19 + point.y * 0.37) * 0.008;
    const displacement = primaryWave + secondaryWave + tertiaryWave;

    positions.setXYZ(
      index,
      point.x + normal.x * displacement,
      point.y + normal.y * displacement,
      point.z + normal.z * displacement,
    );
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

function createTunnelFloor(
  curve: CatmullRomCurve3,
  halfWidth: number,
  floorDrop: number,
  segments: number,
) {
  const geometry = new BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const worldUp = new Vector3(0, 1, 0);
  const center = new Vector3();
  const tangent = new Vector3();
  const side = new Vector3();
  const left = new Vector3();
  const right = new Vector3();

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;

    curve.getPointAt(t, center);
    curve.getTangentAt(t, tangent);

    side.crossVectors(tangent, worldUp).normalize();

    center.y -= floorDrop;

    left.copy(center).addScaledVector(side, -halfWidth);
    right.copy(center).addScaledVector(side, halfWidth);

    vertices.push(left.x, left.y, left.z, right.x, right.y, right.z);

    if (index < segments) {
      const base = index * 2;

      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function getLightTransform(curve: CatmullRomCurve3, t: number, kind: LightKind) {
  const position = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t).normalize();

  const worldUp = new Vector3(0, 1, 0);
  const side = new Vector3().crossVectors(tangent, worldUp).normalize();

  if (kind === "ceiling") {
    position.y += 3.92;
  }

  if (kind === "left") {
    position.addScaledVector(side, -3.92);
  }

  if (kind === "right") {
    position.addScaledVector(side, 3.92);
  }

  const yaw = Math.atan2(tangent.x, -tangent.z);

  return {
    position: [position.x, position.y, position.z] as [number, number, number],
    yaw,
  };
}

function range(value: number, start: number, end: number) {
  if (value <= start) {
    return 0;
  }

  if (value >= end) {
    return 1;
  }

  return (value - start) / (end - start);
}

function smootherstep(value: number) {
  const t = clamp01(value);

  return t * t * t * (t * (t * 6 - 15) + 10);
}

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
