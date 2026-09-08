"use client";

import {
    useEffect,
    useRef,
} from "react";

import {
    CHAOS_CONSUME_WINDOWS,
    CHAOS_FINAL_ACT,
} from "@/components/showcase/scenes/chaos/chaosTimeline";

import type {
    MutableRefObject,
    RefObject,
} from "react";

import {
    gsap,
} from "gsap";

import {
    useTranslations,
} from "next-intl";

import {
    CHAOS_HOT_TOPICS,
} from "@/components/showcase/scenes/chaos/chaosHotTopics";

import {
    ChaosHotTopicCard,
} from "@/components/showcase/scenes/chaos/ChaosHotTopicCard";



type ChaosFinalStageProps = {
    progressRef:
    MutableRefObject<number>;

    heavyWorldRef:
    RefObject<HTMLDivElement | null>;

    reducedMotion?: boolean;
};

const CARD_WIDTH =
    264;

const CARD_HEIGHT =
    132;

/*
* ============================================================
* FINAL RING CHOREOGRAPHY
* ============================================================
*/

/*
 * Durante a cena exclusiva
 * de Ciranda.
 *
 * 120° é bem perceptível,
 * mas ainda não vira um
 * carrossel frenético.
 */
const RING_PLAY_DEGREES =
    120;

/*
 * Durante as seis cenas de
 * resolução, o conjunto ainda
 * continua caminhando.
 *
 * Como isso acontece ao longo
 * de 600vh, continua lento.
 */
const CONSUME_RING_DEGREES =
    180;

/*
 * Os Hot Topics começam
 * bem mais afastados do centro
 * e convergem para o ring.
 */
const FORMATION_RADIUS_MULTIPLIER =
    1.5;

const TOPIC_COUNT = 6;

const CONSUME_LEAD_IN = 0.12;
const CONSUME_LEAD_OUT = 0.06;
const CONSUME_WINDOW = 1 - CONSUME_LEAD_IN - CONSUME_LEAD_OUT;




export function ChaosFinalStage({
    progressRef,
    heavyWorldRef,
    reducedMotion = false,
}: ChaosFinalStageProps) {
    /*
     * ============================================================
     * TRANSLATIONS
     * ============================================================
     */

    const t =
        useTranslations(
            "Showcase.chaos.hotTopics",
        );

    const brandT =
        useTranslations(
            "Showcase.chaos.brand",
        );

    /*
     * ============================================================
     * REFS
     * ============================================================
     */

    const root =
        useRef<HTMLDivElement>(
            null,
        );

    const core =
        useRef<HTMLDivElement>(
            null,
        );

    const halo =
        useRef<HTMLDivElement>(
            null,
        );

    const brandLockup =
        useRef<HTMLDivElement>(
            null,
        );

    const taglineRef =
        useRef<HTMLParagraphElement>(
            null,
        );

    const cardNodes =
        useRef<
            Array<
                HTMLDivElement | null
            >
        >([]);

    /*
     * ============================================================
     * EFFECT
     * ============================================================
     */

    useEffect(() => {
        /*
         * ============================================================
         * DOM REFERENCES
         * ============================================================
         */

        const rootNode =
            root.current;

        const coreNode =
            core.current;

        const haloNode =
            halo.current;

        const heavyWorldNode =
            heavyWorldRef.current;

        const brandNode =
            brandLockup.current;

        const taglineNode =
            taglineRef.current;

        /*
         * Elementos essenciais para
         * toda a animação final.
         *
         * Brand e tagline NÃO são
         * necessários para inicializar
         * o sistema inteiro.
         */

        if (
            !rootNode ||
            !coreNode ||
            !haloNode ||
            !heavyWorldNode
        ) {
            return;
        }

        /*
         * ============================================================
         * STABLE DOM ALIASES
         * ============================================================
         */

        const rootElement =
            rootNode;

        const coreElement =
            coreNode;

        const haloElement =
            haloNode;

        const heavyWorldElement =
            heavyWorldNode;

        /*
         * Esses dois podem ser null.
         *
         * A animação de Hot Topics,
         * Ciranda e Consume continua
         * funcionando mesmo assim.
         */

        const brandElement =
            brandNode;

        const taglineElement =
            taglineNode;

        /*
         * ============================================================
         * VIEWPORT CACHE
         * ============================================================
         */

        let width =
            rootElement.clientWidth;

        let height =
            rootElement.clientHeight;

        /*
         * Apenas resize atualiza
         * dimensões.
         *
         * Nada de layout-read
         * a cada frame.
         */

        const resizeObserver =
            new ResizeObserver(
                (
                    entries,
                ) => {
                    const entry =
                        entries[0];

                    if (!entry) {
                        return;
                    }

                    width =
                        entry.contentRect
                            .width;

                    height =
                        entry.contentRect
                            .height;
                },
            );

        resizeObserver.observe(
            rootElement,
        );

        function update(
            time: number,
        ) {
            const progress =
                progressRef.current;

            /*
             * ========================================================
             * CORE FORMATION
             * ========================================================
             *
             * O core começa minúsculo
             * durante o plano distante.
             */

            const focus =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT
                        .focusStart,
                    CHAOS_FINAL_ACT
                        .focusEnd,
                );

            /*
             * A câmera aproxima durante
             * a segunda cena.
             */

            const approach =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT
                        .distillStart,
                    CHAOS_FINAL_ACT
                        .distillEnd,
                );

            /*
             * Pequena semente.
             */

            const seedScale =
                mix(
                    0.04,
                    0.18,
                    smootherstep(
                        focus,
                    ),
                );

            /*
             * Durante o zoom:
             *
             * pequeno core
             * ↓
             * tamanho normal
             */

            const coreScale =
                mix(
                    seedScale,
                    1,
                    smootherstep(
                        approach,
                    ),
                );

            const coreOpacity =
                smoothRange(
                    focus,
                    0.08,
                    0.42,
                );

            /*
             * ============================================================
             * ABSORPTION PULSE
             * ============================================================
             *
             * Cada Hot Topic possui sua própria
             * janela de aproximadamente 100vh.
             *
             * Quando ele chega perto do core,
             * o núcleo reage levemente.
             */

            let absorptionPulse =
                0;

            CHAOS_CONSUME_WINDOWS.forEach(
                (
                    consumeWindow,
                ) => {
                    const local =
                        smoothRange(
                            progress,
                            consumeWindow.start,
                            consumeWindow.end,
                        );

                    /*
                     * Começa a crescer perto
                     * da chegada do card.
                     */

                    const pulseIn =
                        smootherstep(
                            smoothRange(
                                local,
                                0.78,
                                0.91,
                            ),
                        );

                    /*
                     * E volta ao tamanho normal
                     * depois da absorção.
                     */

                    const pulseOut =
                        smootherstep(
                            smoothRange(
                                local,
                                0.91,
                                1,
                            ),
                        );

                    const pulse =
                        pulseIn *
                        (
                            1 -
                            pulseOut
                        );

                    absorptionPulse =
                        Math.max(
                            absorptionPulse,
                            pulse,
                        );
                },
            );

            /*
             * O pulso aumenta o core
             * em no máximo 18%.
             */

            const finalCoreScale =
                coreScale *
                (
                    1 +
                    absorptionPulse *
                    0.18
                );

            /*
             * ============================================================
             * APPLY CORE
             * ============================================================
             */

            coreElement.style.opacity =
                `${coreOpacity}`;

            coreElement.style.transform = `
  translate3d(
    -50%,
    -50%,
    0
  )

  scale(
    ${finalCoreScale}
  )
`;



            /*
             * Halo aparece suavemente,
             * depois estabiliza.
             */

            const haloScale =
                mix(
                    0.2,
                    1,
                    smootherstep(
                        approach,
                    ),
                );

            const haloConsumeGlow =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT.consumeStart,
                    CHAOS_FINAL_ACT.consumeEnd,
                );

            const finalHaloOpacity =
                approach * 0.38 +
                haloConsumeGlow * 0.1;

            const finalHaloScale =
                haloScale +
                absorptionPulse * 0.6;

            haloElement.style.opacity =
                `${finalHaloOpacity}`;

            haloElement.style.transform = `
  translate3d(
    -50%,
    -50%,
    0
  )

  rotate(
    ${reducedMotion
                    ? 0
                    : time * 1.25
                }deg
  )

  scale(
    ${finalHaloScale}
  )
`;


            /*
             * ========================================================
             * HOT TOPICS FORMATION
             * ========================================================
             */

            const hotTopics =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT
                        .hotTopicsStart,
                    CHAOS_FINAL_ACT
                        .hotTopicsEnd,
                );


            /*
* ========================================================
* RING SETTLE
* ========================================================
*/


            /*
     * ========================================================
     * CONSUME ACT
     * ========================================================
     */


            /*
             * Pequena rotação do conjunto.
             *
             * Não é para ficar rodando muito.
             * É só uma vida sutil.
             */


            /*
             * Respiração muito leve do anel.
             */
            const ringBreath =
                reducedMotion
                    ? 0
                    : Math.sin(time * 1.6) * 6;

            /*
             * O consumo real só começa após um pequeno lead-in.
             */


            /*
             * índice do card ativo
             * durante a fase de consumo.
             */


            /*
             * progresso interno do card ativo.
             */


            /*
             * Enquanto os novos problemas
             * se materializam, o mundo antigo
             * desaparece como UMA composição.
             *
             * Não animamos 60 cards.
             */

            const worldFade =
                smootherstep(
                    smoothRange(
                        hotTopics,
                        0.04,
                        0.58,
                    ),
                );

            heavyWorldElement
                .style
                .opacity =
                `${1 -
                worldFade
                }`;

            heavyWorldElement
                .style
                .visibility =
                worldFade >=
                    0.998
                    ? "hidden"
                    : "visible";

            /*
             * Ring editorial.
             *
             * Não gira.
             */

            const centerX =
                width /
                2;

            const centerY =
                height /
                2;
            /*
             * ============================================================
             * FINAL RING GEOMETRY
             * ============================================================
             */



            /*
             * Maior que antes.
             *
             * Os cards possuem 264px
             * de largura, então precisamos
             * de espaço suficiente para
             * a composição respirar.
             */

            const ringRadius =
                Math.min(
                    360,
                    width * 0.25,
                    height * 0.39,
                );

            /*
             * ============================================================
             * RING SETTLE
             * ============================================================
             */

            const ringSettle =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT
                        .ringSettleStart,
                    CHAOS_FINAL_ACT
                        .ringSettleEnd,
                );

            /*
             * ============================================================
             * CIRANDA
             * ============================================================
             *
             * Uma cena inteira dedicada
             * a mostrar claramente:
             *
             * os seis problemas
             * orbitam o mesmo centro.
             */

            const ringPlay =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT
                        .ringPlayStart,
                    CHAOS_FINAL_ACT
                        .ringPlayEnd,
                );

            /*
             * ============================================================
             * CONSUME MASTER PROGRESS
             * ============================================================
             *
             * Seis cenas inteiras.
             */

            const consumeOverall =
                smoothRange(
                    progress,
                    CHAOS_FINAL_ACT
                        .consumeStart,
                    CHAOS_FINAL_ACT
                        .consumeEnd,
                );

            /*
             * ============================================================
             * SHARED ROTATION
             * ============================================================
             *
             * IMPORTANTE:
             *
             * isto altera a POSIÇÃO
             * dos seis cards.
             *
             * Não é rotate() no card.
             */

            const settleAngleDegrees =
                mix(
                    -10,
                    0,
                    smootherstep(
                        ringSettle,
                    ),
                );

            const playAngleDegrees =
                mix(
                    0,
                    RING_PLAY_DEGREES,
                    smootherstep(
                        ringPlay,
                    ),
                );

            /*
             * A ciranda continua durante
             * a resolução.
             *
             * Muito mais devagar:
             *
             * 180° distribuídos em
             * seis cenas.
             */

            const consumeAngleDegrees =
                mix(
                    0,
                    CONSUME_RING_DEGREES,
                    smootherstep(
                        consumeOverall,
                    ),
                );

            const sharedRingAngleDegrees =
                settleAngleDegrees +
                playAngleDegrees +
                consumeAngleDegrees;

            const sharedRingRadians =
                degreesToRadians(
                    sharedRingAngleDegrees,
                );

            /*
* ============================================================
* FINAL BRAND RESOLUTION
* ============================================================
*/

            /*
 * ============================================================
 * CORE → growCo.
 * ============================================================
 */

const coreResolve =
  smoothRange(
    progress,
    CHAOS_FINAL_ACT
      .coreResolveStart,
    CHAOS_FINAL_ACT
      .coreResolveEnd,
  );

/*
 * A logo começa a nascer ainda
 * durante Core Resolve.
 *
 * Não esperamos a última cena inteira.
 */

const logoReveal =
  smootherstep(
    smoothRange(
      coreResolve,
      0.28,
      0.82,
    ),
  );

/*
 * Tagline entra depois que a
 * marca já está claramente legível.
 */

const taglineReveal =
  smootherstep(
    smoothRange(
      coreResolve,
      0.68,
      1,
    ),
  );

/*
 * ============================================================
 * CORE COLLAPSE
 * ============================================================
 */

const coreCollapse =
  smootherstep(
    smoothRange(
      coreResolve,
      0.06,
      0.66,
    ),
  );

/*
 * O core fica primeiro mais denso,
 * depois se reduz até praticamente
 * desaparecer atrás da marca.
 */

const resolvedCoreScale =
  finalCoreScale *
  mix(
    1,
    0.08,
    coreCollapse,
  );

const resolvedCoreOpacity =
  coreOpacity *
  (
    1 -
    smootherstep(
      smoothRange(
        coreResolve,
        0.46,
        0.78,
      ),
    )
  );

coreElement.style.opacity =
  `${resolvedCoreOpacity}`;

coreElement.style.transform = `
  translate3d(
    -50%,
    -50%,
    0
  )

  scale(
    ${resolvedCoreScale}
  )
`;

/*
 * ============================================================
 * HALO COLLAPSE
 * ============================================================
 */

const haloExit =
  smootherstep(
    smoothRange(
      coreResolve,
      0.12,
      0.7,
    ),
  );

haloElement.style.opacity =
  `${
    approach *
    0.38 *
    (
      1 -
      haloExit
    )
  }`;

haloElement.style.transform = `
  translate3d(
    -50%,
    -50%,
    0
  )

  rotate(
    ${
      reducedMotion
        ? 0
        : time * 0.7
    }deg
  )

  scale(
    ${
      mix(
        haloScale,
        0.12,
        haloExit,
      )
    }
  )
`;

/*
 * ============================================================
 * LOGO REVEAL
 * ============================================================
 *
 * Pequena transformação:
 *
 * ponto
 * ↓
 * núcleo comprimido
 * ↓
 * marca cresce de dentro dele
 */

if (brandElement) {
  const logoScale =
    mix(
      0.18,
      1,
      logoReveal,
    );

  const logoY =
    mix(
      14,
      0,
      logoReveal,
    );

  brandElement.style.opacity =
    `${logoReveal}`;

  brandElement.style.transform = `
    translate3d(
      -50%,
      calc(-50% + ${logoY}px),
      0
    )

    scale(
      ${logoScale}
    )
  `;
}

/*
 * ============================================================
 * TAGLINE
 * ============================================================
 */

if (taglineElement) {
  const taglineY =
    mix(
      12,
      0,
      taglineReveal,
    );

  taglineElement.style.opacity =
    `${taglineReveal}`;

  taglineElement.style.transform = `
    translate3d(
      0,
      ${taglineY}px,
      0
    )
  `;
}


            /*
             * ============================================================
             * CARDS
             * ============================================================
             */

            cardNodes.current.forEach(
                (
                    card,
                    index,
                ) => {
                    if (!card) {
                        return;
                    }

                    /*
                     * ========================================================
                     * ORIGINAL SLOT
                     * ========================================================
                     */

                    const baseAngle =
                        -Math.PI /
                        2 +
                        (
                            index /
                            CHAOS_HOT_TOPICS.length
                        ) *
                        Math.PI *
                        2;

                    /*
                     * ========================================================
                     * CURRENT RING POSITION
                     * ========================================================
                     *
                     * Todos usam exatamente
                     * o mesmo sharedRingRadians.
                     */

                    const currentRingAngle =
                        baseAngle +
                        sharedRingRadians;

                    const ringX =
                        centerX +
                        Math.cos(
                            currentRingAngle,
                        ) *
                        ringRadius;

                    const ringY =
                        centerY +
                        Math.sin(
                            currentRingAngle,
                        ) *
                        ringRadius;

                    /*
                     * ========================================================
                     * FORMATION
                     * ========================================================
                     *
                     * Antes eles começavam
                     * DENTRO do círculo.
                     *
                     * Agora fazemos o contrário:
                     *
                     * LONGE
                     * ↓
                     * CONVERGEM
                     * ↓
                     * RING
                     */

                    const formationRadius =
                        ringRadius *
                        FORMATION_RADIUS_MULTIPLIER;

                    const formationAngle =
                        baseAngle -
                        0.08 +
                        (
                            index % 2 ===
                                0
                                ? -0.035
                                : 0.035
                        );

                    const formationStartX =
                        centerX +
                        Math.cos(
                            formationAngle,
                        ) *
                        formationRadius;

                    const formationStartY =
                        centerY +
                        Math.sin(
                            formationAngle,
                        ) *
                        formationRadius;

                    /*
                     * Entrada levemente
                     * desencontrada.
                     */

                    const formationStagger =
                        index *
                        0.045;

                    const localFormation =
                        smoothRange(
                            hotTopics,
                            formationStagger,
                            Math.min(
                                1,
                                0.7 +
                                formationStagger,
                            ),
                        );

                    const formation =
                        smootherstep(
                            localFormation,
                        );

                    const formedX =
                        mix(
                            formationStartX,
                            ringX,
                            formation,
                        );

                    const formedY =
                        mix(
                            formationStartY,
                            ringY,
                            formation,
                        );

                    const formationOpacity =
                        smoothRange(
                            localFormation,
                            0.04,
                            0.32,
                        );

                    /*
                     * ========================================================
                     * CONSUME WINDOW
                     * ========================================================
                     *
                     * Cada index possui:
                     *
                     * UMA CENA INTEIRA.
                     */

                    const consumeWindow =
                        CHAOS_CONSUME_WINDOWS[
                        index
                        ];

                    if (!consumeWindow) {
                        return;
                    }

                    const cardConsume =
                        smoothRange(
                            progress,
                            consumeWindow.start,
                            consumeWindow.end,
                        );

                    const hasStartedConsume =
                        progress >=
                        consumeWindow.start;

                    const hasFinishedConsume =
                        progress >=
                        consumeWindow.end;

                    /*
                     * ========================================================
                     * DEFAULT STATE
                     * ========================================================
                     */

                    let finalCenterX =
                        formedX;

                    let finalCenterY =
                        formedY;

                    let finalOpacity =
                        formationOpacity;

                    let finalRotation =
                        0;

                    let finalScaleX =
                        1;

                    let finalScaleY =
                        1;

                    /*
                     * ========================================================
                     * COMPLETELY CONSUMED
                     * ========================================================
                     */

                    if (
                        hasFinishedConsume
                    ) {
                        finalCenterX =
                            centerX;

                        finalCenterY =
                            centerY;

                        finalOpacity =
                            0;

                        finalScaleX =
                            0.01;

                        finalScaleY =
                            0.01;
                    }

                    /*
                     * ========================================================
                     * ACTIVE CONSUMPTION
                     * ========================================================
                     */

                    if (
                        hasStartedConsume &&
                        !hasFinishedConsume
                    ) {
                        /*
                         * ------------------------------------------------------
                         * FIXED START POSITION
                         * ------------------------------------------------------
                         *
                         * O card se desprende da
                         * posição exata que possuía
                         * no começo da sua cena.
                         *
                         * Isso evita um salto.
                         */

                        const slotStartOverall =
                            index /
                            CHAOS_HOT_TOPICS.length;

                        const consumeAngleAtStart =
                            CONSUME_RING_DEGREES *
                            smootherstep(
                                slotStartOverall,
                            );

                        const activeStartDegrees =
                            RING_PLAY_DEGREES +
                            consumeAngleAtStart;

                        const activeStartAngle =
                            baseAngle +
                            degreesToRadians(
                                activeStartDegrees,
                            );

                        const activeStartX =
                            centerX +
                            Math.cos(
                                activeStartAngle,
                            ) *
                            ringRadius;

                        const activeStartY =
                            centerY +
                            Math.sin(
                                activeStartAngle,
                            ) *
                            ringRadius;

                        /*
                         * ------------------------------------------------------
                         * TIMING INTERNO DA CENA
                         * ------------------------------------------------------
                         *
                         * 0 → 14%
                         *
                         * continua fazendo parte
                         * da ciranda.
                         *
                         *
                         * 14 → 28%
                         *
                         * ganha foco e começa
                         * a se desprender.
                         *
                         *
                         * 28 → 90%
                         *
                         * trajetória até o core.
                         *
                         *
                         * 90 → 100%
                         *
                         * horizonte / desaparece.
                         */

                        const travel =
                            smootherstep(
                                smoothRange(
                                    cardConsume,
                                    0.14,
                                    0.94,
                                ),
                            );

                        /*
                         * ------------------------------------------------------
                         * CURVED PATH
                         * ------------------------------------------------------
                         *
                         * Não damos uma volta
                         * absurda.
                         *
                         * É uma curva elegante
                         * que transforma o movimento
                         * orbital em queda radial.
                         */

                        const radialX =
                            centerX -
                            activeStartX;

                        const radialY =
                            centerY -
                            activeStartY;

                        const radialLength =
                            Math.max(
                                1,
                                Math.hypot(
                                    radialX,
                                    radialY,
                                ),
                            );

                        const radialUnitX =
                            radialX /
                            radialLength;

                        const radialUnitY =
                            radialY /
                            radialLength;

                        /*
                         * Vetor perpendicular.
                         */

                        const tangentX =
                            -radialUnitY;

                        const tangentY =
                            radialUnitX;

                        /*
                         * Alternamos levemente
                         * a direção da curva.
                         */

                        const curveDirection =
                            index %
                                2 ===
                                0
                                ? 1
                                : -1;

                        const controlDistance =
                            ringRadius *
                            0.34 *
                            curveDirection;

                        /*
                         * Control point de uma
                         * curva quadrática.
                         */

                        const controlX =
                            mix(
                                activeStartX,
                                centerX,
                                0.48,
                            ) +
                            tangentX *
                            controlDistance;

                        const controlY =
                            mix(
                                activeStartY,
                                centerY,
                                0.48,
                            ) +
                            tangentY *
                            controlDistance;

                        const curvedX =
                            quadraticBezier(
                                activeStartX,
                                controlX,
                                centerX,
                                travel,
                            );

                        const curvedY =
                            quadraticBezier(
                                activeStartY,
                                controlY,
                                centerY,
                                travel,
                            );

                        finalCenterX =
                            curvedX;

                        finalCenterY =
                            curvedY;

                        /*
                         * ------------------------------------------------------
                         * CURRENT DIRECTION
                         * ------------------------------------------------------
                         *
                         * Usamos para orientar
                         * a espaguetificação.
                         */

                        const directionToCoreX =
                            centerX -
                            curvedX;

                        const directionToCoreY =
                            centerY -
                            curvedY;

                        const directionAngle =
                            Math.atan2(
                                directionToCoreY,
                                directionToCoreX,
                            );

                        /*
                   * ------------------------------------------------------
                   * CORE COMPRESSION
                   * ------------------------------------------------------
                   *
                   * Em vez de esticar o card,
                   * ele começa praticamente intacto
                   * e vai sendo comprimido
                   * enquanto entra no núcleo.
                   */

                        const compression =
                            smootherstep(
                                smoothRange(
                                    cardConsume,
                                    0.38,
                                    0.96,
                                ),
                            );

                        /*
                         * Primeiro ele perde um pouco
                         * de tamanho de forma suave.
                         */
                        const softShrink =
                            mix(
                                1,
                                0.72,
                                compression,
                            );

                        /*
                         * Nos últimos momentos,
                         * ele colapsa rapidamente
                         * para caber dentro do core.
                         */
                        const coreCollapse =
                            mix(
                                1,
                                0.035,
                                smootherstep(
                                    smoothRange(
                                        cardConsume,
                                        0.72,
                                        1,
                                    ),
                                ),
                            );

                        /*
                         * Leve achatamento vertical
                         * próximo do horizonte.
                         *
                         * É discreto — não parece
                         * que o card está sendo esticado.
                         */
                        const verticalCompression =
                            mix(
                                1,
                                0.82,
                                smootherstep(
                                    smoothRange(
                                        cardConsume,
                                        0.55,
                                        0.9,
                                    ),
                                ),
                            );

                        finalScaleX =
                            softShrink *
                            coreCollapse;

                        finalScaleY =
                            softShrink *
                            verticalCompression *
                            coreCollapse;

                        /*
                         * Começa perfeitamente reto.
                         *
                         * Só vai se alinhando à
                         * direção do core quando
                         * a espaguetificação inicia.
                         */

                        const rotationBlend =
                            smootherstep(
                                smoothRange(
                                    cardConsume,
                                    0.48,
                                    0.9,
                                ),
                            );

                        finalRotation =
                            radiansToDegrees(
                                directionAngle,
                            ) *
                            rotationBlend;

                        /*
                         * ------------------------------------------------------
                         * VANISH
                         * ------------------------------------------------------
                         *
                         * Nada de blur caro.
                         *
                         * Apenas entra fisicamente
                         * no core e desaparece.
                         */

                        const vanish =
                            smootherstep(
                                smoothRange(
                                    cardConsume,
                                    0.88,
                                    1,
                                ),
                            );

                        finalOpacity =
                            formationOpacity *
                            (
                                1 -
                                vanish
                            );
                    }

                    /*
                     * ========================================================
                     * PIXEL ALIGNMENT
                     * ========================================================
                     */

                    const finalX =
                        Math.round(
                            finalCenterX -
                            CARD_WIDTH /
                            2,
                        );

                    const finalY =
                        Math.round(
                            finalCenterY -
                            CARD_HEIGHT /
                            2,
                        );

                    /*
                     * ========================================================
                     * APPLY
                     * ========================================================
                     */

                    card.style.opacity =
                        `${finalOpacity}`;

                    card.style.filter =
                        "none";

                    card.style.zIndex =
                        hasStartedConsume &&
                            !hasFinishedConsume
                            ? "10"
                            : "1";

                    card.style.transform = `
      translate3d(
        ${finalX}px,
        ${finalY}px,
        0
      )

      rotate(
        ${finalRotation}deg
      )

      scaleX(
        ${finalScaleX}
      )

      scaleY(
        ${finalScaleY}
      )
    `;
                },
            );

        }

        gsap.ticker.add(
            update,
        );

        update(
            0,
        );

        return () => {
            gsap.ticker.remove(
                update,
            );

            resizeObserver.disconnect();

            heavyWorldElement
                .style
                .opacity =
                "1";

            heavyWorldElement
                .style
                .visibility =
                "visible";
        };
    }, [
        progressRef,
        heavyWorldRef,
        reducedMotion,
    ]);

    return (
        <div
            ref={root}
            data-chaos-final-stage
            aria-hidden="true"
            className="
        pointer-events-none
        absolute
        inset-0
        z-[75]
        overflow-hidden
      "
        >
            {/* ================================================ */}
            {/* CORE HALO                                       */}
            {/* ================================================ */}

            <div
                ref={halo}
                className="
          absolute
          left-1/2
          top-1/2
          h-[76px]
          w-[76px]
          rounded-full
          border
          border-dashed
          border-[#0BA5FF]/45
          opacity-0
          will-change-transform
        "
            />

            {/* ================================================ */}
            {/* BLACK CORE                                      */}
            {/* ================================================ */}

            <div
                ref={core}
                className="
          absolute
      left-1/2
      top-1/2
      z-[80]
      h-[36px]
      w-[36px]
      rounded-full
      bg-[#080A10]
      opacity-0
      will-change-transform
        "
            />

            {/* ====================================================== */}
            {/* BRAND — IRMÃO DO CORE                                 */}
            {/* ====================================================== */}

            <div
                ref={brandLockup}
                className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      z-[100]
      flex
      flex-col
      items-center
      opacity-0
      will-change-[transform,opacity]
    "
            >
                <img
                    src="/brand/growco-logo.png"
                    alt="growCo."
                    draggable={false}
                    className="
        h-auto
        w-[260px]
        select-none
        md:w-[520px]
      "
                />

                <p
                    ref={taglineRef}
                    className="
        mt-5
        whitespace-nowrap
        text-center
        text-[19px]
        font-bold
        tracking-[-0.01em]
        text-[#0ba5ff]
        opacity-0
        will-change-[transform,opacity]
      "
                >
                    {brandT("tagline")}
                </p>
            </div>

            {/* ================================================ */}
            {/* PRE-EXISTING HOT TOPICS                          */}
            {/* ================================================ */}

            {CHAOS_HOT_TOPICS.map(
                (
                    topic,
                    index,
                ) => (
                    <div
                        key={topic.id}
                        ref={(element) => {
                            cardNodes.current[index] = element;
                        }}
                        data-chaos-final-topic={topic.id}
                        className="
    absolute
    left-0
    top-0
    opacity-0
    will-change-transform
    [transform-origin:center_center]
  "
                    >
                        <ChaosHotTopicCard
                            index={
                                index
                            }
                            tone={
                                topic.tone
                            }
                            eyebrow={t(
                                `${topic.translationKey}.eyebrow`,
                            )}
                            title={t(
                                `${topic.translationKey}.title`,
                            )}
                            detail={t(
                                `${topic.translationKey}.detail`,
                            )}
                        />
                    </div>
                ),
            )}
        </div>
    );
}

function mix(
    start: number,
    end: number,
    progress: number,
) {
    return (
        start +
        (
            end -
            start
        ) *
        progress
    );
}

function smoothRange(
    value: number,
    start: number,
    end: number,
) {
    if (
        value <= start
    ) {
        return 0;
    }

    if (
        value >= end
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
        Math.min(
            1,
            Math.max(
                0,
                value,
            ),
        );

    return (
        t *
        t *
        t *
        (
            t *
            (
                t * 6 -
                15
            ) +
            10
        )
    );
}

function degreesToRadians(
    degrees: number,
) {
    return (
        degrees *
        Math.PI /
        180
    );
}

function radiansToDegrees(
    radians: number,
) {
    return (
        radians *
        180 /
        Math.PI
    );
}

/*
 * Curva quadrática:
 *
 * start
 * ↓
 * control
 * ↓
 * end
 */

function quadraticBezier(
    start: number,
    control: number,
    end: number,
    progress: number,
) {
    const inverse =
        1 -
        progress;

    return (
        inverse *
        inverse *
        start +
        2 *
        inverse *
        progress *
        control +
        progress *
        progress *
        end
    );
}
