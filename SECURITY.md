# Security Policy

## Supported versions

| Version | Supported           |
| ------- | ------------------- |
| 6.x     | ✅                  |
| 5.x     | Security fixes only |
| < 5     | ❌                  |

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report them privately through
[GitHub's security advisories](https://github.com/dropzone/dropzone/security/advisories/new),
which lets us discuss and fix the issue before it becomes public. If that does
not work for you, email <m@tias.me> instead.

Please include what the problem is, how to reproduce it, and which version you
found it in. You can expect an acknowledgement within a week.

## Scope

Dropzone runs in the browser and uploads files to a server you control. It does
not validate uploads on your behalf: **always validate file type, size and
content server-side.** Options like `acceptedFiles` and `maxFilesize` are there
to give users quick feedback, not to enforce anything — a client can bypass
them trivially.

Reports that amount to "the client-side checks can be bypassed" are therefore
working as intended rather than vulnerabilities.
