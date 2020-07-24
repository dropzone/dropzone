const path = require("path");
const v8 = require("v8");

const clone = (object) => v8.deserialize(v8.serialize(object));

let downloadConfig = {
  entry: ["./src/dropzone.js", "./src/dropzone.scss", "./src/basic.scss"],
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
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].css",
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
                outputStyle: "expanded",
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
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    filename: "dropzone.js",
  },
};

let downloadConfigMin = clone(downloadConfig);
downloadConfigMin.optimization.minimize = true;
downloadConfigMin.output.path = path.resolve(__dirname, "dist", "min");
downloadConfigMin.output.filename = "dropzone.min.js";
downloadConfigMin.module.rules
  .find((rule) => rule.test.toString().includes("scss"))
  .use.find(
    (use) => use.loader == "sass-loader"
  ).options.sassOptions.outputStyle = "compressed";

module.exports = [downloadConfig, downloadConfigMin];
