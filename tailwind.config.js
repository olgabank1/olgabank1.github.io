/** @type {import('tailwindcss').Config} */
const colors = require("@sb1/ffe-core/lib/colors");
const spacing = require("@sb1/ffe-core/lib/spacing");
const breakpoints = require("@sb1/ffe-core/lib/breakpoints");
export default {
  content: ["./src/**/*.{tsx,ts}"],
  darkMode: "class",
  theme: {
    colors: {
      ...colors,
      inherit: "inherit",
      transparent: "transparent",
    },
    screens: {
      sm: breakpoints.breakpointSm,
      md: breakpoints.breakpointMd,
      lg: breakpoints.breakpointLg,
      xl: breakpoints.breakpointXl,
    },
    spacing: {
      0: 0,
      0.5: spacing.spacing2xs,
      "1/2": spacing.spacing2xs,
      1: spacing.spacing,
      2: spacing.spacingSm,
      3: spacing.spacingMd,
      4: spacing.spacingLg,
      5: spacing.spacingXl,
      6: spacing.spacing2xl,
      8: spacing.spacing3xl,
      10: spacing.spacing4xl,
      20: spacing.spacing5xl,
      "2xs": spacing.spacing2xs,
      xs: spacing.spacingXs,
      sm: spacing.spacingSm,
      md: spacing.spacingMd,
      lg: spacing.spacingLg,
      xl: spacing.spacingXl,
      "2xl": spacing.spacing2xl,
      "3xl": spacing.spacing3xl,
      "4xl": spacing.spacing4xl,
      "5xl": spacing.spacing5xl,
    },
    extend: {
      boxShadow: {
        olga: "0 0.0625rem 0.25rem var(--ffe-farge-lysvarmgraa)",
      },
    },
  },
  plugins: [],
};
