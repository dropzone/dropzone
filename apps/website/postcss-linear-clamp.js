/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const breakpointsRem = {
  tiny: 24, // 384px
  small: 50, // 800px
  medium: 64, // 1024px
  large: 75, // 1200px
  huge: 100, // 1600px
}

export const linearClamp = (minWidth, maxWidth, minSize, maxSize) => {
  minWidth = breakpointsRem[minWidth] ?? parseFloat(minWidth)
  maxWidth = breakpointsRem[maxWidth] ?? parseFloat(maxWidth)
  minSize = parseFloat(minSize)
  maxSize = parseFloat(maxSize)

  const slope = (maxSize - minSize) / (maxWidth - minWidth)
  const yAxisIntersection = -minWidth * slope + minSize
  const preferredValue = `${yAxisIntersection}rem + ${slope * 100}vw`

  return `clamp(${minSize}rem, ${preferredValue}, ${maxSize}rem)`
}

export default linearClamp
