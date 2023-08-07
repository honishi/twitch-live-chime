/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "..", ".env.production"),
});
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      // "process.env.EXTENSION_ENV": JSON.stringify(process.env.EXTENSION_ENV),
      "process.env.TWITCH_CLIENT_ID": JSON.stringify(process.env.TWITCH_CLIENT_ID),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: { compress: { drop_console: true } },
      }),
    ],
  },
});
