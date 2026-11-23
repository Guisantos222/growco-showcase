"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  gsap,
} from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  ControlEntryTunnel,
} from "@/components/showcase/scenes/control/ControlEntryTunnel";

import {
  ControlQuestionTransition,
} from "@/components/showcase/scenes/control/ControlQuestionTransition";

import {
  CONTROL_ENTRY,
  CONTROL_ENTRY_SCROLL_VH,
} from "@/components/showcase/scenes/control/controlEntryTiming";

import {
  CONTROL_RUNWAY_VH,
} from "@/components/showcase/scenes/control/controlTimeline";

type ControlSceneProps = {
  reducedMotion?: boolean;
  className?: string;
};

gsap.registerPlugin(
  ScrollTrigger,
);

/*
 * ============================================================================
 * CONTROL SCENE
 * ============================================================================
 *
 * IMPORTANT:
 *
 * We keep THREE different progress channels:
 *
 * 1. entryProgressRef
 *    0 → 1 only across the first 82vh.
 *    Controls text + dust + tunnel reveal.
 *
 * 2. tunnelTravelRef
 *    UNBOUNDED scroll distance after tunnelStart.
 *    Controls continuous forward motion.
 *
 * 3. globalProgress is only internal to ScrollTrigger.
 *
 * The old bug happened because the tunnel used entryProgressRef for BOTH
 * reveal and motion. entryProgressRef reaches 1 and then stays there forever,
 * so the tunnel visually froze.
 */

export function ControlScene({
  reducedMotion = false,
  className = "",
}: ControlSceneProps) {
  const sectionRef =
    useRef<HTMLElement>(
      null,
    );

  const stageRef =
    useRef<HTMLDivElement>(
      null,
    );

  const entryProgressRef =
    useRef<number>(
      0,
    );

  const tunnelTravelRef =
    useRef<number>(
      0,
    );

  useEffect(() => {
    const section =
      sectionRef.current;

    const stage =
      stageRef.current;

    if (
      !section ||
      !stage
    ) {
      return;
    }

    /*
     * ScrollTrigger progress represents:
     *
     * 0 → 1 across approximately (CONTROL_RUNWAY_VH - 100)vh,
     * because the viewport itself occupies the pinned frame.
     */
    const effectiveRunwayVh =
      Math.max(
        1,
        CONTROL_RUNWAY_VH -
        100,
      );

    const entryFraction =
      Math.min(
        1,
        CONTROL_ENTRY_SCROLL_VH /
        effectiveRunwayVh,
      );

    /*
     * Tunnel begins at 78% of the 82vh entry.
     */
    const tunnelStartVh =
      CONTROL_ENTRY_SCROLL_VH *
      CONTROL_ENTRY.tunnelStart;

    const updateProgress = (
      globalProgress: number,
    ) => {
      /*
       * Short cinematic opening.
       */
      entryProgressRef.current =
        remapClamped(
          globalProgress,
          0,
          entryFraction,
        );

      /*
       * Convert global progress back into PHYSICAL vh travelled.
       *
       * Then convert that to "screens travelled".
       *
       * Example:
       * +100vh after tunnelStart = +1 travel unit.
       *
       * This value does NOT clamp at 1.
       */
      const travelledVh =
        globalProgress *
        effectiveRunwayVh;

      tunnelTravelRef.current =
        Math.max(
          0,
          (
            travelledVh -
            tunnelStartVh
          ) /
          100,
        );
    };

    const trigger =
      ScrollTrigger.create({
        trigger:
          section,

        start:
          "top top",

        end:
          "bottom bottom",

        pin:
          stage,

        pinSpacing:
          false,

        anticipatePin:
          1,

        invalidateOnRefresh:
          true,

        onUpdate:
          (
            self,
          ) => {
            updateProgress(
              self.progress,
            );
          },

        onRefresh:
          (
            self,
          ) => {
            updateProgress(
              self.progress,
            );
          },
      });

    updateProgress(
      trigger.progress,
    );

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={
        sectionRef
      }
      id="control"
      data-control-scene
      className={`
        relative
        w-full
        bg-[#0A0F14]
        ${className}
      `}
      style={{
        height:
          `${CONTROL_RUNWAY_VH}vh`,
      }}
    >
      <div
        ref={
          stageRef
        }
        data-control-stage
        className="
          relative
          h-screen
          w-full
          overflow-hidden
          bg-[#0A0F14]
        "
      >
        <ControlEntryTunnel
          revealProgressRef={
            entryProgressRef
          }
          travelRef={
            tunnelTravelRef
          }
          reducedMotion={
            reducedMotion
          }
        />

        <ControlQuestionTransition
          progressRef={
            entryProgressRef
          }
          reducedMotion={
            reducedMotion
          }
        />
      </div>
    </section>
  );
}

function remapClamped(
  value: number,
  start: number,
  end: number,
) {
  if (
    value <=
    start
  ) {
    return 0;
  }

  if (
    value >=
    end
  ) {
    return 1;
  }

  return (
    value -
    start
  ) /
  (
    end -
    start
  );
}
