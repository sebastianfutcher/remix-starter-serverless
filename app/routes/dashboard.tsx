import { LoaderFunction, redirect, json, ActionFunction } from "@remix-run/node"
import { useLoaderData, useFetcher } from "@remix-run/react"
import { getSession, commitSession } from "../sessions.server"
import React, { useState, useEffect } from "react"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie") ?? undefined)
  const userEmail = session.get("userEmail")
  const count = session.get("count") || 0

  if (!userEmail) {
    // Not logged in, redirect to login page
    return redirect("/")
  }

  return json({ userEmail, count })
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie") ?? undefined)
  let count = session.get("count") || 0
  count++
  session.set("count", count)
  return json(
    { count },
    {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    }
  )
}

export default function Dashboard() {
  const { userEmail, count: initialCount } = useLoaderData<{ userEmail: string; count: number }>()
  const fetcher = useFetcher()
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    if (fetcher.data && typeof (fetcher.data as any).count === "number") {
      setCount((fetcher.data as any).count)
    }
  }, [fetcher.data])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8">
        Welcome, <strong>{userEmail}</strong>!
      </p>
      <p>Welcome to the dashboard page.</p>
      <fetcher.Form method="post">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">
          Increment: {count}
        </button>
      </fetcher.Form>
    </div>
  )
}
