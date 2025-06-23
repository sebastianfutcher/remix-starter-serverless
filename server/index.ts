import { createRequestHandler } from "@remix-run/architect";
import type { ServerBuild } from "@remix-run/server-runtime";

const build = require("./build") as ServerBuild;

exports.handler = createRequestHandler({
  build,
  getLoadContext(event) {
    // use lambda event to generate a context for loaders
    return {};
  },
});
