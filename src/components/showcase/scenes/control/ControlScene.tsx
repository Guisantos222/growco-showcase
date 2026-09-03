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
  useGSAP,
} from "@gsap/react";

import {
  useTranslations,
} from "next-intl";

import {
  ControlModule,
} from "@/components/showcase/scenes/control/ControlModule";

import {
  controlFragments,
  controlModules,
} from "@/components/showcase/scenes/control/controlData";

import {
  useExperienceRuntime,
} from "@/experience/hooks/useExperienceRuntime";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

export function ControlScene() {
  const t =
    useTranslations(
      "Showcase.control",
    );

  const runtime =
    useExperienceRuntime();

  const section =
    useRef<HTMLElement>(
      null,
    );

  const stage =
    useRef<HTMLDivElement>(
      null,
    );

  const fragmentsLayer =
    useRef<HTMLDivElement>(
      null,
    );

  const dashboard =
    useRef<HTMLDivElement>(
      null,
    );

  const dashboardGlow =
    useRef<HTMLDivElement>(
      null,
    );

  const question =
    useRef<HTMLHeadingElement>(
      null,
    );

  const organizingCopy =
    useRef<HTMLParagraphElement>(
      null,
    );

  const onePlaceCopy =
    useRef<HTMLHeadingElement>(
      null,
    );

  const connectedCopy =
    useRef<HTMLParagraphElement>(
      null,
    );

  /*
   * SUBTLE CURSOR DEPTH
   */

  useEffect(() => {
    if (
      !runtime.ready ||
      runtime.reducedMotion
    ) {
      return;
    }

    if (
      !fragmentsLayer.current ||
      !dashboard.current
    ) {
      return;
    }

    const finePointer =
      window.matchMedia(
        "(pointer: fine)",
      );

    if (
      !finePointer.matches
    ) {
      return;
    }

    const fragmentX =
      gsap.quickTo(
        fragmentsLayer.current,
        "x",
        {
          duration: 1,
          ease:
            "power3.out",
        },
      );

    const fragmentY =
      gsap.quickTo(
        fragmentsLayer.current,
        "y",
        {
          duration: 1,
          ease:
            "power3.out",
        },
      );

    const dashboardX =
      gsap.quickTo(
        dashboard.current,
        "x",
        {
          duration: 1.25,
          ease:
            "power3.out",
        },
      );

    const dashboardY =
      gsap.quickTo(
        dashboard.current,
        "y",
        {
          duration: 1.25,
          ease:
            "power3.out",
        },
      );

    function handlePointerMove(
      event: PointerEvent,
    ) {
      const x =
        event.clientX /
          window.innerWidth -
        0.5;

      const y =
        event.clientY /
          window.innerHeight -
        0.5;

      fragmentX(
        x * -16,
      );

      fragmentY(
        y * -10,
      );

      dashboardX(
        x * -5,
      );

      dashboardY(
        y * -3,
      );
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, [
    runtime.ready,
    runtime.reducedMotion,
  ]);

  /*
   * SCROLL STORY
   */

  useGSAP(
    () => {
      if (
        !section.current ||
        !stage.current ||
        !dashboard.current ||
        !runtime.ready
      ) {
        return;
      }

      const fragments =
        Array.from(
          section.current.querySelectorAll<HTMLElement>(
            "[data-control-fragment]",
          ),
        );

      const modules =
        Array.from(
          section.current.querySelectorAll<HTMLElement>(
            "[data-control-module]",
          ),
        );

      const moduleBars =
        Array.from(
          section.current.querySelectorAll<HTMLElement>(
            "[data-control-module-bar]",
          ),
        );

      /*
       * INITIAL STATE
       */

      gsap.set(
        stage.current,
        {
          backgroundColor:
            "#080A10",
        },
      );

      gsap.set(
        fragments,
        {
          autoAlpha: 0.08,
        },
      );

      gsap.set(
        dashboard.current,
        {
          autoAlpha: 0,
          scale: 0.9,
          y: 80,
        },
      );

      gsap.set(
        dashboardGlow.current,
        {
          autoAlpha: 0,
          scale: 0.7,
        },
      );

      gsap.set(
        modules,
        {
          autoAlpha: 0,
          y: 25,
          scale: 0.96,
        },
      );

      gsap.set(
        moduleBars,
        {
          scaleX: 0,
        },
      );

      gsap.set(
        organizingCopy.current,
        {
          autoAlpha: 0,
          y: 18,
        },
      );

      gsap.set(
        onePlaceCopy.current,
        {
          autoAlpha: 0,
          y: 32,
        },
      );

      gsap.set(
        connectedCopy.current,
        {
          autoAlpha: 0,
          y: 16,
        },
      );

      gsap.set(
        question.current,
        {
          autoAlpha: 1,
        },
      );

      /*
       * REDUCED MOTION
       */

      if (
        runtime.reducedMotion
      ) {
        gsap.set(
          fragments,
          {
            autoAlpha: 0.2,
          },
        );

        const reducedTimeline =
          gsap.timeline({
            scrollTrigger: {
              trigger:
                section.current,

              start:
                "top top",

              end:
                "bottom bottom",

              scrub: 0.5,
            },
          });

        reducedTimeline.to(
          question.current,
          {
            autoAlpha: 0,
            duration: 0.1,
          },
          0.12,
        );

        reducedTimeline.to(
          fragments,
          {
            autoAlpha: 0,
            duration: 0.15,
          },
          0.22,
        );

        reducedTimeline.to(
          dashboard.current,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.16,
          },
          0.28,
        );

        reducedTimeline.to(
          modules,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.15,
            stagger: 0.015,
          },
          0.34,
        );

        reducedTimeline.to(
          moduleBars,
          {
            scaleX: 1,
            duration: 0.15,
            stagger: 0.012,
          },
          0.42,
        );

        reducedTimeline.to(
          onePlaceCopy.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.12,
          },
          0.62,
        );

        reducedTimeline.to(
          connectedCopy.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.1,
          },
          0.7,
        );

        return;
      }

      /*
       * MAIN TIMELINE
       */

      const timeline =
        gsap.timeline({
          scrollTrigger: {
            trigger:
              section.current,

            start:
              "top top",

            end:
              "bottom bottom",

            scrub: 0.9,
          },
        });

      /*
       * QUESTION HANDOFF
       */

      timeline.to(
        question.current,
        {
          autoAlpha: 0,
          scale: 0.97,
          y: -30,
          duration: 0.1,
        },
        0.08,
      );

      timeline.fromTo(
        organizingCopy.current,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.1,
        },
        0.14,
      );

      /*
       * DATA WAKES UP
       */

      timeline.to(
        fragments,
        {
          autoAlpha: 0.82,
          duration: 0.1,
          stagger: 0.006,
        },
        0.15,
      );

      /*
       * CONVERGENCE
       */

      fragments.forEach(
        (
          fragment,
          index,
        ) => {
          const targetX =
            Number(
              fragment.dataset
                .targetX ??
                50,
            );

          const targetY =
            Number(
              fragment.dataset
                .targetY ??
                50,
            );

          timeline.to(
            fragment,
            {
              left:
                `${targetX}%`,

              top:
                `${targetY}%`,

              rotation: 0,

              scale:
                index % 3 === 0
                  ? 0.88
                  : 0.82,

              duration: 0.27,

              ease:
                "power2.inOut",
            },
            0.23 +
              (
                index % 4
              ) *
                0.008,
          );
        },
      );

      /*
       * DASHBOARD MATERIALIZES
       */

      timeline.to(
        dashboardGlow.current,
        {
          autoAlpha: 0.55,
          scale: 1,
          duration: 0.15,
          ease:
            "power2.out",
        },
        0.39,
      );

      timeline.to(
        dashboard.current,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.18,
          ease:
            "power3.out",
        },
        0.42,
      );

      /*
       * FRAGMENTS BECOME SYSTEM
       */

      timeline.to(
        fragments,
        {
          autoAlpha: 0,
          scale: 0.65,
          duration: 0.12,
          stagger: 0.004,
        },
        0.49,
      );

      timeline.to(
        organizingCopy.current,
        {
          autoAlpha: 0,
          y: -16,
          duration: 0.08,
        },
        0.49,
      );

      /*
       * MODULES
       */

      timeline.to(
        modules,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.14,
          stagger: 0.025,
          ease:
            "power3.out",
        },
        0.52,
      );

      timeline.to(
        moduleBars,
        {
          scaleX: 1,
          duration: 0.16,
          stagger: 0.018,
          ease:
            "power3.out",
        },
        0.6,
      );

      /*
       * FINAL STATEMENT
       */

      timeline.fromTo(
        onePlaceCopy.current,
        {
          autoAlpha: 0,
          y: 32,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.12,
          ease:
            "power3.out",
        },
        0.72,
      );

      timeline.fromTo(
        connectedCopy.current,
        {
          autoAlpha: 0,
          y: 16,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.1,
        },
        0.8,
      );

      /*
       * PREPARE NEXT DEPTH
       */

      timeline.to(
        dashboard.current,
        {
          scale: 0.95,
          y: -18,
          duration: 0.12,
          ease:
            "power2.inOut",
        },
        0.88,
      );

      timeline.to(
        dashboardGlow.current,
        {
          scale: 1.25,
          opacity: 0.28,
          duration: 0.12,
        },
        0.88,
      );
    },
    {
      scope: section,

      dependencies: [
        runtime.ready,
        runtime.reducedMotion,
      ],

      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={section}
      className="relative h-[420vh] bg-[#080A10]"
    >
      <div
        ref={stage}
        className="sticky top-0 h-screen overflow-hidden bg-[#080A10]"
      >
        {/* BACKGROUND GRID */}

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",

            backgroundSize:
              "72px 72px",

            maskImage:
              "radial-gradient(circle at center, black, transparent 78%)",
          }}
        />

        {/* GLOW */}

        <div
          ref={dashboardGlow}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0BA5FF]/15 blur-[140px]"
        />

        {/* FRAGMENTS */}

        <div
          ref={fragmentsLayer}
          aria-hidden="true"
          className="absolute inset-0 z-20"
        >
          {controlFragments.map(
            (fragment) => (
              <div
                key={
                  fragment.id
                }
                data-control-fragment
                data-target-x={
                  fragment.targetX
                }
                data-target-y={
                  fragment.targetY
                }
                className={`absolute ${
                  fragment.mobileHidden
                    ? "hidden md:block"
                    : "block"
                }`}
                style={{
                  left:
                    `${fragment.startX}%`,

                  top:
                    `${fragment.startY}%`,

                  rotate:
                    `${fragment.rotate}deg`,
                }}
              >
                <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
                  <span className="mr-3 text-[9px] uppercase tracking-[0.16em] text-white/30">
                    {t(
                      `items.${fragment.labelKey}`,
                    )}
                  </span>

                  <span className="whitespace-nowrap text-xs font-medium text-white/75">
                    {
                      fragment.value
                    }
                  </span>
                </div>
              </div>
            ),
          )}
        </div>

        {/* QUESTION */}

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6">
          <h2
            ref={question}
            className="max-w-5xl text-center text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white md:text-7xl lg:text-[6rem]"
          >
            {t(
              "question",
            )}
          </h2>
        </div>

        {/* ORGANIZING COPY */}

        <div className="pointer-events-none absolute left-1/2 top-[16%] z-30 w-full -translate-x-1/2 px-6 text-center">
          <p
            ref={
              organizingCopy
            }
            className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0BA5FF]"
          >
            {t(
              "organizing",
            )}
          </p>
        </div>

        {/* DASHBOARD */}

        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4 md:px-8">
          <div
            ref={dashboard}
            className="pointer-events-auto relative w-full max-w-6xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0D111A]/90 p-4 shadow-[0_50px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-7"
          >
            {/* DASHBOARD TOP BAR */}

            <div className="flex items-center justify-between border-b border-white/8 pb-5">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0BA5FF]" />

                <span className="font-semibold tracking-tight text-white">
                  growCo.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/5" />
              </div>
            </div>

            {/* MODULE GRID */}

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {controlModules.map(
                (
                  module,
                  index,
                ) => (
                  <ControlModule
                    key={
                      module.id
                    }
                    label={t(
                      `modules.${module.id}`,
                    )}
                    value={
                      module.value
                    }
                    index={
                      index
                    }
                  />
                ),
              )}
            </div>

            {/* SYSTEM FOOTER */}

            <div className="mt-5 flex items-center justify-between rounded-[1.25rem] border border-white/5 bg-black/15 px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Data in Motion
              </p>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0BA5FF]" />

                <span className="text-[10px] text-white/35">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL COPY */}

        <div className="pointer-events-none absolute bottom-[7%] left-1/2 z-50 w-full -translate-x-1/2 px-6 text-center md:bottom-[6%]">
          <h2
            ref={
              onePlaceCopy
            }
            className="text-4xl font-black tracking-[-0.06em] text-white md:text-6xl"
          >
            {t(
              "onePlace",
            )}
          </h2>

          <p
            ref={
              connectedCopy
            }
            className="mt-3 text-sm font-medium uppercase tracking-[0.28em] text-[#0BA5FF]"
          >
            {t(
              "connected",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}