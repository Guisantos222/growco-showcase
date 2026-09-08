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
//   gsap,
// } from "gsap";

// import {
//   CHAOS_HOT_TOPICS,
// } from "@/components/showcase/scenes/chaos/chaosHotTopics";

// import {
//   CHAOS_TIMELINE as T,
// } from "@/components/showcase/scenes/chaos/chaosTimeline";

// type ChaosHotTopicTakeoverProps = {
//   progressRef:
//     MutableRefObject<number>;

//   sourceRootRef:
//     RefObject<HTMLElement | null>;

//   reducedMotion?: boolean;
// };

// type HotTopicItem = {
//   id: string;

//   source:
//     HTMLElement;

//   clone:
//     HTMLElement;

//   originalOpacity:
//     string;

//   startX: number;

//   startY: number;

//   width: number;

//   height: number;
// };

// export function ChaosHotTopicTakeover({
//   progressRef,
//   sourceRootRef,
//   reducedMotion = false,
// }: ChaosHotTopicTakeoverProps) {
//   const root =
//     useRef<HTMLDivElement>(
//       null,
//     );

//   const layer =
//     useRef<HTMLDivElement>(
//       null,
//     );

//   const itemsRef =
//     useRef<
//       HotTopicItem[]
//     >([]);

//   const capturedRef =
//     useRef(
//       false,
//     );

//   useEffect(() => {
//     const rootNode =
//       root.current;

//     const layerNode =
//       layer.current;

//     const sourceRoot =
//       sourceRootRef.current;

//     if (
//       !rootNode ||
//       !layerNode ||
//       !sourceRoot
//     ) {
//       return;
//     }

//     const rootElement:
//       HTMLDivElement =
//       rootNode;

//     const layerElement:
//       HTMLDivElement =
//       layerNode;

//     const sourceElement:
//       HTMLElement =
//       sourceRoot;

//     /*
//      * ==========================================================
//      * FIND HOT TOPICS
//      * ==========================================================
//      */

//     function findHotTopics() {
//       const worldSignals =
//         Array.from(
//           sourceElement.querySelectorAll<HTMLElement>(
//             "[data-chaos-world-signal]",
//           ),
//         );

//       return CHAOS_HOT_TOPICS
//         .map(
//           (topic) => {
//             const candidate =
//               worldSignals.find(
//                 (
//                   signal,
//                 ) => {
//                   const kind =
//                     signal.dataset
//                       .chaosKind;

//                   return (
//                     kind !==
//                       undefined &&
//                     topic.kinds.includes(
//                       kind,
//                     )
//                   );
//                 },
//               );

//             if (
//               !candidate
//             ) {
//               return null;
//             }

//             const surface =
//               candidate.querySelector<HTMLElement>(
//                 "[data-chaos-signal-surface]",
//               );

//             if (
//               !surface
//             ) {
//               return null;
//             }

//             return {
//               topic,
//               signal:
//                 candidate,
//               surface,
//             };
//           },
//         )
//         .filter(
//           (
//             result,
//           ): result is NonNullable<
//             typeof result
//           > =>
//             result !==
//             null,
//         );
//     }

//     /*
//      * ==========================================================
//      * CAPTURE
//      * ==========================================================
//      */

//     function capture() {
//       if (
//         capturedRef.current
//       ) {
//         return;
//       }

//       release();

//       const overlayRect =
//         rootElement
//           .getBoundingClientRect();

//       const selected =
//         findHotTopics();

//       const items:
//         HotTopicItem[] =
//         [];

//       selected.forEach(
//         ({
//           topic,
//           surface,
//         }) => {
//           const rect =
//             surface
//               .getBoundingClientRect();

//           /*
//            * Ignora cards completamente
//            * fora da viewport.
//            */

//           const visible =
//             rect.right >
//               overlayRect.left &&
//             rect.left <
//               overlayRect.right &&
//             rect.bottom >
//               overlayRect.top &&
//             rect.top <
//               overlayRect.bottom;

//           /*
//            * Mesmo que esteja fora da
//            * viewport, ainda queremos o
//            * hot topic.
//            *
//            * Neste caso ele nasce próximo
//            * da borda correspondente.
//            */

//           const rawX =
//             rect.left -
//             overlayRect.left +
//             rect.width /
//               2;

//           const rawY =
//             rect.top -
//             overlayRect.top +
//             rect.height /
//               2;

//           const startX =
//             visible
//               ? rawX
//               : clamp(
//                   rawX,
//                   80,
//                   overlayRect.width -
//                     80,
//                 );

//           const startY =
//             visible
//               ? rawY
//               : clamp(
//                   rawY,
//                   120,
//                   overlayRect.height -
//                     100,
//                 );

//           const clone =
//             surface.cloneNode(
//               true,
//             ) as HTMLElement;

//           clone.removeAttribute(
//             "data-chaos-signal-surface",
//           );

//           clone.setAttribute(
//             "data-chaos-hot-topic",
//             topic.id,
//           );

//           /*
//            * Performance:
//            *
//            * removemos efeitos caros.
//            */

//           clone.style.position =
//             "absolute";

//           clone.style.left =
//             "0";

//           clone.style.top =
//             "0";

//           clone.style.margin =
//             "0";

//           clone.style.width =
//             `${Math.min(
//               rect.width,
//               260,
//             )}px`;

//           clone.style.height =
//             "auto";

//           clone.style.maxWidth =
//             "none";

//           clone.style.pointerEvents =
//             "none";

//           clone.style.backdropFilter =
//             "none";

//           clone.style.filter =
//             "none";

//           clone.style.boxShadow =
//             "0 18px 55px rgba(0,0,0,0.12)";

//           clone.style.transformOrigin =
//             "center";

//           clone.style.willChange =
//             "transform, opacity";

//           clone.style.opacity =
//             "0";

//           layerElement.appendChild(
//             clone,
//           );

//           items.push({
//             id:
//               topic.id,

//             source:
//               surface,

//             clone,

//             originalOpacity:
//               surface.style
//                 .opacity,

//             startX,
//             startY,

//             width:
//               Math.min(
//                 rect.width,
//                 260,
//               ),

//             height:
//               rect.height,
//           });
//         },
//       );

//       itemsRef.current =
//         items;

//       capturedRef.current =
//         true;
//     }

//     /*
//      * ==========================================================
//      * RELEASE
//      * ==========================================================
//      */

//     function release() {
//       itemsRef.current.forEach(
//         (
//           item,
//         ) => {
//           item.source.style.opacity =
//             item.originalOpacity;

//           item.clone.remove();
//         },
//       );

//       itemsRef.current =
//         [];

//       capturedRef.current =
//         false;
//     }

//     /*
//      * ==========================================================
//      * UPDATE
//      * ==========================================================
//      */

//     function update() {
//       const progress =
//         progressRef.current;

//       /*
//        * Começamos a assumir
//        * após Chaos Maximum.
//        */

//       const takeoverStart =
//         T.orbitStart;

//       const alignmentEnd =
//         T.gravityLock;

//       if (
//         progress <
//         takeoverStart
//       ) {
//         rootElement.style.opacity =
//           "0";

//         if (
//           capturedRef.current
//         ) {
//           release();
//         }

//         return;
//       }

//       if (
//         !capturedRef.current
//       ) {
//         capture();
//       }

//       const items =
//         itemsRef.current;

//       if (
//         items.length ===
//         0
//       ) {
//         return;
//       }

//       rootElement.style.opacity =
//         "1";

//       const rootRect =
//         rootElement
//           .getBoundingClientRect();

//       const centerX =
//         rootRect.width /
//         2;

//       const centerY =
//         rootRect.height /
//         2;

//       /*
//        * ========================================================
//        * ALIGNMENT
//        * ========================================================
//        */

//       const alignment =
//         smoothRange(
//           progress,
//           takeoverStart,
//           alignmentEnd,
//         );

//       /*
//        * Um círculo grande e limpo.
//        */

//       const radius =
//         Math.min(
//           rootRect.width *
//             0.3,
//           rootRect.height *
//             0.31,
//         );

//       items.forEach(
//         (
//           item,
//           index,
//         ) => {
//           const angle =
//             -Math.PI /
//               2 +
//             index /
//               items.length *
//               Math.PI *
//               2;

//           const targetX =
//             centerX +
//             Math.cos(
//               angle,
//             ) *
//               radius;

//           const targetY =
//             centerY +
//             Math.sin(
//               angle,
//             ) *
//               radius;

//           const x =
//             mix(
//               item.startX,
//               targetX,
//               alignment,
//             );

//           const y =
//             mix(
//               item.startY,
//               targetY,
//               alignment,
//             );

//           /*
//            * Originais desaparecem
//            * rapidamente.
//            */

//           const sourceFade =
//             smoothRange(
//               alignment,
//               0,
//               0.2,
//             );

//           item.source.style.opacity =
//             `${
//               1 -
//               sourceFade
//             }`;

//           /*
//            * Clones entram rápido.
//            */

//           const cloneReveal =
//             smoothRange(
//               alignment,
//               0.03,
//               0.22,
//             );

//           item.clone.style.opacity =
//             `${cloneReveal}`;

//           const scale =
//             reducedMotion
//               ? 1
//               : mix(
//                   0.92,
//                   1,
//                   alignment,
//                 );

//           item.clone.style.transform = `
//             translate3d(
//               ${
//                 x -
//                 item.width /
//                   2
//               }px,
//               ${
//                 y -
//                 item.height /
//                   2
//               }px,
//               0
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

//       release();
//     };
//   }, [
//     progressRef,
//     sourceRootRef,
//     reducedMotion,
//   ]);

//   return (
//     <div
//       ref={root}
//       data-chaos-hot-topic-takeover
//       aria-hidden="true"
//       className="
//         pointer-events-none
//         absolute
//         inset-0
//         z-[75]
//         overflow-hidden
//         opacity-0
//       "
//     >
//       <div
//         ref={layer}
//         data-chaos-hot-topic-layer
//         className="
//           absolute
//           inset-0
//         "
//       />

//       {/* CENTER REFERENCE */}

//       <div
//         className="
//           absolute
//           left-1/2
//           top-1/2
//           h-[34px]
//           w-[34px]
//           -translate-x-1/2
//           -translate-y-1/2
//           rounded-full
//           bg-[#080A10]
//           shadow-[0_0_0_5px_rgba(255,255,255,0.9),0_0_0_7px_rgba(11,165,255,0.18)]
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
//     progress <=
//     start
//   ) {
//     return 0;
//   }

//   if (
//     progress >=
//     end
//   ) {
//     return 1;
//   }

//   const normalized =
//     (
//       progress -
//       start
//     ) /
//     (
//       end -
//       start
//     );

//   return (
//     normalized *
//     normalized *
//     (
//       3 -
//       2 *
//         normalized
//     )
//   );
// }