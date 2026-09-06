import { trackEvent } from '$lib/plausible'
import type { Action } from './type'

export const events = {
  createAccount: 'CreateAccount',
  learnMoreAboutPlus: 'LearnMoreAboutPlus',
  tryPlus: 'TryPlus',
  signIn: 'SignIn',
  pricingViewed: 'PricingViewed',
  plusActionsViewed: 'PlusActionsViewed',
  plusDocumentation: 'PlusDocumentation',
}

/// Tracks when the element is clicked with given event name.
export const trackClick: Action<string> = (node, eventName) => {
  const listener = () => {
    trackEvent(eventName)
  }
  node.addEventListener('click', listener)
  return {
    destroy: () => {
      node.removeEventListener('click', listener)
    },
  }
}

/// Tracks when the element is fully visible with given event name.
export const trackViewed: Action<string> = (node, eventName) => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].intersectionRatio > 0) {
        observer.unobserve(node)
        trackEvent(eventName)
      }
    },
    { threshold: 1 }
  )

  observer.observe(node)
  return {
    destroy: () => {
      observer.unobserve(node)
    },
  }
}
