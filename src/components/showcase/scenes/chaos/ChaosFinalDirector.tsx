// "use client";

// import {
//   useEffect,
//   useRef,
// } from "react";

// import type {
//   MutableRefObject,
//   RefObject,
// } from "react";

// import {
//   createRoot,
//   type Root,
// } from "react-dom/client";

// import {
//   gsap,
// } from "gsap";

// import {
//   CHAOS_HOT_TOPICS,
//   type ChaosHotTopicDefinition,
// } from "@/components/showcase/scenes/chaos/chaosHotTopics";

// import {
//   ChaosHotTopicCard,
// } from "@/components/showcase/scenes/chaos/ChaosHotTopicCard";

// import {
//   CHAOS_FINAL_ACT,
// } from "@/components/showcase/scenes/chaos/chaosTimeline";

// type ChaosFinalDirectorProps = {
//   progressRef:
//     MutableRefObject<number>;

//   stageRef:
//     RefObject<HTMLElement | null>;

//   reducedMotion?: boolean;
// };

// type TopicItem = {
//   definition:
//     ChaosHotTopicDefinition;

//   sourceSignal:
//     HTMLElement;

//   sourceSurface:
//     HTMLElement;

//   sourceOpacity:
//     string;

//   host:
//     HTMLDivElement;

//   root:
//     Root;

//   startX:
//     number;

//   startY:
//     number;
// };

// export function ChaosFinalDirector({
//   progressRef,
//   stageRef,
//   reducedMotion = false,
// }: ChaosFinalDirectorProps) {
//   const root =
//     useRef<HTMLDivElement>(
//       null,
//     );

//   const topicsLayer =
//     useRef<HTMLDivElement>(
//       null,
//     );

//   const core =
//     useRef<HTMLDivElement>(
//       null,
//     );

//   useEffect(() => {
//     const rootNode =
//       root.current;

//     const topicsNode =
//       topicsLayer.current;

//     const coreNode =
//       core.current;

//     const stage =
//       stageRef.current;

//     if (
//       !rootNode ||
//       !topicsNode ||
//       !coreNode ||
//       !stage
//     ) {
//       return;
//     }

//     const rootElement =
//       rootNode;

//     const topicsElement =
//       topicsNode;

//     const coreElement =
//       coreNode;

//     const stageElement =
//       stage;

//     let topicItems:
//       TopicItem[] = [];

//     let prepared =
//       false;

//     /*
//      * ==========================================================
//      * PREPARE TOPICS
//      * ==========================================================
//      */

//     function prepareTopics() {
//       if (prepared) {
//         return;
//       }

//       cleanupTopics();

//       const stageRect =
//         stageElement
//           .getBoundingClientRect();

//       const worldSignals =
//         Array.from(
//           stageElement.querySelectorAll<HTMLElement>(
//             "[data-chaos-world-signal]",
//           ),
//         );

//       topicItems =
//         CHAOS_HOT_TOPICS
//           .map(
//             (
//               definition,
//             ) => {
//               const sourceSignal =
//                 worldSignals.find(
//                   (
//                     signal,
//                   ) => {
//                     const kind =
//                       signal.dataset
//                         .chaosKind;

//                     return (
//                       kind !==
//                         undefined &&
//                       definition
//                         .kinds
//                         .includes(
//                           kind,
//                         )
//                     );
//                   },
//                 );

//               if (
//                 !sourceSignal
//               ) {
//                 return null;
//               }

//               const sourceSurface =
//                 sourceSignal.querySelector<HTMLElement>(
//                   "[data-chaos-signal-surface]",
//                 );

//               if (
//                 !sourceSurface
//               ) {
//                 return null;
//               }

//               const rect =
//                 sourceSurface
//                   .getBoundingClientRect();

//               const startX =
//                 clamp(
//                   rect.left -
//                     stageRect.left +
//                     rect.width /
//                       2,
//                   70,
//                   stageRect.width -
//                     70,
//                 );

//               const startY =
//                 clamp(
//                   rect.top -
//                     stageRect.top +
//                     rect.height /
//                       2,
//                   100,
//                   stageRect.height -
//                     90,
//                 );

//               const host =
//                 document.createElement(
//                   "div",
//                 );

//               host.dataset
//                 .chaosFinalTopic =
//                 definition.id;

//               host.style.position =
//                 "absolute";

//               host.style.left =
//                 "0";

//               host.style.top =
//                 "0";

//               host.style.opacity =
//                 "0";

//               host.style.pointerEvents =
//                 "none";

//               host.style.willChange =
//                 "transform, opacity";

//               host.style.transformOrigin =
//                 "center";

//               topicsElement
//                 .appendChild(
//                   host,
//                 );

//               const reactRoot =
//                 createRoot(
//                   host,
//                 );

//               reactRoot.render(
//                 <ChaosHotTopicCard
//                   topic={
//                     definition
//                   }
//                 />,
//               );

//               return {
//                 definition,

//                 sourceSignal,
//                 sourceSurface,

//                 sourceOpacity:
//                   sourceSurface
//                     .style
//                     .opacity,

//                 host,

//                 root:
//                   reactRoot,

//                 startX,
//                 startY,
//               };
//             },
//           )
//           .filter(
//             (
//               item,
//             ): item is TopicItem =>
//               item !== null,
//           );

//       prepared =
//         true;
//     }

//     function cleanupTopics() {
//       topicItems.forEach(
//         (item) => {
//           item.sourceSurface.style.opacity =
//             item.sourceOpacity;

//           item.root.unmount();

//           item.host.remove();
//         },
//       );

//       topicItems = [];

//       prepared =
//         false;
//     }

//     /*
//      * ==========================================================
//      * WORLD DISTILLATION
//      * ==========================================================
//      */

//     const worldElements =
//       Array.from(
//         stageElement.querySelectorAll<HTMLElement>(
//           `
//             [data-chaos-world-signal],
//             [data-chaos-micro]
//           `,
//         ),
//       );

//     /*
//      * ==========================================================
//      * UPDATE
//      * ==========================================================
//      */

//     function update() {
//       const progress =
//         progressRef.current;

//       /*
//        * ========================================================
//        * CORE BUILD
//        * ========================================================
//        */

//       const focus =
//         smoothRange(
//           progress,
//           CHAOS_FINAL_ACT
//             .focusStart,
//           CHAOS_FINAL_ACT
//             .focusEnd,
//         );

//       /*
//        * O ponto não aparece.
//        *
//        * Ele nasce.
//        */

//       const coreScale =
//         mix(
//           0.02,
//           1,
//           smootherstep(
//             focus,
//           ),
//         );

//       const coreOpacity =
//         smoothRange(
//           focus,
//           0.18,
//           0.72,
//         );

//       coreElement.style.opacity =
//         `${coreOpacity}`;

//       coreElement.style.transform = `
//         translate3d(
//           -50%,
//           -50%,
//           0
//         )

//         scale(
//           ${coreScale}
//         )
//       `;

//       /*
//        * ========================================================
//        * DISTILLATION
//        * ========================================================
//        */

//       const distill =
//         smoothRange(
//           progress,
//           CHAOS_FINAL_ACT
//             .distillStart,
//           CHAOS_FINAL_ACT
//             .distillEnd,
//         );

//       worldElements.forEach(
//         (
//           element,
//           index,
//         ) => {
//           const wave =
//             (
//               index %
//               9
//             ) /
//             9;

//           const localFade =
//             smoothRange(
//               distill,
//               wave *
//                 0.28,
//               0.38 +
//                 wave *
//                   0.42,
//             );

//           /*
//            * Não mexemos ainda nos
//            * seis sources.
//            */

//           const isSelected =
//             topicItems.some(
//               (item) =>
//                 item.sourceSignal ===
//                 element,
//             );

//           if (
//             !isSelected
//           ) {
//             element.style.opacity =
//               `${
//                 1 -
//                 localFade
//               }`;
//           }
//         },
//       );

//       /*
//        * ========================================================
//        * PREPARE HOT TOPICS
//        * ========================================================
//        */

//       if (
//         progress >=
//         CHAOS_FINAL_ACT
//           .distillStart
//       ) {
//         if (
//           !prepared
//         ) {
//           prepareTopics();
//         }
//       } else if (
//         prepared
//       ) {
//         cleanupTopics();
//       }

//       if (
//         !prepared
//       ) {
//         return;
//       }

//       /*
//        * ========================================================
//        * MORPH
//        * ========================================================
//        */

//       const morph =
//         smoothRange(
//           progress,
//           CHAOS_FINAL_ACT
//             .hotTopicsStart,
//           CHAOS_FINAL_ACT
//             .hotTopicsEnd,
//         );

//       const stageRect =
//         stageElement
//           .getBoundingClientRect();

//       const centerX =
//         stageRect.width /
//         2;

//       const centerY =
//         stageRect.height /
//         2;

//       /*
//        * Não é uma órbita apertada.
//        *
//        * É uma composição circular
//        * editorial.
//        */

//       const radiusX =
//         Math.min(
//           390,
//           stageRect.width *
//             0.28,
//         );

//       const radiusY =
//         Math.min(
//           255,
//           stageRect.height *
//             0.27,
//         );

//       topicItems.forEach(
//         (
//           item,
//           index,
//         ) => {
//           const angle =
//             -Math.PI /
//               2 +
//             (
//               index /
//               topicItems.length
//             ) *
//               Math.PI *
//               2;

//           const targetX =
//             centerX +
//             Math.cos(
//               angle,
//             ) *
//               radiusX;

//           const targetY =
//             centerY +
//             Math.sin(
//               angle,
//             ) *
//               radiusY;

//           /*
//            * Stagger muito pequeno
//            * e suave.
//            */

//           const stagger =
//             index *
//             0.035;

//           const localMorph =
//             smoothRange(
//               morph,
//               stagger,
//               Math.min(
//                 1,
//                 0.68 +
//                   stagger,
//               ),
//             );

//           const eased =
//             smootherstep(
//               localMorph,
//             );

//           const x =
//             mix(
//               item.startX,
//               targetX,
//               eased,
//             );

//           const y =
//             mix(
//               item.startY,
//               targetY,
//               eased,
//             );

//           /*
//            * Source real vai embora
//            * enquanto o novo significado
//            * emerge.
//            */

//           const sourceFade =
//             smoothRange(
//               localMorph,
//               0.08,
//               0.46,
//             );

//           item.sourceSurface.style.opacity =
//             `${
//               1 -
//               sourceFade
//             }`;

//           /*
//            * Hot Topic entra sem pop.
//            */

//           const topicReveal =
//             smoothRange(
//               localMorph,
//               0.18,
//               0.62,
//             );

//           item.host.style.opacity =
//             `${topicReveal}`;

//           /*
//            * Começa um pouco menor,
//            * assenta no tamanho final.
//            */

//           const scale =
//             mix(
//               0.88,
//               1,
//               smootherstep(
//                 topicReveal,
//               ),
//             );

//           /*
//            * Rotação mínima.
//            *
//            * Nada de cards girando
//            * descontroladamente.
//            */

//           const rotation =
//             reducedMotion
//               ? 0
//               : mix(
//                   (
//                     index %
//                       2 ===
//                     0
//                       ? -2
//                       : 2
//                   ),
//                   0,
//                   eased,
//                 );

//           item.host.style.transform = `
//             translate3d(
//               ${
//                 x -
//                 126
//               }px,
//               ${
//                 y -
//                 59
//               }px,
//               0
//             )

//             rotate(
//               ${rotation}deg
//             )

//             scale(
//               ${scale}
//             )
//           `;
//         },
//       );
//     }

//     gsap.ticker.add(
//       update,
//     );

//     update();

//     return () => {
//       gsap.ticker.remove(
//         update,
//       );

//       cleanupTopics();

//       worldElements.forEach(
//         (element) => {
//           element.style.opacity =
//             "";
//         },
//       );
//     };
//   }, [
//     progressRef,
//     stageRef,
//     reducedMotion,
//   ]);

//   return (
//     <div
//       ref={root}
//       data-chaos-final-director
//       aria-hidden="true"
//       className="
//         pointer-events-none
//         absolute
//         inset-0
//         z-[75]
//         overflow-hidden
//       "
//     >
//       {/* HOT TOPICS */}

//       <div
//         ref={topicsLayer}
//         className="
//           absolute
//           inset-0
//         "
//       />

//       {/* CORE */}

//       <div
//         ref={core}
//         className="
//           absolute
//           left-1/2
//           top-1/2
//           z-[80]
//           h-[38px]
//           w-[38px]
//           rounded-full
//           bg-[#080A10]
//           opacity-0
//           shadow-[0_0_0_6px_rgba(255,255,255,0.95),0_0_0_8px_rgba(11,165,255,0.18),0_0_48px_rgba(11,165,255,0.14)]
//           will-change-transform
//         "
//       />
//     </div>
//   );
// }

// function mix(
//   start: number,
//   end: number,
//   progress: number,
// ) {
//   return (
//     start +
//     (
//       end -
//       start
//     ) *
//       progress
//   );
// }

// function clamp(
//   value: number,
//   min: number,
//   max: number,
// ) {
//   return Math.min(
//     max,
//     Math.max(
//       min,
//       value,
//     ),
//   );
// }

// function smoothRange(
//   progress: number,
//   start: number,
//   end: number,
// ) {
//   if (
//     progress <= start
//   ) {
//     return 0;
//   }

//   if (
//     progress >= end
//   ) {
//     return 1;
//   }

//   return (
//     progress -
//     start
//   ) /
//     (
//       end -
//       start
//     );
// }

// function smootherstep(
//   value: number,
// ) {
//   const t =
//     clamp(
//       value,
//       0,
//       1,
//     );

//   return (
//     t *
//     t *
//     t *
//     (
//       t *
//       (
//         t * 6 -
//         15
//       ) +
//       10
//     )
//   );
// }