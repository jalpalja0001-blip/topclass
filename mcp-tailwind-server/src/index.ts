#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Tailwind CSS 클래스 데이터베이스 (주요 클래스들)
const TAILWIND_CLASSES = {
  // Layout
  layout: {
    container: "container - 컨테이너 클래스, 반응형 최대 너비 설정",
    box: "box-border, box-content - 박스 모델 설정",
    display: "block, inline-block, inline, flex, inline-flex, table, inline-table, table-caption, table-cell, table-column, table-column-group, table-footer-group, table-header-group, table-row-group, table-row, flow-root, grid, inline-grid, contents, list-item, hidden",
    floats: "float-left, float-right, float-none",
    clear: "clear-left, clear-right, clear-both, clear-none",
    isolation: "isolate, isolation-auto",
    objectFit: "object-contain, object-cover, object-fill, object-none, object-scale-down",
    objectPosition: "object-bottom, object-center, object-left, object-left-bottom, object-left-top, object-right, object-right-bottom, object-right-top, object-top",
    overflow: "overflow-auto, overflow-hidden, overflow-clip, overflow-visible, overflow-scroll, overflow-x-auto, overflow-y-auto, overflow-x-hidden, overflow-y-hidden, overflow-x-clip, overflow-y-clip, overflow-x-visible, overflow-y-visible, overflow-x-scroll, overflow-y-scroll",
    overscroll: "overscroll-auto, overscroll-contain, overscroll-none, overscroll-y-auto, overscroll-y-contain, overscroll-y-none, overscroll-x-auto, overscroll-x-contain, overscroll-x-none",
    position: "static, fixed, absolute, relative, sticky",
    visibility: "visible, invisible, collapse"
  },
  
  // Flexbox & Grid
  flexbox: {
    flex: "flex-1, flex-auto, flex-initial, flex-none",
    flexDirection: "flex-row, flex-row-reverse, flex-col, flex-col-reverse",
    flexWrap: "flex-wrap, flex-wrap-reverse, flex-nowrap",
    flexGrow: "flex-grow, flex-grow-0",
    flexShrink: "flex-shrink, flex-shrink-0",
    order: "order-1, order-2, order-3, order-4, order-5, order-6, order-7, order-8, order-9, order-10, order-11, order-12, order-first, order-last, order-none",
    gridTemplateColumns: "grid-cols-1, grid-cols-2, grid-cols-3, grid-cols-4, grid-cols-5, grid-cols-6, grid-cols-7, grid-cols-8, grid-cols-9, grid-cols-10, grid-cols-11, grid-cols-12, grid-cols-none",
    gridColumn: "col-auto, col-span-1, col-span-2, col-span-3, col-span-4, col-span-5, col-span-6, col-span-7, col-span-8, col-span-9, col-span-10, col-span-11, col-span-12, col-span-full",
    gridTemplateRows: "grid-rows-1, grid-rows-2, grid-rows-3, grid-rows-4, grid-rows-5, grid-rows-6, grid-rows-none",
    gridRow: "row-auto, row-span-1, row-span-2, row-span-3, row-span-4, row-span-5, row-span-6, row-span-full",
    gap: "gap-0, gap-x-0, gap-y-0, gap-px, gap-0.5, gap-1, gap-1.5, gap-2, gap-2.5, gap-3, gap-3.5, gap-4, gap-5, gap-6, gap-7, gap-8, gap-9, gap-10, gap-11, gap-12, gap-14, gap-16, gap-20, gap-24, gap-28, gap-32, gap-36, gap-40, gap-44, gap-48, gap-52, gap-56, gap-60, gap-64, gap-72, gap-80, gap-96",
    justifyContent: "justify-normal, justify-start, justify-end, justify-center, justify-between, justify-around, justify-evenly, justify-stretch",
    justifyItems: "justify-items-start, justify-items-end, justify-items-center, justify-items-stretch",
    justifySelf: "justify-self-auto, justify-self-start, justify-self-end, justify-self-center, justify-self-stretch",
    alignContent: "content-normal, content-center, content-start, content-end, content-between, content-around, content-evenly, content-baseline, content-stretch",
    alignItems: "items-start, items-end, items-center, items-baseline, items-stretch",
    alignSelf: "self-auto, self-start, self-end, self-center, self-stretch, self-baseline",
    placeContent: "place-content-center, place-content-start, place-content-end, place-content-between, place-content-around, place-content-evenly, place-content-baseline, place-content-stretch",
    placeItems: "place-items-start, place-items-end, place-items-center, place-items-baseline, place-items-stretch",
    placeSelf: "place-self-auto, place-self-start, place-self-end, place-self-center, place-self-stretch"
  },

  // Spacing
  spacing: {
    padding: "p-0, p-px, p-0.5, p-1, p-1.5, p-2, p-2.5, p-3, p-3.5, p-4, p-5, p-6, p-7, p-8, p-9, p-10, p-11, p-12, p-14, p-16, p-20, p-24, p-28, p-32, p-36, p-40, p-44, p-48, p-52, p-56, p-60, p-64, p-72, p-80, p-96",
    margin: "m-0, m-px, m-0.5, m-1, m-1.5, m-2, m-2.5, m-3, m-3.5, m-4, m-5, m-6, m-7, m-8, m-9, m-10, m-11, m-12, m-14, m-16, m-20, m-24, m-28, m-32, m-36, m-40, m-44, m-48, m-52, m-56, m-60, m-64, m-72, m-80, m-96, m-auto",
    spaceX: "space-x-0, space-x-0.5, space-x-1, space-x-1.5, space-x-2, space-x-2.5, space-x-3, space-x-3.5, space-x-4, space-x-5, space-x-6, space-x-7, space-x-8, space-x-9, space-x-10, space-x-11, space-x-12, space-x-14, space-x-16, space-x-20, space-x-24, space-x-28, space-x-32, space-x-36, space-x-40, space-x-44, space-x-48, space-x-52, space-x-56, space-x-60, space-x-64, space-x-72, space-x-80, space-x-96, space-x-px, space-x-reverse",
    spaceY: "space-y-0, space-y-0.5, space-y-1, space-y-1.5, space-y-2, space-y-2.5, space-y-3, space-y-3.5, space-y-4, space-y-5, space-y-6, space-y-7, space-y-8, space-y-9, space-y-10, space-y-11, space-y-12, space-y-14, space-y-16, space-y-20, space-y-24, space-y-28, space-y-32, space-y-36, space-y-40, space-y-44, space-y-48, space-y-52, space-y-56, space-y-60, space-y-64, space-y-72, space-y-80, space-y-96, space-y-px, space-y-reverse"
  },

  // Sizing
  sizing: {
    width: "w-0, w-px, w-0.5, w-1, w-1.5, w-2, w-2.5, w-3, w-3.5, w-4, w-5, w-6, w-7, w-8, w-9, w-10, w-11, w-12, w-14, w-16, w-20, w-24, w-28, w-32, w-36, w-40, w-44, w-48, w-52, w-56, w-60, w-64, w-72, w-80, w-96, w-auto, w-1/2, w-1/3, w-2/3, w-1/4, w-2/4, w-3/4, w-1/5, w-2/5, w-3/5, w-4/5, w-1/6, w-2/6, w-3/6, w-4/6, w-5/6, w-1/12, w-2/12, w-3/12, w-4/12, w-5/12, w-6/12, w-7/12, w-8/12, w-9/12, w-10/12, w-11/12, w-full, w-screen, w-svw, w-lvw, w-dvw, w-min, w-max, w-fit",
    height: "h-0, h-px, h-0.5, h-1, h-1.5, h-2, h-2.5, h-3, h-3.5, h-4, h-5, h-6, h-7, h-8, h-9, h-10, h-11, h-12, h-14, h-16, h-20, h-24, h-28, h-32, h-36, h-40, h-44, h-48, h-52, h-56, h-60, h-64, h-72, h-80, h-96, h-auto, h-1/2, h-1/3, h-2/3, h-1/4, h-2/4, h-3/4, h-1/5, h-2/5, h-3/5, h-4/5, h-1/6, h-2/6, h-3/6, h-4/6, h-5/6, h-full, h-screen, h-svh, h-lvh, h-dvh, h-min, h-max, h-fit"
  },

  // Typography
  typography: {
    fontFamily: "font-sans, font-serif, font-mono",
    fontSize: "text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl, text-6xl, text-7xl, text-8xl, text-9xl",
    fontWeight: "font-thin, font-extralight, font-light, font-normal, font-medium, font-semibold, font-bold, font-extrabold, font-black",
    letterSpacing: "tracking-tighter, tracking-tight, tracking-normal, tracking-wide, tracking-wider, tracking-widest",
    lineHeight: "leading-3, leading-4, leading-5, leading-6, leading-7, leading-8, leading-9, leading-10, leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed, leading-loose",
    listStyleType: "list-none, list-disc, list-decimal",
    listStylePosition: "list-inside, list-outside",
    textAlign: "text-left, text-center, text-right, text-justify, text-start, text-end",
    textColor: "text-inherit, text-current, text-transparent, text-black, text-white, text-slate-50, text-slate-100, text-slate-200, text-slate-300, text-slate-400, text-slate-500, text-slate-600, text-slate-700, text-slate-800, text-slate-900, text-slate-950, text-gray-50, text-gray-100, text-gray-200, text-gray-300, text-gray-400, text-gray-500, text-gray-600, text-gray-700, text-gray-800, text-gray-900, text-gray-950, text-zinc-50, text-zinc-100, text-zinc-200, text-zinc-300, text-zinc-400, text-zinc-500, text-zinc-600, text-zinc-700, text-zinc-800, text-zinc-900, text-zinc-950, text-neutral-50, text-neutral-100, text-neutral-200, text-neutral-300, text-neutral-400, text-neutral-500, text-neutral-600, text-neutral-700, text-neutral-800, text-neutral-900, text-neutral-950, text-stone-50, text-stone-100, text-stone-200, text-stone-300, text-stone-400, text-stone-500, text-stone-600, text-stone-700, text-stone-800, text-stone-900, text-stone-950, text-red-50, text-red-100, text-red-200, text-red-300, text-red-400, text-red-500, text-red-600, text-red-700, text-red-800, text-red-900, text-red-950, text-orange-50, text-orange-100, text-orange-200, text-orange-300, text-orange-400, text-orange-500, text-orange-600, text-orange-700, text-orange-800, text-orange-900, text-orange-950, text-amber-50, text-amber-100, text-amber-200, text-amber-300, text-amber-400, text-amber-500, text-amber-600, text-amber-700, text-amber-800, text-amber-900, text-amber-950, text-yellow-50, text-yellow-100, text-yellow-200, text-yellow-300, text-yellow-400, text-yellow-500, text-yellow-600, text-yellow-700, text-yellow-800, text-yellow-900, text-yellow-950, text-lime-50, text-lime-100, text-lime-200, text-lime-300, text-lime-400, text-lime-500, text-lime-600, text-lime-700, text-lime-800, text-lime-900, text-lime-950, text-green-50, text-green-100, text-green-200, text-green-300, text-green-400, text-green-500, text-green-600, text-green-700, text-green-800, text-green-900, text-green-950, text-emerald-50, text-emerald-100, text-emerald-200, text-emerald-300, text-emerald-400, text-emerald-500, text-emerald-600, text-emerald-700, text-emerald-800, text-emerald-900, text-emerald-950, text-teal-50, text-teal-100, text-teal-200, text-teal-300, text-teal-400, text-teal-500, text-teal-600, text-teal-700, text-teal-800, text-teal-900, text-teal-950, text-cyan-50, text-cyan-100, text-cyan-200, text-cyan-300, text-cyan-400, text-cyan-500, text-cyan-600, text-cyan-700, text-cyan-800, text-cyan-900, text-cyan-950, text-sky-50, text-sky-100, text-sky-200, text-sky-300, text-sky-400, text-sky-500, text-sky-600, text-sky-700, text-sky-800, text-sky-900, text-sky-950, text-blue-50, text-blue-100, text-blue-200, text-blue-300, text-blue-400, text-blue-500, text-blue-600, text-blue-700, text-blue-800, text-blue-900, text-blue-950, text-indigo-50, text-indigo-100, text-indigo-200, text-indigo-300, text-indigo-400, text-indigo-500, text-indigo-600, text-indigo-700, text-indigo-800, text-indigo-900, text-indigo-950, text-violet-50, text-violet-100, text-violet-200, text-violet-300, text-violet-400, text-violet-500, text-violet-600, text-violet-700, text-violet-800, text-violet-900, text-violet-950, text-purple-50, text-purple-100, text-purple-200, text-purple-300, text-purple-400, text-purple-500, text-purple-600, text-purple-700, text-purple-800, text-purple-900, text-purple-950, text-fuchsia-50, text-fuchsia-100, text-fuchsia-200, text-fuchsia-300, text-fuchsia-400, text-fuchsia-500, text-fuchsia-600, text-fuchsia-700, text-fuchsia-800, text-fuchsia-900, text-fuchsia-950, text-pink-50, text-pink-100, text-pink-200, text-pink-300, text-pink-400, text-pink-500, text-pink-600, text-pink-700, text-pink-800, text-pink-900, text-pink-950, text-rose-50, text-rose-100, text-rose-200, text-rose-300, text-rose-400, text-rose-500, text-rose-600, text-rose-700, text-rose-800, text-rose-900, text-rose-950",
    textDecoration: "underline, overline, line-through, no-underline",
    textDecorationColor: "decoration-inherit, decoration-current, decoration-transparent, decoration-black, decoration-white",
    textDecorationStyle: "decoration-solid, decoration-double, decoration-dotted, decoration-dashed, decoration-wavy",
    textDecorationThickness: "decoration-auto, decoration-from-font, decoration-0, decoration-1, decoration-2, decoration-4, decoration-8",
    textUnderlineOffset: "underline-offset-auto, underline-offset-0, underline-offset-1, underline-offset-2, underline-offset-4, underline-offset-8",
    textTransform: "uppercase, lowercase, capitalize, normal-case",
    textOverflow: "truncate, text-ellipsis, text-clip",
    textWrap: "text-wrap, text-nowrap, text-balance, text-pretty",
    textIndent: "indent-0, indent-px, indent-0.5, indent-1, indent-1.5, indent-2, indent-2.5, indent-3, indent-3.5, indent-4, indent-5, indent-6, indent-7, indent-8, indent-9, indent-10, indent-11, indent-12, indent-14, indent-16, indent-20, indent-24, indent-28, indent-32, indent-36, indent-40, indent-44, indent-48, indent-52, indent-56, indent-60, indent-64, indent-72, indent-80, indent-96",
    verticalAlign: "align-baseline, align-top, align-middle, align-bottom, align-text-top, align-text-bottom, align-sub, align-super",
    whitespace: "whitespace-normal, whitespace-nowrap, whitespace-pre, whitespace-pre-line, whitespace-pre-wrap, whitespace-break-spaces",
    wordBreak: "break-normal, break-words, break-all, break-keep",
    hyphens: "hyphens-none, hyphens-manual, hyphens-auto",
    content: "content-none"
  },

  // Backgrounds
  backgrounds: {
    backgroundColor: "bg-inherit, bg-current, bg-transparent, bg-black, bg-white, bg-slate-50, bg-slate-100, bg-slate-200, bg-slate-300, bg-slate-400, bg-slate-500, bg-slate-600, bg-slate-700, bg-slate-800, bg-slate-900, bg-slate-950, bg-gray-50, bg-gray-100, bg-gray-200, bg-gray-300, bg-gray-400, bg-gray-500, bg-gray-600, bg-gray-700, bg-gray-800, bg-gray-900, bg-gray-950",
    backgroundOpacity: "bg-opacity-0, bg-opacity-5, bg-opacity-10, bg-opacity-20, bg-opacity-25, bg-opacity-30, bg-opacity-40, bg-opacity-50, bg-opacity-60, bg-opacity-70, bg-opacity-75, bg-opacity-80, bg-opacity-90, bg-opacity-95, bg-opacity-100",
    backgroundImage: "bg-none, bg-gradient-to-t, bg-gradient-to-tr, bg-gradient-to-r, bg-gradient-to-br, bg-gradient-to-b, bg-gradient-to-bl, bg-gradient-to-l, bg-gradient-to-tl",
    gradientColorStops: "from-inherit, from-current, from-transparent, from-black, from-white, via-inherit, via-current, via-transparent, via-black, via-white, to-inherit, to-current, to-transparent, to-black, to-white",
    backgroundSize: "bg-auto, bg-cover, bg-contain",
    backgroundPosition: "bg-bottom, bg-center, bg-left, bg-left-bottom, bg-left-top, bg-right, bg-right-bottom, bg-right-top, bg-top",
    backgroundRepeat: "bg-repeat, bg-no-repeat, bg-repeat-x, bg-repeat-y, bg-repeat-round, bg-repeat-space",
    backgroundAttachment: "bg-fixed, bg-local, bg-scroll",
    backgroundClip: "bg-clip-border, bg-clip-padding, bg-clip-content, bg-clip-text",
    backgroundOrigin: "bg-origin-border, bg-origin-padding, bg-origin-content"
  },

  // Borders
  borders: {
    borderRadius: "rounded-none, rounded-sm, rounded, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl, rounded-full",
    borderWidth: "border-0, border-2, border-4, border-8, border, border-x, border-y, border-s, border-e, border-t, border-r, border-b, border-l",
    borderColor: "border-inherit, border-current, border-transparent, border-black, border-white, border-slate-50, border-slate-100, border-slate-200, border-slate-300, border-slate-400, border-slate-500, border-slate-600, border-slate-700, border-slate-800, border-slate-900, border-slate-950",
    borderOpacity: "border-opacity-0, border-opacity-5, border-opacity-10, border-opacity-20, border-opacity-25, border-opacity-30, border-opacity-40, border-opacity-50, border-opacity-60, border-opacity-70, border-opacity-75, border-opacity-80, border-opacity-90, border-opacity-95, border-opacity-100",
    borderStyle: "border-solid, border-dashed, border-dotted, border-double, border-hidden, border-none",
    divideWidth: "divide-x-0, divide-x-2, divide-x-4, divide-x-8, divide-x, divide-y-0, divide-y-2, divide-y-4, divide-y-8, divide-y, divide-x-reverse, divide-y-reverse",
    divideColor: "divide-inherit, divide-current, divide-transparent, divide-black, divide-white",
    divideOpacity: "divide-opacity-0, divide-opacity-5, divide-opacity-10, divide-opacity-20, divide-opacity-25, divide-opacity-30, divide-opacity-40, divide-opacity-50, divide-opacity-60, divide-opacity-70, divide-opacity-75, divide-opacity-80, divide-opacity-90, divide-opacity-95, divide-opacity-100",
    divideStyle: "divide-solid, divide-dashed, divide-dotted, divide-double, divide-none",
    outlineWidth: "outline-0, outline-1, outline-2, outline-4, outline-8",
    outlineColor: "outline-inherit, outline-current, outline-transparent, outline-black, outline-white",
    outlineStyle: "outline-none, outline, outline-dashed, outline-dotted, outline-double",
    outlineOffset: "outline-offset-0, outline-offset-1, outline-offset-2, outline-offset-4, outline-offset-8",
    ringWidth: "ring-0, ring-1, ring-2, ring, ring-4, ring-8, ring-inset",
    ringColor: "ring-inherit, ring-current, ring-transparent, ring-black, ring-white",
    ringOpacity: "ring-opacity-0, ring-opacity-5, ring-opacity-10, ring-opacity-20, ring-opacity-25, ring-opacity-30, ring-opacity-40, ring-opacity-50, ring-opacity-60, ring-opacity-70, ring-opacity-75, ring-opacity-80, ring-opacity-90, ring-opacity-95, ring-opacity-100",
    ringOffsetWidth: "ring-offset-0, ring-offset-1, ring-offset-2, ring-offset-4, ring-offset-8",
    ringOffsetColor: "ring-offset-inherit, ring-offset-current, ring-offset-transparent, ring-offset-black, ring-offset-white"
  },

  // Effects
  effects: {
    boxShadow: "shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-inner, shadow-none",
    boxShadowColor: "shadow-inherit, shadow-current, shadow-transparent, shadow-black, shadow-white",
    opacity: "opacity-0, opacity-5, opacity-10, opacity-20, opacity-25, opacity-30, opacity-40, opacity-50, opacity-60, opacity-70, opacity-75, opacity-80, opacity-90, opacity-95, opacity-100",
    mixBlendMode: "mix-blend-normal, mix-blend-multiply, mix-blend-screen, mix-blend-overlay, mix-blend-darken, mix-blend-lighten, mix-blend-color-dodge, mix-blend-color-burn, mix-blend-hard-light, mix-blend-soft-light, mix-blend-difference, mix-blend-exclusion, mix-blend-hue, mix-blend-saturation, mix-blend-color, mix-blend-luminosity, mix-blend-plus-darker, mix-blend-plus-lighter",
    backgroundBlendMode: "bg-blend-normal, bg-blend-multiply, bg-blend-screen, bg-blend-overlay, bg-blend-darken, bg-blend-lighten, bg-blend-color-dodge, bg-blend-color-burn, bg-blend-hard-light, bg-blend-soft-light, bg-blend-difference, bg-blend-exclusion, bg-blend-hue, bg-blend-saturation, bg-blend-color, bg-blend-luminosity"
  },

  // Filters
  filters: {
    blur: "blur-none, blur-sm, blur, blur-md, blur-lg, blur-xl, blur-2xl, blur-3xl",
    brightness: "brightness-0, brightness-50, brightness-75, brightness-90, brightness-95, brightness-100, brightness-105, brightness-110, brightness-125, brightness-150, brightness-200",
    contrast: "contrast-0, contrast-50, contrast-75, contrast-100, contrast-125, contrast-150, contrast-200",
    dropShadow: "drop-shadow-sm, drop-shadow, drop-shadow-md, drop-shadow-lg, drop-shadow-xl, drop-shadow-2xl, drop-shadow-none",
    grayscale: "grayscale-0, grayscale",
    hueRotate: "hue-rotate-0, hue-rotate-15, hue-rotate-30, hue-rotate-60, hue-rotate-90, hue-rotate-180",
    invert: "invert-0, invert",
    saturate: "saturate-0, saturate-50, saturate-100, saturate-150, saturate-200",
    sepia: "sepia-0, sepia",
    backdropBlur: "backdrop-blur-none, backdrop-blur-sm, backdrop-blur, backdrop-blur-md, backdrop-blur-lg, backdrop-blur-xl, backdrop-blur-2xl, backdrop-blur-3xl",
    backdropBrightness: "backdrop-brightness-0, backdrop-brightness-50, backdrop-brightness-75, backdrop-brightness-90, backdrop-brightness-95, backdrop-brightness-100, backdrop-brightness-105, backdrop-brightness-110, backdrop-brightness-125, backdrop-brightness-150, backdrop-brightness-200",
    backdropContrast: "backdrop-contrast-0, backdrop-contrast-50, backdrop-contrast-75, backdrop-contrast-100, backdrop-contrast-125, backdrop-contrast-150, backdrop-contrast-200",
    backdropGrayscale: "backdrop-grayscale-0, backdrop-grayscale",
    backdropHueRotate: "backdrop-hue-rotate-0, backdrop-hue-rotate-15, backdrop-hue-rotate-30, backdrop-hue-rotate-60, backdrop-hue-rotate-90, backdrop-hue-rotate-180",
    backdropInvert: "backdrop-invert-0, backdrop-invert",
    backdropOpacity: "backdrop-opacity-0, backdrop-opacity-5, backdrop-opacity-10, backdrop-opacity-20, backdrop-opacity-25, backdrop-opacity-30, backdrop-opacity-40, backdrop-opacity-50, backdrop-opacity-60, backdrop-opacity-70, backdrop-opacity-75, backdrop-opacity-80, backdrop-opacity-90, backdrop-opacity-95, backdrop-opacity-100",
    backdropSaturate: "backdrop-saturate-0, backdrop-saturate-50, backdrop-saturate-100, backdrop-saturate-150, backdrop-saturate-200",
    backdropSepia: "backdrop-sepia-0, backdrop-sepia"
  },

  // Tables
  tables: {
    borderCollapse: "border-collapse, border-separate",
    borderSpacing: "border-spacing-0, border-spacing-x-0, border-spacing-y-0, border-spacing-px, border-spacing-0.5, border-spacing-1, border-spacing-1.5, border-spacing-2, border-spacing-2.5, border-spacing-3, border-spacing-3.5, border-spacing-4, border-spacing-5, border-spacing-6, border-spacing-7, border-spacing-8, border-spacing-9, border-spacing-10, border-spacing-11, border-spacing-12, border-spacing-14, border-spacing-16, border-spacing-20, border-spacing-24, border-spacing-28, border-spacing-32, border-spacing-36, border-spacing-40, border-spacing-44, border-spacing-48, border-spacing-52, border-spacing-56, border-spacing-60, border-spacing-64, border-spacing-72, border-spacing-80, border-spacing-96",
    tableLayout: "table-auto, table-fixed",
    captionSide: "caption-top, caption-bottom"
  },

  // Transitions & Animation
  transitionsAnimation: {
    transitionProperty: "transition-none, transition-all, transition, transition-colors, transition-opacity, transition-shadow, transition-transform",
    transitionDuration: "duration-75, duration-100, duration-150, duration-200, duration-300, duration-500, duration-700, duration-1000",
    transitionTimingFunction: "ease-linear, ease-in, ease-out, ease-in-out",
    transitionDelay: "delay-75, delay-100, delay-150, delay-200, delay-300, delay-500, delay-700, delay-1000",
    animation: "animate-none, animate-spin, animate-ping, animate-pulse, animate-bounce"
  },

  // Transforms
  transforms: {
    scale: "scale-0, scale-x-0, scale-y-0, scale-50, scale-x-50, scale-y-50, scale-75, scale-x-75, scale-y-75, scale-90, scale-x-90, scale-y-90, scale-95, scale-x-95, scale-y-95, scale-100, scale-x-100, scale-y-100, scale-105, scale-x-105, scale-y-105, scale-110, scale-x-110, scale-y-110, scale-125, scale-x-125, scale-y-125, scale-150, scale-x-150, scale-y-150",
    rotate: "rotate-0, rotate-1, rotate-2, rotate-3, rotate-6, rotate-12, rotate-45, rotate-90, rotate-180, -rotate-180, -rotate-90, -rotate-45, -rotate-12, -rotate-6, -rotate-3, -rotate-2, -rotate-1",
    translate: "translate-x-0, translate-y-0, translate-x-px, translate-y-px, translate-x-0.5, translate-y-0.5, translate-x-1, translate-y-1, translate-x-1.5, translate-y-1.5, translate-x-2, translate-y-2, translate-x-2.5, translate-y-2.5, translate-x-3, translate-y-3, translate-x-3.5, translate-y-3.5, translate-x-4, translate-y-4, translate-x-5, translate-y-5, translate-x-6, translate-y-6, translate-x-7, translate-y-7, translate-x-8, translate-y-8, translate-x-9, translate-y-9, translate-x-10, translate-y-10, translate-x-11, translate-y-11, translate-x-12, translate-y-12, translate-x-14, translate-y-14, translate-x-16, translate-y-16, translate-x-20, translate-y-20, translate-x-24, translate-y-24, translate-x-28, translate-y-28, translate-x-32, translate-y-32, translate-x-36, translate-y-36, translate-x-40, translate-y-40, translate-x-44, translate-y-44, translate-x-48, translate-y-48, translate-x-52, translate-y-52, translate-x-56, translate-y-56, translate-x-60, translate-y-60, translate-x-64, translate-y-64, translate-x-72, translate-y-72, translate-x-80, translate-y-80, translate-x-96, translate-y-96, translate-x-1/2, translate-x-1/3, translate-x-2/3, translate-x-1/4, translate-x-2/4, translate-x-3/4, translate-x-full, translate-y-1/2, translate-y-1/3, translate-y-2/3, translate-y-1/4, translate-y-2/4, translate-y-3/4, translate-y-full",
    skew: "skew-x-0, skew-y-0, skew-x-1, skew-y-1, skew-x-2, skew-y-2, skew-x-3, skew-y-3, skew-x-6, skew-y-6, skew-x-12, skew-y-12, -skew-x-12, -skew-y-12, -skew-x-6, -skew-y-6, -skew-x-3, -skew-y-3, -skew-x-2, -skew-y-2, -skew-x-1, -skew-y-1",
    transformOrigin: "origin-center, origin-top, origin-top-right, origin-right, origin-bottom-right, origin-bottom, origin-bottom-left, origin-left, origin-top-left"
  },

  // Interactivity
  interactivity: {
    accentColor: "accent-inherit, accent-current, accent-transparent, accent-black, accent-white",
    appearance: "appearance-none, appearance-auto",
    cursor: "cursor-auto, cursor-default, cursor-pointer, cursor-wait, cursor-text, cursor-move, cursor-help, cursor-not-allowed, cursor-none, cursor-context-menu, cursor-progress, cursor-cell, cursor-crosshair, cursor-vertical-text, cursor-alias, cursor-copy, cursor-no-drop, cursor-grab, cursor-grabbing, cursor-all-scroll, cursor-col-resize, cursor-row-resize, cursor-n-resize, cursor-e-resize, cursor-s-resize, cursor-w-resize, cursor-ne-resize, cursor-nw-resize, cursor-se-resize, cursor-sw-resize, cursor-ew-resize, cursor-ns-resize, cursor-nesw-resize, cursor-nwse-resize, cursor-zoom-in, cursor-zoom-out",
    caretColor: "caret-inherit, caret-current, caret-transparent, caret-black, caret-white",
    pointerEvents: "pointer-events-none, pointer-events-auto",
    resize: "resize-none, resize-y, resize-x, resize",
    scrollBehavior: "scroll-auto, scroll-smooth",
    scrollMargin: "scroll-m-0, scroll-mx-0, scroll-my-0, scroll-ms-0, scroll-me-0, scroll-mt-0, scroll-mr-0, scroll-mb-0, scroll-ml-0, scroll-m-px, scroll-m-0.5, scroll-m-1, scroll-m-1.5, scroll-m-2, scroll-m-2.5, scroll-m-3, scroll-m-3.5, scroll-m-4, scroll-m-5, scroll-m-6, scroll-m-7, scroll-m-8, scroll-m-9, scroll-m-10, scroll-m-11, scroll-m-12, scroll-m-14, scroll-m-16, scroll-m-20, scroll-m-24, scroll-m-28, scroll-m-32, scroll-m-36, scroll-m-40, scroll-m-44, scroll-m-48, scroll-m-52, scroll-m-56, scroll-m-60, scroll-m-64, scroll-m-72, scroll-m-80, scroll-m-96",
    scrollPadding: "scroll-p-0, scroll-px-0, scroll-py-0, scroll-ps-0, scroll-pe-0, scroll-pt-0, scroll-pr-0, scroll-pb-0, scroll-pl-0, scroll-p-px, scroll-p-0.5, scroll-p-1, scroll-p-1.5, scroll-p-2, scroll-p-2.5, scroll-p-3, scroll-p-3.5, scroll-p-4, scroll-p-5, scroll-p-6, scroll-p-7, scroll-p-8, scroll-p-9, scroll-p-10, scroll-p-11, scroll-p-12, scroll-p-14, scroll-p-16, scroll-p-20, scroll-p-24, scroll-p-28, scroll-p-32, scroll-p-36, scroll-p-40, scroll-p-44, scroll-p-48, scroll-p-52, scroll-p-56, scroll-p-60, scroll-p-64, scroll-p-72, scroll-p-80, scroll-p-96",
    scrollSnapAlign: "snap-start, snap-end, snap-center, snap-align-none",
    scrollSnapStop: "snap-normal, snap-always",
    scrollSnapType: "snap-none, snap-x, snap-y, snap-both, snap-mandatory, snap-proximity",
    touchAction: "touch-auto, touch-none, touch-pan-x, touch-pan-left, touch-pan-right, touch-pan-y, touch-pan-up, touch-pan-down, touch-pinch-zoom, touch-manipulation",
    userSelect: "select-none, select-text, select-all, select-auto",
    willChange: "will-change-auto, will-change-scroll, will-change-contents, will-change-transform"
  }
};

// Tailwind 컴포넌트 예제들
const COMPONENT_EXAMPLES = {
  button: `<!-- 기본 버튼 -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>

<!-- 아웃라인 버튼 -->
<button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
  Button
</button>

<!-- 작은 버튼 -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded">
  Button
</button>`,

  card: `<!-- 기본 카드 -->
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
  </div>
</div>`,

  navbar: `<!-- 네비게이션 바 -->
<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <img class="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow">
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a href="#" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Team</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Projects</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>`,

  form: `<!-- 폼 예제 -->
<form class="w-full max-w-sm">
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
        Full Name
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" value="Jane Doe">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-password">
        Password
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-password" type="password" placeholder="******************">
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
        Sign Up
      </button>
    </div>
  </div>
</form>`,

  grid: `<!-- 그리드 레이아웃 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold mb-2">Card 1</h3>
    <p class="text-gray-600">Content for card 1</p>
  </div>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold mb-2">Card 2</h3>
    <p class="text-gray-600">Content for card 2</p>
  </div>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold mb-2">Card 3</h3>
    <p class="text-gray-600">Content for card 3</p>
  </div>
</div>`,

  modal: `<!-- 모달 -->
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    <div class="mt-3 text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="text-lg leading-6 font-medium text-gray-900">Successful!</h3>
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-500">Account has been successfully registered!</p>
      </div>
      <div class="items-center px-4 py-3">
        <button id="ok-btn" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-hover hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
          OK
        </button>
      </div>
    </div>
  </div>
</div>`
};

class TailwindMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'tailwind-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_tailwind_classes',
          description: 'Tailwind CSS 클래스를 카테고리별로 검색합니다',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: ['layout', 'flexbox', 'spacing', 'sizing', 'typography', 'backgrounds', 'borders', 'effects', 'filters', 'tables', 'transitionsAnimation', 'transforms', 'interactivity', 'all'],
                description: '검색할 Tailwind 클래스 카테고리'
              },
              query: {
                type: 'string',
                description: '특정 클래스나 속성을 검색할 쿼리 (선택사항)'
              }
            },
            required: ['category']
          }
        },
        {
          name: 'get_component_example',
          description: 'Tailwind CSS로 만든 컴포넌트 예제를 제공합니다',
          inputSchema: {
            type: 'object',
            properties: {
              component: {
                type: 'string',
                enum: ['button', 'card', 'navbar', 'form', 'grid', 'modal'],
                description: '가져올 컴포넌트 타입'
              }
            },
            required: ['component']
          }
        },
        {
          name: 'explain_tailwind_class',
          description: 'Tailwind CSS 클래스의 의미와 사용법을 설명합니다',
          inputSchema: {
            type: 'object',
            properties: {
              className: {
                type: 'string',
                description: '설명할 Tailwind 클래스명'
              }
            },
            required: ['className']
          }
        },
        {
          name: 'generate_tailwind_component',
          description: '요청에 따라 Tailwind CSS 컴포넌트를 생성합니다',
          inputSchema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: '만들고 싶은 컴포넌트에 대한 설명'
              },
              type: {
                type: 'string',
                enum: ['button', 'card', 'form', 'layout', 'navigation', 'modal', 'other'],
                description: '컴포넌트 타입'
              }
            },
            required: ['description', 'type']
          }
        },
        {
          name: 'get_responsive_classes',
          description: 'Tailwind CSS 반응형 클래스 정보를 제공합니다',
          inputSchema: {
            type: 'object',
            properties: {
              baseClass: {
                type: 'string',
                description: '반응형 버전을 알고 싶은 기본 클래스'
              }
            },
            required: ['baseClass']
          }
        },
        {
          name: 'get_color_palette',
          description: 'Tailwind CSS 색상 팔레트를 제공합니다',
          inputSchema: {
            type: 'object',
            properties: {
              colorName: {
                type: 'string',
                enum: ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'all'],
                description: '색상명 (all을 선택하면 모든 색상 표시)'
              }
            },
            required: ['colorName']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_tailwind_classes':
            return await this.searchTailwindClasses(args as any);
          
          case 'get_component_example':
            return await this.getComponentExample(args as any);
          
          case 'explain_tailwind_class':
            return await this.explainTailwindClass(args as any);
          
          case 'generate_tailwind_component':
            return await this.generateTailwindComponent(args as any);
          
          case 'get_responsive_classes':
            return await this.getResponsiveClasses(args as any);
          
          case 'get_color_palette':
            return await this.getColorPalette(args as any);
          
          default:
            throw new Error(`알 수 없는 도구: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `오류 발생: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    });
  }

  private async searchTailwindClasses(args: { category: string, query?: string }): Promise<{ content: Array<{ type: string, text: string }> }> {
    const { category, query } = args;
    
    let result = '';
    
    if (category === 'all') {
      result = '# 모든 Tailwind CSS 클래스 카테고리\n\n';
      for (const [categoryName, classes] of Object.entries(TAILWIND_CLASSES)) {
        result += `## ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}\n`;
        for (const [subCategory, classNames] of Object.entries(classes)) {
          result += `### ${subCategory}\n${classNames}\n\n`;
        }
      }
    } else if (TAILWIND_CLASSES[category as keyof typeof TAILWIND_CLASSES]) {
      const categoryData = TAILWIND_CLASSES[category as keyof typeof TAILWIND_CLASSES];
      result = `# ${category.charAt(0).toUpperCase() + category.slice(1)} 클래스\n\n`;
      
      for (const [subCategory, classNames] of Object.entries(categoryData)) {
        if (!query || subCategory.toLowerCase().includes(query.toLowerCase()) || classNames.toLowerCase().includes(query.toLowerCase())) {
          result += `## ${subCategory}\n${classNames}\n\n`;
        }
      }
    } else {
      result = `카테고리 "${category}"를 찾을 수 없습니다. 사용 가능한 카테고리: ${Object.keys(TAILWIND_CLASSES).join(', ')}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    };
  }

  private async getComponentExample(args: { component: string }): Promise<{ content: Array<{ type: string, text: string }> }> {
    const { component } = args;
    
    if (COMPONENT_EXAMPLES[component as keyof typeof COMPONENT_EXAMPLES]) {
      const example = COMPONENT_EXAMPLES[component as keyof typeof COMPONENT_EXAMPLES];
      return {
        content: [
          {
            type: 'text',
            text: `# ${component.charAt(0).toUpperCase() + component.slice(1)} 컴포넌트 예제\n\n\`\`\`html\n${example}\n\`\`\``
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `컴포넌트 "${component}"의 예제를 찾을 수 없습니다. 사용 가능한 컴포넌트: ${Object.keys(COMPONENT_EXAMPLES).join(', ')}`
          }
        ]
      };
    }
  }

  private async explainTailwindClass(args: { className: string }): Promise<{ content: Array<{ type: string, text: string }> }> {
    const { className } = args;
    
    // 클래스명 분석
    let explanation = `# ${className} 클래스 설명\n\n`;
    
    // 기본적인 클래스 패턴 분석
    if (className.startsWith('bg-')) {
      explanation += '**배경 관련 클래스**\n';
      if (className.includes('opacity')) {
        explanation += '- 배경 투명도를 설정합니다.\n';
      } else if (className.match(/bg-\w+-\d+/)) {
        explanation += '- 배경 색상을 설정합니다.\n';
      } else {
        explanation += '- 배경 관련 스타일을 설정합니다.\n';
      }
    } else if (className.startsWith('text-')) {
      explanation += '**텍스트 관련 클래스**\n';
      if (className.match(/text-\w+-\d+/)) {
        explanation += '- 텍스트 색상을 설정합니다.\n';
      } else if (className.match(/text-(xs|sm|base|lg|xl|\dxl)/)) {
        explanation += '- 텍스트 크기를 설정합니다.\n';
      } else {
        explanation += '- 텍스트 관련 스타일을 설정합니다.\n';
      }
    } else if (className.startsWith('p-') || className.startsWith('px-') || className.startsWith('py-') || className.startsWith('pt-') || className.startsWith('pr-') || className.startsWith('pb-') || className.startsWith('pl-')) {
      explanation += '**패딩 관련 클래스**\n- 요소의 내부 여백을 설정합니다.\n';
    } else if (className.startsWith('m-') || className.startsWith('mx-') || className.startsWith('my-') || className.startsWith('mt-') || className.startsWith('mr-') || className.startsWith('mb-') || className.startsWith('ml-')) {
      explanation += '**마진 관련 클래스**\n- 요소의 외부 여백을 설정합니다.\n';
    } else if (className.startsWith('w-')) {
      explanation += '**너비 관련 클래스**\n- 요소의 너비를 설정합니다.\n';
    } else if (className.startsWith('h-')) {
      explanation += '**높이 관련 클래스**\n- 요소의 높이를 설정합니다.\n';
    } else if (className.startsWith('flex')) {
      explanation += '**Flexbox 관련 클래스**\n- Flexbox 레이아웃을 설정합니다.\n';
    } else if (className.startsWith('grid')) {
      explanation += '**Grid 관련 클래스**\n- CSS Grid 레이아웃을 설정합니다.\n';
    } else if (className.startsWith('border')) {
      explanation += '**테두리 관련 클래스**\n- 요소의 테두리를 설정합니다.\n';
    } else if (className.startsWith('rounded')) {
      explanation += '**모서리 둥글게 관련 클래스**\n- 요소의 모서리를 둥글게 만듭니다.\n';
    } else if (className.startsWith('shadow')) {
      explanation += '**그림자 관련 클래스**\n- 요소에 그림자 효과를 추가합니다.\n';
    } else {
      explanation += '**일반 클래스**\n- Tailwind CSS 유틸리티 클래스입니다.\n';
    }

    // 반응형 prefix 확인
    if (className.includes('sm:') || className.includes('md:') || className.includes('lg:') || className.includes('xl:') || className.includes('2xl:')) {
      explanation += '\n**반응형 클래스**: 특정 화면 크기에서만 적용됩니다.\n';
      explanation += '- sm: 640px 이상\n- md: 768px 이상\n- lg: 1024px 이상\n- xl: 1280px 이상\n- 2xl: 1536px 이상\n';
    }

    // hover, focus 등 상태 확인
    if (className.includes('hover:')) {
      explanation += '\n**상태 클래스**: 마우스 호버 시에만 적용됩니다.\n';
    }
    if (className.includes('focus:')) {
      explanation += '\n**상태 클래스**: 요소에 포커스가 있을 때만 적용됩니다.\n';
    }

    return {
      content: [
        {
          type: 'text',
          text: explanation
        }
      ]
    };
  }

  private async generateTailwindComponent(args: { description: string, type: string }): Promise<{ content: Array<{ type: string, text: string }> }> {
    const { description, type } = args;
    
    let component = '';
    
    switch (type) {
      case 'button':
        component = this.generateButton(description);
        break;
      case 'card':
        component = this.generateCard(description);
        break;
      case 'form':
        component = this.generateForm(description);
        break;
      case 'layout':
        component = this.generateLayout(description);
        break;
      case 'navigation':
        component = this.generateNavigation(description);
        break;
      case 'modal':
        component = this.generateModal(description);
        break;
      default:
        component = this.generateGeneric(description, type);
    }

    return {
      content: [
        {
          type: 'text',
          text: `# ${description}에 대한 Tailwind CSS 컴포넌트\n\n\`\`\`html\n${component}\n\`\`\``
        }
      ]
    };
  }

  private generateButton(description: string): string {
    if (description.includes('큰') || description.includes('large')) {
      return `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded-lg transition duration-300">
  ${description}
</button>`;
    } else if (description.includes('작은') || description.includes('small')) {
      return `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 text-sm rounded transition duration-300">
  ${description}
</button>`;
    } else if (description.includes('아웃라인') || description.includes('outline')) {
      return `<button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition duration-300">
  ${description}
</button>`;
    } else {
      return `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
  ${description}
</button>`;
    }
  }

  private generateCard(description: string): string {
    return `<div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">${description}</div>
    <p class="text-gray-700 text-base">
      카드 내용이 여기에 들어갑니다. ${description}에 대한 설명을 추가하세요.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag1</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag2</span>
  </div>
</div>`;
  }

  private generateForm(description: string): string {
    return `<form class="w-full max-w-lg">
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        ${description}
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-first-name" type="text" placeholder="입력하세요">
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        제출
      </button>
    </div>
  </div>
</form>`;
  }

  private generateLayout(description: string): string {
    return `<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">${description}</h1>
    </div>
  </header>
  <main>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p class="text-gray-500">콘텐츠 영역</p>
        </div>
      </div>
    </div>
  </main>
</div>`;
  }

  private generateNavigation(description: string): string {
    return `<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <span class="text-white font-bold text-xl">${description}</span>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a href="#" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">홈</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">소개</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">서비스</a>
            <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">연락처</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>`;
  }

  private generateModal(description: string): string {
    return `<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
  <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    <div class="mt-3 text-center">
      <h3 class="text-lg leading-6 font-medium text-gray-900">${description}</h3>
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-500">
          모달 내용이 여기에 들어갑니다.
        </p>
      </div>
      <div class="items-center px-4 py-3">
        <button class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-hover hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          확인
        </button>
      </div>
    </div>
  </div>
</div>`;
  }

  private generateGeneric(description: string, type: string): string {
    return `<div class="p-6 bg-white rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold mb-4">${description}</h2>
  <p class="text-gray-600">
    ${type} 타입의 컴포넌트입니다. 필요에 따라 스타일을 조정하세요.
  </p>
</div>`;
  }

  private async getResponsiveClasses(args: { baseClass: string }): Promise<{ content: Array<{ type: string, text: string }> }> {
    const { baseClass } = args;
    
    const responsiveInfo = `# ${baseClass} 반응형 클래스\n\n`;
    
    const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
    let result = responsiveInfo;
    
    result += '## 반응형 버전\n';
    breakpoints.forEach(bp => {
      result += `- \`${bp}:${baseClass}\` - ${this.getBreakpointDescription(bp)}에서 적용\n`;
    });
    
    result += '\n## 브레이크포인트 설명\n';
    result += '- `sm`: 640px 이상 (작은 태블릿)\n';
    result += '- `md`: 768px 이상 (태블릿)\n';
    result += '- `lg`: 1024px 이상 (작은 데스크톱)\n';
    result += '- `xl`: 1280px 이상 (데스크톱)\n';
    result += '- `2xl`: 1536px 이상 (큰 데스크톱)\n';
    
    result += '\n## 사용 예제\n';
    result += `\`\`\`html\n<div class="${baseClass} md:${baseClass.replace(/\d+/, (match) => String(parseInt(match) * 2))} lg:${baseClass.replace(/\d+/, (match) => String(parseInt(match) * 3))}">\n  반응형 요소\n</div>\n\`\`\``;

    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    };
  }

  private getBreakpointDescription(bp: string): string {
    switch (bp) {
      case 'sm': return '640px 이상';
      case 'md': return '768px 이상';
      case 'lg': return '1024px 이상';
      case 'xl': return '1280px 이상';
      case '2xl': return '1536px 이상';
      default: return '';
    }
  }

  private async getColorPalette(args: { colorName: string }): Promise<{ content: Array<{ type: string, text: string }> }> {
    const { colorName } = args;
    
    const colorShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    
    if (colorName === 'all') {
      const allColors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
      
      let result = '# 모든 Tailwind CSS 색상 팔레트\n\n';
      
      allColors.forEach(color => {
        result += `## ${color.charAt(0).toUpperCase() + color.slice(1)}\n`;
        colorShades.forEach(shade => {
          result += `- \`${color}-${shade}\` - ${color} ${shade}\n`;
        });
        result += '\n';
      });
      
      return {
        content: [
          {
            type: 'text',
            text: result
          }
        ]
      };
    } else {
      let result = `# ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} 색상 팔레트\n\n`;
      
      result += '## 사용 가능한 색조\n';
      colorShades.forEach(shade => {
        result += `- \`${colorName}-${shade}\` - ${colorName} ${shade} (밝기: ${shade})\n`;
      });
      
      result += '\n## 사용 예제\n';
      result += `\`\`\`html\n<!-- 배경색 -->\n<div class="bg-${colorName}-500">배경</div>\n\n<!-- 텍스트 색상 -->\n<p class="text-${colorName}-700">텍스트</p>\n\n<!-- 테두리 색상 -->\n<div class="border border-${colorName}-300">테두리</div>\n\`\`\``;
      
      return {
        content: [
          {
            type: 'text',
            text: result
          }
        ]
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Tailwind CSS MCP 서버가 시작되었습니다');
  }
}

const server = new TailwindMCPServer();
server.run().catch(console.error);


