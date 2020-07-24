module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        corejs: {
          version: "3",
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
  return {
    presets,
  };
};
