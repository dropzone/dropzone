# Dropzone website

> **This app only builds on Node 16.**
>
> It still runs SvelteKit `1.0.0-next.286`, which wraps `url` in a proxy. From
> Node 18 onwards `URL` is implemented with real private fields, so prerendering
> fails with `Cannot read private member #context`. Node 16 is what this site
> was built on before it moved into the monorepo, so nothing has regressed --
> but it does mean `pnpm` itself cannot be used to build it, since pnpm 11
> requires Node 18 or newer.
>
> ```bash
> nvm use 16
> cd apps/website && BRANCH=main ./node_modules/.bin/svelte-kit build
> ```
>
> Its transitive dependencies are pinned in the workspace `overrides`, because
> only direct dependencies survived the move from npm. All of this goes away
> with the SvelteKit migration.

# The Dropzone website

Accessible here: https://www.dropzone.dev

This website is built with [svelte](https://svelte.dev) and [svelte kit](https://kit.svelte.dev).

## Developing

Run this site with

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To build this project, the [static adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-static)
is used.

Run this command to build:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether
> you installed an adapter. This should _not_ be used to serve your app in
> production.

## Testing

Tests are written with Cypress.

```bash
$(npm bin)/cypress open
```

## Deployment

Whenever something is merged into `main` and the tests pass, the site will be
deployed.
