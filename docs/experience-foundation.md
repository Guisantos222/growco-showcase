# growCo. Experience Foundation

## Status

Experience Lab completed and frozen.

The `/lab` area exists as a technical reference for the public showcase.

New experiments should only be added when a specific production problem requires isolated validation.

---

## Core stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- GSAP
- ScrollTrigger
- Zustand
- Three.js
- React Three Fiber
- Drei
- Recharts
- Howler
- next-intl
- Zod
- React Hook Form
- Lucide

---

## Experience architecture

### Business state

Zustand stores persistent demo state:

- revenue
- stock
- goal progress
- employees
- sales
- history

### Experience events

Temporary events are handled separately:

- SALE_STARTED
- DATA_TRAVELING
- DATA_ARRIVED
- SALE_COMPLETED
- AI_INSIGHT_READY
- DEMO_RESET

### Motion

- CSS: simple UI transitions
- GSAP: timelines, DOM, SVG and scroll
- React Three Fiber: continuous spatial motion
- shaders: only when justified

---

## Visual principles

### Data in Motion

Information should have:

origin → trajectory → destination → consequence

Motion must communicate meaning.

### 3D

Prefer:

- massive forms
- matte materials
- layered composition
- spatial depth
- controlled parallax
- camera travel through layers

Avoid using generic glowing spheres as the primary visual language.

### Color

growCo. blue is primarily an accent and energy signal.

Large spatial masses should generally use restrained dark or neutral surfaces.

---

## Performance rules

DOM first.

WebGL when justified.

Use progressive quality:

- HIGH
- MEDIUM
- LOW

Respect reduced motion.

Mobile should preserve the narrative while using a less expensive choreography.

---

## Lab routes

- /lab/motion
- /lab/state
- /lab/three
- /lab/spatial-stage
- /lab/spatial-transition
- /lab/charts
- /lab/sound
- /lab/i18n
- /lab/validation
- /lab/form
- /lab/icons
- /lab/sale-propagation

---

## Production rule

The lab is now frozen.

Development continues in the public showcase.