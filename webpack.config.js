const path = require("path");
const v8 = require("v8");
const WebpackShellPlugin = require("webpack-shell-plugin");

const clone = (object) => v8.deserialize(v8.serialize(object));

let getJsConfig = (minimize) => {
  return {
    entry: ["./tool/dropzone.dist.js"],
    mode: "production",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            /(node_modules|bower_components)/,
            /\bcore-js\b/,
            /\bwebpack\/buildin\b/,
          ],
          use: {
            loader: "babel-loader",
            options: {
              babelrc: false,
              configFile: path.resolve(__dirname, "babel.config.js"),
              compact: false,
              cacheDirectory: true,
              sourceMaps: false,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: minimize,
    },
    output: {
      libraryTarget: "umd",
      path: path.resolve(__dirname, minimize ? "dist/min" : "dist"),
      filename: minimize ? "dropzone.min.js" : "dropzone.js",
    },
  };
};

let getCssConfig = (minimize) => {
  return {
    entry: ["./src/dropzone.scss", "./src/basic.scss"],
    mode: "production",
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: minimize ? "[name].min.css" : "[name].css",
              },
            },
            {
              loader: "extract-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  outputStyle: minimize ? "compressed" : "expanded",
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: false,
    },
    output: {
      path: path.resolve(__dirname, minimize ? "dist/min" : "dist"),
      filename: "delete-me",
    },
    plugins: [
      new WebpackShellPlugin({
        onBuildEnd: [`rm -f dist/delete-me && rm -f dist/min/delete-me`],
      }),
    ],
  };
};

module.exports = [
  getJsConfig(false),
  getJsConfig(true),
  getCssConfig(false),
  getCssConfig(true),
];
