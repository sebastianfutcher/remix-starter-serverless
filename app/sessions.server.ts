import { createCookieSessionStorage } from "@remix-run/node"

const sessionSecret = process.env.SESSION_SECRET || "dev-secret-change-this"

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production"
  }
})

export const getSession = (cookieHeader?: string) => {
  return storage.getSession(cookieHeader)
}

export const commitSession = (session: any) => {
  return storage.commitSession(session)
}

export const destroySession = (session: any) => {
  return storage.destroySession(session)
}
