"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  useLocale,
} from "next-intl";

import {
  CONTROL_ENTRY,
} from "@/components/showcase/scenes/control/controlEntryTiming";

type ControlQuestionTransitionProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
};

type DustParticle = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
  blue: boolean;
};

const DUST_COUNT = 46;

export function ControlQuestionTransition({
  progressRef,
  reducedMotion = false,
}: ControlQuestionTransitionProps) {
  const locale = useLocale();

  const rootRef =
    useRef<HTMLDivElement>(
      null,
    );

  const copyRef =
    useRef<HTMLDivElement>(
      null,
    );

  const letterRefs =
    useRef<
      Array<
        HTMLSpanElement | null
      >
    >([]);

  const dustRefs =
    useRef<
      Array<
        HTMLSpanElement | null
      >
    >([]);

  const dust =
    useMemo(
      () =>
        createDust(),
      [],
    );

  const copy =
    locale.startsWith(
      "pt",
    )
      ? {
          eyebrow:
            "UMA NOVA POSSIBILIDADE",

          first:
            "E SE TUDO ESTIVESSE",

          second:
            "CONECTADO?",
        }
      : {
          eyebrow:
            "A NEW POSSIBILITY",

          first:
            "WHAT IF EVERYTHING",

          second:
            "WAS CONNECTED?",
        };

  useEffect(() => {
    const root =
      rootRef.current;

    const copyElement =
      copyRef.current;

    if (
      !root ||
      !copyElement
    ) {
      return;
    }

    let previousProgress =
      -1;

    const update = () => {
      const progress =
        clamp01(
          progressRef.current,
        );

      if (
        Math.abs(
          progress -
          previousProgress,
        ) <
        0.00001
      ) {
        return;
      }

      previousProgress =
        progress;

      /*
       * Text starts at progress ZERO.
       *
       * The first CONTROL pixels after CHAOS already belong
       * to the question animation.
       */
      const enter =
        smootherstep(
          range(
            progress,
            CONTROL_ENTRY.textStart,
            CONTROL_ENTRY.textFull,
          ),
        );

      const dissolve =
        smootherstep(
          range(
            progress,
            CONTROL_ENTRY.dustStart,
            CONTROL_ENTRY.dustEnd,
          ),
        );

      /*
       * Question overlay remains fully opaque until dust is almost done.
       * Tunnel starts only AFTER dustEnd.
       */
      const overlayExit =
        smootherstep(
          range(
            progress,
            CONTROL_ENTRY.tunnelStart,
            CONTROL_ENTRY.tunnelReadable,
          ),
        );

      root.style.opacity =
        `${1 - overlayExit}`;

      root.style.visibility =
        overlayExit >=
        0.999
          ? "hidden"
          : "visible";

      /*
       * Long readable hold:
       *
       * enter finishes at 10%
       * dissolve only starts at 52%
       */
      copyElement.style.opacity =
        `${
          enter *
          (
            1 -
            dissolve
          )
        }`;

      copyElement.style.transform = `
        translate3d(
          0,
          calc(
            -50% +
            ${
              mix(
                12,
                0,
                enter,
              ) -
              mix(
                0,
                8,
                dissolve,
              )
            }px
          ),
          0
        )
        scale(
          ${
            mix(
              0.99,
              1,
              enter,
            )
          }
        )
      `;

      letterRefs.current.forEach(
        (
          letter,
          index,
        ) => {
          if (!letter) {
            return;
          }

          const seed =
            seeded01(
              index +
              301,
            );

          const local =
            smootherstep(
              range(
                dissolve,
                0.02 +
                  seed *
                    0.56,
                0.38 +
                  seed *
                    0.56,
              ),
            );

          const direction =
            index %
              2 ===
            0
              ? -1
              : 1;

          letter.style.opacity =
            `${1 - local}`;

          letter.style.transform = `
            translate3d(
              ${
                reducedMotion
                  ? 0
                  : direction *
                    (
                      4 +
                      seed *
                        16
                    ) *
                    local
              }px,
              ${
                reducedMotion
                  ? 0
                  : -(
                      5 +
                      seed *
                        24
                    ) *
                    local
              }px,
              0
            )
            rotate(
              ${
                reducedMotion
                  ? 0
                  : direction *
                    seed *
                    7 *
                    local
              }deg
            )
          `;
        },
      );

      dustRefs.current.forEach(
        (
          particle,
          index,
        ) => {
          if (!particle) {
            return;
          }

          const config =
            dust[
              index
            ];

          if (!config) {
            return;
          }

          const local =
            smootherstep(
              range(
                dissolve,
                config.delay,
                Math.min(
                  1,
                  config.delay +
                    0.48,
                ),
              ),
            );

          const fade =
            smootherstep(
              range(
                local,
                0.66,
                1,
              ),
            );

          particle.style.opacity =
            `${
              local *
              (
                1 -
                fade
              )
            }`;

          particle.style.transform = `
            translate3d(
              ${
                reducedMotion
                  ? config.dx *
                    0.12
                  : config.dx *
                    local
              }px,
              ${
                reducedMotion
                  ? config.dy *
                    0.12
                  : config.dy *
                    local
              }px,
              0
            )
            scale(
              ${
                mix(
                  0.42,
                  1,
                  local,
                ) *
                mix(
                  1,
                  0.1,
                  fade,
                )
              }
            )
          `;
        },
      );
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
  }, [
    dust,
    progressRef,
    reducedMotion,
  ]);

  let letterIndex =
    0;

  const letters = (
    text: string,
    accent = false,
  ) =>
    Array.from(
      text,
    ).map(
      (
        character,
      ) => {
        const index =
          letterIndex++;

        return (
          <span
            key={
              `${index}-${character}`
            }
            ref={(
              element,
            ) => {
              letterRefs.current[
                index
              ] =
                element;
            }}
            className={`
              inline-block
              will-change-[transform,opacity]
              ${
                accent
                  ? "text-[#0BA5FF]"
                  : "text-[#F4F8FB]"
              }
            `}
          >
            {
              character ===
              " "
                ? "\u00A0"
                : character
            }
          </span>
        );
      },
    );

  return (
    <div
      ref={
        rootRef
      }
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[60]
        overflow-hidden
        bg-[#0A0F14]
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_50%_48%,rgba(20,31,42,0.32),rgba(10,15,20,0.98)_52%,#06090D_100%)]
        "
      />

      <div
        ref={
          copyRef
        }
        className="
          absolute
          inset-x-0
          top-1/2
          flex
          w-full
          -translate-y-1/2
          flex-col
          items-center
          px-5
          text-center
          opacity-0
          will-change-[transform,opacity]
          sm:px-10
        "
      >
        <div
          className="
            mb-4
            font-mono
            text-[clamp(0.58rem,0.75vw,0.76rem)]
            font-bold
            uppercase
            tracking-[0.28em]
            text-[#0BA5FF]/70
          "
        >
          {
            copy.eyebrow
          }
        </div>

        <div
          className="
            mx-auto
            w-full
            max-w-[1180px]
            text-[clamp(1.75rem,4.5vw,4.45rem)]
            font-black
            uppercase
            leading-[0.92]
            tracking-[-0.055em]
          "
        >
          <div
            className="
              md:whitespace-nowrap
            "
          >
            {
              letters(
                copy.first,
              )
            }
          </div>
        </div>

        <div
          className="
            mx-auto
            mt-[0.08em]
            w-full
            max-w-[980px]
            text-[clamp(2.4rem,6vw,5.9rem)]
            font-black
            uppercase
            leading-[0.86]
            tracking-[-0.065em]
          "
        >
          <div
            className="
              md:whitespace-nowrap
            "
          >
            {
              letters(
                copy.second,
                true,
              )
            }
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[280px]
          w-[min(88vw,1120px)]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        {
          dust.map(
            (
              particle,
              index,
            ) => (
              <span
                key={
                  `dust-${index}`
                }
                ref={(
                  element,
                ) => {
                  dustRefs.current[
                    index
                  ] =
                    element;
                }}
                className={`
                  absolute
                  rounded-full
                  opacity-0
                  will-change-[transform,opacity]
                  ${
                    particle.blue
                      ? "bg-[#0BA5FF]"
                      : "bg-[#EDF5FA]"
                  }
                `}
                style={{
                  left:
                    formatPercent(
                      particle.x,
                    ),

                  top:
                    formatPercent(
                      particle.y,
                    ),

                  width:
                    formatPixels(
                      particle.size,
                    ),

                  height:
                    formatPixels(
                      particle.size,
                    ),
                }}
              />
            ),
          )
        }
      </div>
    </div>
  );
}

function createDust():
  DustParticle[] {
  return Array.from({
    length:
      DUST_COUNT,
  }).map(
    (
      _,
      index,
    ) => {
      const a =
        seeded01(
          index +
          11,
        );

      const b =
        seeded01(
          index +
          107,
        );

      const c =
        seeded01(
          index +
          211,
        );

      return {
        x:
          6 +
          a *
            88,

        y:
          index %
            4 ===
          0
            ? 34 +
              (
                b -
                0.5
              ) *
                15
            : 57 +
              (
                b -
                0.5
              ) *
                20,

        dx:
          (
            a -
            0.5
          ) *
          150,

        dy:
          -20 -
          b *
            110,

        size:
          1.4 +
          c *
            3,

        delay:
          seeded01(
            index +
            401,
          ) *
          0.52,

        blue:
          index %
            3 ===
          0,
      };
    },
  );
}

function seeded01(
  seed: number,
) {
  let value =
    seed |
    0;

  value =
    Math.imul(
      value ^
      (
        value >>>
        16
      ),
      0x45d9f3b,
    );

  value =
    Math.imul(
      value ^
      (
        value >>>
        16
      ),
      0x45d9f3b,
    );

  value =
    value ^
    (
      value >>>
      16
    );

  return (
    (
      value >>>
      0
    ) %
    10000
  ) /
  10000;
}

function formatPercent(
  value: number,
) {
  return `${
    value.toFixed(
      3,
    )
  }%`;
}

function formatPixels(
  value: number,
) {
  return `${
    value.toFixed(
      3,
    )
  }px`;
}

function mix(
  start: number,
  end: number,
  amount: number,
) {
  return (
    start +
    (
      end -
      start
    ) *
    amount
  );
}

function range(
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

function smootherstep(
  value: number,
) {
  const t =
    clamp01(
      value,
    );

  return (
    t *
    t *
    t *
    (
      t *
      (
        t *
        6 -
        15
      ) +
      10
    )
  );
}

function clamp01(
  value: number,
) {
  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}
