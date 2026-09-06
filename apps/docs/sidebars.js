// Mirrors the order the GitBook SUMMARY.md defined, so the navigation people
// know survives the move.
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    { type: "doc", id: "index", label: "👋 Introduction" },
    {
      type: "category",
      label: "Getting Started",
      items: [
        {
          type: "category",
          label: "⏬ Installation",
          link: { type: "doc", id: "getting-started/installation/index" },
          items: [
            "getting-started/installation/npm-or-yarn",
            "getting-started/installation/composer",
            "getting-started/installation/stand-alone",
          ],
        },
        {
          type: "category",
          label: "✅ Setup",
          link: { type: "doc", id: "getting-started/setup/index" },
          items: [
            "getting-started/setup/declarative",
            "getting-started/setup/imperative",
            "getting-started/setup/server-side-implementation",
            "getting-started/setup/fallback-for-no-javascript",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Configuration",
      items: [
        {
          type: "category",
          label: "⚙️ Basics",
          link: { type: "doc", id: "configuration/basics/index" },
          items: [
            "configuration/basics/configuration-options",
            "configuration/basics/layout",
            "configuration/basics/methods",
            "configuration/basics/upload-queue",
          ],
        },
        "configuration/events",
        "configuration/theming",
        {
          type: "category",
          label: "🤓 Tutorials",
          link: { type: "doc", id: "configuration/tutorials/index" },
          items: ["configuration/tutorials/combine-form-data-with-files"],
        },
      ],
    },
    {
      type: "category",
      label: "Miscellaneous",
      items: ["misc/tips", "misc/faq", "misc/donate"],
    },
  ],
};

export default sidebars;
