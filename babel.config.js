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
        // The target is specified in the package.json "browserslist"
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
