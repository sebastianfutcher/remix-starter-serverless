var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  Layout: () => Layout,
  default: () => App,
  links: () => links
});
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx2(Outlet, {});
}

// app/routes/dashboard.tsx
var dashboard_exports = {};
__export(dashboard_exports, {
  action: () => action,
  default: () => Dashboard,
  loader: () => loader
});
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";

// app/sessions.server.ts
import { createCookieSessionStorage } from "@remix-run/node";
var sessionSecret = process.env.SESSION_SECRET || "dev-secret-change-this", storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: !0
  }
}), getSession = (cookieHeader) => storage.getSession(cookieHeader), commitSession = (session) => storage.commitSession(session);

// app/routes/dashboard.tsx
import { useState, useEffect } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var loader = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie") ?? void 0), userEmail = session.get("userEmail"), count = session.get("count") || 0;
  return userEmail ? json({ userEmail, count }) : redirect("/");
}, action = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie") ?? void 0), count = session.get("count") || 0;
  return count++, session.set("count", count), json(
    { count },
    {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    }
  );
};
function Dashboard() {
  let { userEmail, count: initialCount } = useLoaderData(), fetcher = useFetcher(), [count, setCount] = useState(initialCount);
  return useEffect(() => {
    fetcher.data && typeof fetcher.data.count == "number" && setCount(fetcher.data.count);
  }, [fetcher.data]), /* @__PURE__ */ jsxs2("div", { className: "flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100", children: [
    /* @__PURE__ */ jsx3("h1", { className: "mb-4 text-3xl font-bold", children: "Dashboard" }),
    /* @__PURE__ */ jsxs2("p", { className: "mb-8", children: [
      "Welcome, ",
      /* @__PURE__ */ jsx3("strong", { children: userEmail }),
      "!"
    ] }),
    /* @__PURE__ */ jsx3("p", { children: "Welcome to the dashboard page." }),
    /* @__PURE__ */ jsx3(fetcher.Form, { method: "post", children: /* @__PURE__ */ jsxs2("button", { className: "mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", type: "submit", children: [
      "Increment: ",
      count
    ] }) })
  ] });
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
  loader: () => loader2
});
import { redirect as redirect2 } from "@remix-run/node";
var loader2 = async () => redirect2("/login");
function Index() {
  return null;
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action2,
  default: () => Login
});
import { json as json2, redirect as redirect3 } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, action2 = async ({ request }) => {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password");
  if (typeof email != "string" || !emailRegex.test(email) || typeof password != "string" || password.length < 6)
    return json2({ error: "Invalid email or password. Password must be at least 6 characters." }, { status: 400 });
  let session = await getSession(request.headers.get("Cookie") ?? void 0);
  return session.set("userEmail", email), redirect3("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
};
function Login() {
  let actionData = useActionData(), [email, setEmail] = useState2(""), [password, setPassword] = useState2("");
  return /* @__PURE__ */ jsx4("div", { className: "flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxs3(Form, { method: "post", className: "w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow", children: [
    /* @__PURE__ */ jsx4("h1", { className: "mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Login" }),
    actionData?.error && /* @__PURE__ */ jsx4("p", { className: "mb-4 rounded bg-red-200 p-3 text-red-900", children: actionData.error }),
    /* @__PURE__ */ jsx4("label", { htmlFor: "email", className: "block mb-1 font-semibold text-gray-700 dark:text-gray-300", children: "Email" }),
    /* @__PURE__ */ jsx4(
      "input",
      {
        id: "email",
        name: "email",
        type: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        required: !0,
        className: "mb-4 w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-gray-100",
        placeholder: "you@example.com"
      }
    ),
    /* @__PURE__ */ jsx4("label", { htmlFor: "password", className: "block mb-1 font-semibold text-gray-700 dark:text-gray-300", children: "Password" }),
    /* @__PURE__ */ jsx4(
      "input",
      {
        id: "password",
        name: "password",
        type: "password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        required: !0,
        minLength: 6,
        className: "mb-6 w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-gray-100",
        placeholder: "Your password"
      }
    ),
    /* @__PURE__ */ jsx4("button", { type: "submit", className: "w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700", children: "Log In" })
  ] }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/static/entry.client-L2GIYGPE.js", imports: ["/static/_shared/chunk-LAYSQHPP.js", "/static/_shared/chunk-ZOHJYKKZ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/static/root-L75JYEA4.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard": { id: "routes/dashboard", parentId: "root", path: "dashboard", index: void 0, caseSensitive: void 0, module: "/static/routes/dashboard-5SRKZYSW.js", imports: ["/static/_shared/chunk-JFGGGHZQ.js", "/static/_shared/chunk-KHQVJFZC.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: "index", index: void 0, caseSensitive: void 0, module: "/static/routes/index-MZ4TYX62.js", imports: ["/static/_shared/chunk-KHQVJFZC.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/static/routes/login-KOCMLWR4.js", imports: ["/static/_shared/chunk-JFGGGHZQ.js", "/static/_shared/chunk-KHQVJFZC.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "b23d0d93", hmr: void 0, url: "/static/manifest-B23D0D93.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/static", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/static/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: dashboard_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: "index",
    index: void 0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
