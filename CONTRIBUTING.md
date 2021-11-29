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
$ yarn install
```

This will install all the tools you need to compile the source files and to test
the library.

## Testing

Testing is done on the compiled files. So either run `yarn build` or
`yarn watch` first, and then `yarn test`.

### Cypress

In order to run the cypress tests (e2e tests), you need to first start the
test server (`yarn start-test-server`) and then cypress `yarn cypress open`.
