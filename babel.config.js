module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        corejs: {
          version: "3.8",
          proposals: false,
        },
        useBuiltIns: "usage",
        targets: {
          browsers: [
            "edge >= 16",
            "safari >= 9",
            "firefox >= 57",
            "ie >= 11",
            "ios >= 9",
            "chrome >= 49",
          ],
        },
      },
    ],
  ];
  const plugins = [
    ["@babel/plugin-transform-for-of", { allowArrayLike: true }],
  ];
  return {
    presets,
    plugins,
  };
};
