#!/usr/bin/env node

const path = require("path");
const esbuild = require("esbuild");
const packageJson = require("../package.json");
const { baseConfig } = require("./config");

(async () => {
  esbuild.build({
    ...baseConfig,
    minify: false,
    watch: true,
    bundle: true,
  });
})();
