// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Dropzone",
  tagline: "Turn any HTML element into a dropzone",
  favicon: "img/favicon.ico",

  // The website and these docs are served from one GitHub Pages site: the
  // SvelteKit build takes the root, and this is copied in underneath /docs.
  // That is what `baseUrl` is for -- it rewrites routing and asset URLs so
  // nothing else has to know where the site is mounted.
  url: "https://www.dropzone.dev",
  baseUrl: "/docs/",

  organizationName: "dropzone",
  projectName: "dropzone",

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: {
    hooks: { onBrokenMarkdownLinks: "throw" },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/dropzone/dropzone/tree/main/apps/docs/",
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Dropzone",
        items: [
          { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
          { href: "https://www.dropzone.dev/", label: "Home", position: "right" },
          { href: "https://github.com/dropzone/dropzone", label: "GitHub", position: "right" },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [{ label: "Introduction", to: "/" }],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discussions",
                href: "https://github.com/dropzone/dropzone/discussions",
              },
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/dropzone.js",
              },
            ],
          },
          {
            title: "More",
            items: [
              { label: "GitHub", href: "https://github.com/dropzone/dropzone" },
              { label: "npm", href: "https://www.npmjs.com/package/dropzone" },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Matias Simon. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
