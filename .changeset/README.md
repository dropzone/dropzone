# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): short
files describing the user-facing effect of a change.

If your pull request changes anything a user of Dropzone would notice, add one:

```bash
$ pnpm changeset
```

Pick `patch` for a bug fix, `minor` for a new feature, `major` for a breaking
change, then write a sentence describing the change. Commit the generated file
along with your work.

Changes that a user would never see -- refactors, tests, CI, docs -- do not
need one.

## Crediting people

Each entry gets a link to its pull request and commit automatically. It does
not get a "Thanks @someone!", because that name is only ever the author of the
commit -- which on this repository is almost always the maintainer, and says
nothing about who found the problem.

When somebody deserves the credit, write it into the changeset yourself, and
say what they actually did:

```md
Send a single chunk for zero byte files instead of hanging. Reported and fixed
by [@Forceu](https://github.com/Forceu).
```

That way the credit means something when it appears.

The release itself is automated: once changesets land on `main`, a bot opens a
"Version Packages" pull request that bumps the version and writes CHANGELOG.md.
Merging that pull request publishes to npm.
