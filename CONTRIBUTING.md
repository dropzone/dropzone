# Contribute

## Communicate

Before you start implementing new features, please create an issue about it
first and discuss your intent.

It might be something that someone else is already implementing or that goes
against the concepts of Dropzone, and I really hate rejecting pull requests
others spent hours writing on.

## Developer Dependencies

The first thing you need to do, is to install the developer dependencies:

```bash
$ pnpm install
```

This will install all the tools you need to compile the source files and to test
the library.

## Testing

Unit tests run against `src/` in a real browser with Vitest:

```bash
$ pnpm test
```

### End-to-end

The end-to-end tests drive the built files through a real browser, so build
first. Playwright starts and stops the test server itself.

```bash
$ pnpm build
$ pnpm test:e2e
```
