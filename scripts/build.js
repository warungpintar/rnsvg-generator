#!/usr/bin/env node

const path = require("path");
const esbuild = require("esbuild");
const packageJson = require("../package.json");
const { baseConfig } = require("./config");

(async () => {
  await esbuild.build({ ...baseConfig, minify: true });
  await esbuild.build({
    ...baseConfig,
    minify: true,
    format: "esm",
    outfile: path.resolve(__dirname, "../dist/index.esm.js"),
  });
})();
