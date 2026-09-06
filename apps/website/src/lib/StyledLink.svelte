<script type="ts">
  import ChevronRight from '~icons/ion/chevron-forward'
  import type { Action } from './actions/type'

  export let href: string
  export let variant: 'outlined' | 'contained' | 'text' = 'outlined'
  export let color: 'primary' | 'secondary' | 'white' = 'primary'
  export let use: ActionSet | undefined = undefined

  type ActionSet<P extends unknown = unknown> = [Action<P>, P]

  let useFunction: Action = () => undefined
  let useParam: unknown

  if (use) {
    useFunction = use[0]
    useParam = use[1]
  }
</script>

<a
  use:useFunction={useParam}
  {href}
  target={href.startsWith('http') ? '_blank' : null}
  rel={href.startsWith('http') ? 'nofollow' : null}
  style="--color: var(--{color}-color); --bg-color: var(--{color}-bg-color);"
  class:outlined={variant === 'outlined'}
  class:contained={variant === 'contained'}
  class:text={variant === 'text'}
  ><slot /> <span class="icon"><ChevronRight /></span></a
>

<style>
  a {
    display: inline-flex;
    align-items: center;
    width: auto;
    height: 2.25rem;
    line-height: calc(2.25rem - 6px);
    border-radius: 3rem;
    padding: 0 1.1em 0 1.5em;
    font-weight: 700;
    font-family: var(--font-header);
    font-size: var(--button-font-size);
    white-space: nowrap;
  }

  .icon {
    margin-left: 0.2em;
    margin-right: -0.2em;
  }
  .icon :global(svg) {
    display: block;
  }
  .icon :global(svg path) {
    stroke-width: 5em;
  }

  .outlined {
    color: var(--color);
    border: 3px solid var(--color);
  }
  .text {
    color: var(--color);
  }

  .outlined:hover,
  .text:hover {
    background: var(--bg-color);
  }

  .contained {
    color: white;
    background: var(--button-contained-background);
    backdrop-filter: blur(10px);
  }
  .contained:hover {
    background: var(--button-contained-background-hover);
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
  }
</style>
