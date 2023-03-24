import * as esbuild from "esbuild";

const commonConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "neutral",
  packages: "external",
  outdir: "dist",
  logLevel: "info",
};

await esbuild.build({
  ...commonConfig,
  format: "cjs",
  outExtension: { ".js": ".cjs" },
});

await esbuild.build({
  ...commonConfig,
  format: "esm",
  outExtension: { ".js": ".esm.js" },
});
