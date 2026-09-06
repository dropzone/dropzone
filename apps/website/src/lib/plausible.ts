import { env } from './env'

declare global {
  interface Window {
    /**
     * You shouldn't use this function directly. Rather use the `trackEvent`
     * function, which also adds the necessary props for A/B testing.
     */
    plausible: (name: string, params?: Record<string, unknown>) => void
  }
}

export const trackEvent = (eventName: string): void => {
  window.plausible(eventName, { props: { variant: env.variant } })
}
