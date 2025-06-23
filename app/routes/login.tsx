import { ActionFunction, json, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { useState } from "react"

// Simple email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Session handling imports (assuming you use a cookie session for simplicity)
import { getSession, commitSession } from "../sessions.server"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  // Validate email and password
  if (typeof email !== "string" || !emailRegex.test(email) || typeof password !== "string" || password.length < 6) {
    return json({ error: "Invalid email or password. Password must be at least 6 characters." }, { status: 400 })
  }

  // "Authenticate" user (any valid email + password passes)
  // Create a session and store the user email
  const session = await getSession(request.headers.get("Cookie") ?? undefined)

  session.set("userEmail", email)

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  })
}

export default function Login() {
  const actionData = useActionData<{ error?: string }>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Form method="post" className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Login</h1>

        {actionData?.error && <p className="mb-4 rounded bg-red-200 p-3 text-red-900">{actionData.error}</p>}

        <label htmlFor="email" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-gray-100"
          placeholder="you@example.com"
        />

        <label htmlFor="password" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mb-6 w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Your password"
        />

        <button type="submit" className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
          Log In
        </button>
      </Form>
    </div>
  )
}
