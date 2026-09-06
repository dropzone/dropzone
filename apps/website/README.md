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
