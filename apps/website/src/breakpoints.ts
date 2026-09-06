export type breakpointName = 'tiny' | 'small' | 'medium' | 'large' | 'huge'

export const breakpointsPixels = {
  tiny: 380,
  small: 800,
  medium: 1024,
  large: 1200,
  huge: 1600,
}

export const breakpoints = {
  tiny: `@media (min-width: ${breakpointsPixels.tiny}px)`,
  tinyDown: `@media (max-width: ${breakpointsPixels.tiny - 1}px)`,
  small: `@media (min-width: ${breakpointsPixels.small}px)`,
  smallDown: `@media (max-width: ${breakpointsPixels.small - 1}px)`,
  medium: `@media (min-width: ${breakpointsPixels.medium}px)`,
  mediumDown: `@media (max-width: ${breakpointsPixels.medium - 1}px)`,
  large: `@media (min-width: ${breakpointsPixels.large}px)`,
  largeDown: `@media (max-width: ${breakpointsPixels.large - 1}px)`,
  huge: `@media (min-width: ${breakpointsPixels.huge}px)`,
  hugeDown: `@media (max-width: ${breakpointsPixels.huge - 1}px)`,
}
