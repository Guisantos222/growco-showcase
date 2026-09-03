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
  ChaosDataCard,
} from "@/components/showcase/scenes/chaos/ChaosDataCard";

import {
  chaosItems,
  type ChaosLayer,
} from "@/components/showcase/scenes/chaos/chaosData";

import {
  useExperienceRuntime,
} from "@/experience/hooks/useExperienceRuntime";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

export function ChaosScene() {
  const t =
    useTranslations(
      "Showcase.chaos",
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

  const movingCopy =
    useRef<HTMLHeadingElement>(
      null,
    );

  const everySecondCopy =
    useRef<HTMLParagraphElement>(
      null,
    );

  const tooMuchCopy =
    useRef<HTMLHeadingElement>(
      null,
    );

  const notEnoughCopy =
    useRef<HTMLHeadingElement>(
      null,
    );

  const questionCopy =
    useRef<HTMLHeadingElement>(
      null,
    );

  const progressFill =
    useRef<HTMLDivElement>(
      null,
    );

  const farLayer =
    useRef<HTMLDivElement>(
      null,
    );

  const midLayer =
    useRef<HTMLDivElement>(
      null,
    );

  const nearLayer =
    useRef<HTMLDivElement>(
      null,
    );

  /*
   * CURSOR PARALLAX
   */

  useEffect(() => {
    if (
      !runtime.ready ||
      runtime.reducedMotion
    ) {
      return;
    }

    const finePointer =
      window.matchMedia(
        "(pointer: fine)",
      );

    if (
      !finePointer.matches ||
      !farLayer.current ||
      !midLayer.current ||
      !nearLayer.current
    ) {
      return;
    }

    const nearX =
      gsap.quickTo(
        nearLayer.current,
        "x",
        {
          duration: 0.8,
          ease:
            "power3.out",
        },
      );

    const nearY =
      gsap.quickTo(
        nearLayer.current,
        "y",
        {
          duration: 0.8,
          ease:
            "power3.out",
        },
      );

    const midX =
      gsap.quickTo(
        midLayer.current,
        "x",
        {
          duration: 1,
          ease:
            "power3.out",
        },
      );

    const midY =
      gsap.quickTo(
        midLayer.current,
        "y",
        {
          duration: 1,
          ease:
            "power3.out",
        },
      );

    const farX =
      gsap.quickTo(
        farLayer.current,
        "x",
        {
          duration: 1.2,
          ease:
            "power3.out",
        },
      );

    const farY =
      gsap.quickTo(
        farLayer.current,
        "y",
        {
          duration: 1.2,
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

      nearX(
        x * -42,
      );

      nearY(
        y * -30,
      );

      midX(
        x * -20,
      );

      midY(
        y * -14,
      );

      farX(
        x * -7,
      );

      farY(
        y * -5,
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
   * SCROLL NARRATIVE
   */

  useGSAP(
    () => {
      if (
        !section.current ||
        !stage.current ||
        !runtime.ready
      ) {
        return;
      }

      const items =
        Array.from(
          section.current.querySelectorAll<HTMLElement>(
            "[data-chaos-item]",
          ),
        );

      const driftElements =
        Array.from(
          section.current.querySelectorAll<HTMLElement>(
            "[data-chaos-drift]",
          ),
        );

      if (
        items.length === 0
      ) {
        return;
      }

      gsap.set(
        stage.current,
        {
          backgroundColor:
            "#ffffff",
        },
      );

      gsap.set(
        items,
        {
          autoAlpha: 0,
          scale: 0.84,
        },
      );

      gsap.set(
        [
          movingCopy.current,
          everySecondCopy.current,
          tooMuchCopy.current,
          notEnoughCopy.current,
          questionCopy.current,
        ],
        {
          autoAlpha: 0,
        },
      );

      gsap.set(
        questionCopy.current,
        {
          y: 30,
        },
      );

      gsap.set(
        progressFill.current,
        {
          scaleY: 0,
          transformOrigin:
            "top center",
        },
      );

      /*
       * REDUCED MOTION
       */

      if (
        runtime.reducedMotion
      ) {
        gsap.set(
          items,
          {
            scale: 1,
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

        reducedTimeline.fromTo(
          movingCopy.current,
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.12,
          },
          0,
        );

        reducedTimeline.to(
          items,
          {
            autoAlpha: 0.72,
            duration: 0.18,
            stagger: 0.01,
          },
          0.16,
        );

        reducedTimeline.to(
          movingCopy.current,
          {
            autoAlpha: 0,
            duration: 0.08,
          },
          0.34,
        );

        reducedTimeline.fromTo(
          tooMuchCopy.current,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.1,
          },
          0.38,
        );

        reducedTimeline.fromTo(
          notEnoughCopy.current,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.1,
          },
          0.48,
        );

        reducedTimeline.to(
          [
            tooMuchCopy.current,
            notEnoughCopy.current,
          ],
          {
            autoAlpha: 0,
            duration: 0.08,
          },
          0.62,
        );

        reducedTimeline.to(
          items,
          {
            autoAlpha: 0.08,
            duration: 0.1,
          },
          0.64,
        );

        reducedTimeline.to(
          stage.current,
          {
            backgroundColor:
              "#080A10",
            duration: 0.12,
          },
          0.64,
        );

        reducedTimeline.fromTo(
          questionCopy.current,
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.12,
          },
          0.76,
        );

        reducedTimeline.to(
          progressFill.current,
          {
            scaleY: 1,
            duration: 1,
            ease: "none",
          },
          0,
        );

        return;
      }

      /*
       * CONTINUOUS MICRO DRIFT
       *
       * O wrapper faz a trajetória
       * principal.
       *
       * O elemento interno faz
       * pequenas oscilações.
       */

      const driftTweens =
        driftElements.map(
          (
            element,
            index,
          ) => {
            const direction =
              index % 2 === 0
                ? 1
                : -1;

            return gsap.to(
              element,
              {
                x:
                  direction *
                  (
                    4 +
                    (index % 3) *
                      3
                  ),

                y:
                  -direction *
                  (
                    5 +
                    (index % 4) *
                      2
                  ),

                rotation:
                  direction *
                  (
                    0.8 +
                    (index % 3) *
                      0.4
                  ),

                duration:
                  2.2 +
                  (index % 4) *
                    0.55,

                ease:
                  "sine.inOut",

                repeat: -1,

                yoyo: true,
              },
            );
          },
        );

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

            scrub: 0.85,

            onUpdate: (
              self,
            ) => {
              const progress =
                self.progress;

              let speed = 0;

              if (
                progress < 0.16
              ) {
                speed = 0.35;
              } else if (
                progress < 0.58
              ) {
                speed =
                  gsap.utils.mapRange(
                    0.16,
                    0.58,
                    0.55,
                    1.8,
                    progress,
                  );
              } else if (
                progress < 0.72
              ) {
                speed =
                  gsap.utils.mapRange(
                    0.58,
                    0.72,
                    1.8,
                    0,
                    progress,
                  );
              }

              driftTweens.forEach(
                (tween) => {
                  tween.timeScale(
                    Math.max(
                      0,
                      speed,
                    ),
                  );
                },
              );
            },
          },
        });

      timeline.fromTo(
        movingCopy.current,
        {
          autoAlpha: 0,
          y: 36,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.12,
          ease:
            "power3.out",
        },
        0,
      );

      timeline.fromTo(
        everySecondCopy.current,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.1,
        },
        0.1,
      );

      /*
       * DATA ARRIVAL
       */

      const firstWave =
        items.slice(
          0,
          6,
        );

      const secondWave =
        items.slice(
          6,
          12,
        );

      const thirdWave =
        items.slice(
          12,
        );

      timeline.to(
        firstWave,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.1,
          stagger: 0.015,
        },
        0.17,
      );

      timeline.to(
        secondWave,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.1,
          stagger: 0.012,
        },
        0.27,
      );

      timeline.to(
        thirdWave,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.1,
          stagger: 0.01,
        },
        0.36,
      );

      /*
       * TRAJECTORIES
       */

      items.forEach(
        (
          item,
          index,
        ) => {
          const moveX =
            Number(
              item.dataset
                .moveX ??
                0,
            );

          const moveY =
            Number(
              item.dataset
                .moveY ??
                0,
            );

          const rotation =
            Number(
              item.dataset
                .rotation ??
                0,
            );

          gsap.set(
            item,
            {
              rotation,
            },
          );

          timeline.to(
            item,
            {
              x: moveX,
              y: moveY,

              rotation:
                rotation +
                (
                  index % 2 === 0
                    ? 7
                    : -7
                ),

              duration:
                0.4,

              ease:
                "none",
            },
            0.24 +
              (index % 5) *
                0.012,
          );
        },
      );

      /*
       * COPY LEAVES
       */

      timeline.to(
        movingCopy.current,
        {
          autoAlpha: 0,
          y: -26,
          duration: 0.08,
        },
        0.47,
      );

      timeline.to(
        everySecondCopy.current,
        {
          autoAlpha: 0,
          y: -16,
          duration: 0.08,
        },
        0.5,
      );

      /*
       * TOO MUCH DATA
       */

      timeline.fromTo(
        tooMuchCopy.current,
        {
          autoAlpha: 0,
          scale: 0.92,
          y: 45,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.12,
          ease:
            "power3.out",
        },
        0.51,
      );

      timeline.fromTo(
        notEnoughCopy.current,
        {
          autoAlpha: 0,
          y: 35,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.11,
          ease:
            "power3.out",
        },
        0.59,
      );

      /*
       * FREEZE
       */

      timeline.to(
        items,
        {
          opacity: 0.32,
          scale: 0.98,
          duration: 0.09,
        },
        0.69,
      );

      timeline.to(
        [
          tooMuchCopy.current,
          notEnoughCopy.current,
        ],
        {
          autoAlpha: 0,
          y: -25,
          duration: 0.09,
        },
        0.72,
      );

      /*
       * ENTER DARKNESS
       */

      timeline.to(
        stage.current,
        {
          backgroundColor:
            "#080A10",

          duration: 0.12,
          ease: "none",
        },
        0.75,
      );

      timeline.to(
        items,
        {
          autoAlpha: 0.09,
          filter:
            "blur(2px)",
          duration: 0.1,
        },
        0.75,
      );

      /*
       * QUESTION
       */

      timeline.fromTo(
        questionCopy.current,
        {
          autoAlpha: 0,
          y: 30,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.13,
          ease:
            "power3.out",
        },
        0.82,
      );

      /*
       * PROGRESS
       */

      timeline.to(
        progressFill.current,
        {
          scaleY: 1,
          duration: 1,
          ease: "none",
        },
        0,
      );

      return () => {
        driftTweens.forEach(
          (tween) => {
            tween.kill();
          },
        );
      };
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

  function renderLayer(
    layer: ChaosLayer,
  ) {
    return chaosItems
      .filter(
        (item) =>
          item.layer ===
          layer,
      )
      .map(
        (item) => (
          <div
            key={item.id}
            data-chaos-item
            data-move-x={
              item.moveX
            }
            data-move-y={
              item.moveY
            }
            data-rotation={
              item.rotate
            }
            className={`absolute ${
              item.mobileHidden
                ? "hidden md:block"
                : "block"
            }`}
            style={{
              left:
                `${item.x}%`,

              top:
                `${item.y}%`,
            }}
          >
            <ChaosDataCard
              label={t(
                `items.${item.labelKey}`,
              )}
              value={
                item.value
              }
              variant={
                item.variant
              }
            />
          </div>
        ),
      );
  }

  return (
    <section
      ref={section}
      id="top"
      className="relative h-[460vh]"
    >
      <div
        ref={stage}
        className="sticky top-0 h-screen overflow-hidden bg-white"
      >
        {/* ================= */}
        {/* DATA FIELD        */}
        {/* ================= */}

        <div
          aria-hidden="true"
          className="absolute inset-0"
        >
          <div
            ref={farLayer}
            className="absolute inset-0 z-10 opacity-55"
          >
            {renderLayer(
              "far",
            )}
          </div>

          <div
            ref={midLayer}
            className="absolute inset-0 z-20 opacity-80"
          >
            {renderLayer(
              "mid",
            )}
          </div>

          <div
            ref={nearLayer}
            className="absolute inset-0 z-30"
          >
            {renderLayer(
              "near",
            )}
          </div>
        </div>

        {/* ================= */}
        {/* INITIAL COPY      */}
        {/* ================= */}

        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-6">
          <div className="text-center">
            <h1
              ref={
                movingCopy
              }
              className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#080A10] md:text-7xl lg:text-[6.6rem]"
            >
              {t(
                "moving",
              )}
            </h1>

            <p
              ref={
                everySecondCopy
              }
              className="mt-7 text-sm font-medium uppercase tracking-[0.3em] text-black/45 md:text-base"
            >
              {t(
                "everySecond",
              )}
            </p>
          </div>
        </div>

        {/* ================= */}
        {/* CHAOS HEADLINE    */}
        {/* ================= */}

        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center px-4">
          <div className="w-full text-center">
            <h2
              ref={
                tooMuchCopy
              }
              className="text-[15vw] font-black leading-[0.72] tracking-[-0.085em] text-[#080A10] md:text-[12vw]"
            >
              {t(
                "tooMuch",
              )}
            </h2>

            <h2
              ref={
                notEnoughCopy
              }
              className="mt-8 text-[9vw] font-semibold leading-[0.8] tracking-[-0.07em] text-[#0BA5FF] md:text-[7vw]"
            >
              {t(
                "notEnough",
              )}
            </h2>
          </div>
        </div>

        {/* ================= */}
        {/* QUESTION          */}
        {/* ================= */}

        <div className="pointer-events-none absolute inset-0 z-60 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#0BA5FF]">
              growCo.
            </p>

            <h2
              ref={
                questionCopy
              }
              className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white md:text-7xl lg:text-[6rem]"
            >
              {t(
                "question",
              )}
            </h2>
          </div>
        </div>

        {/* ================= */}
        {/* PROGRESS          */}
        {/* ================= */}

        <div className="pointer-events-none absolute bottom-8 right-6 z-[70] hidden h-20 w-px bg-black/10 md:block">
          <div
            ref={
              progressFill
            }
            className="h-full w-full bg-[#0BA5FF]"
          />
        </div>
      </div>
    </section>
  );
}