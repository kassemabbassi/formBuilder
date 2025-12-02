import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables in middleware")
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })

    // Refresh session if expired
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("[v0] Auth error in middleware:", error.message)
    }

    // Enforce a maximum authenticated lifetime of 5 hours
    const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000
    const sessionStartedCookie = request.cookies.get("app_session_started_at")

    if (user) {
      const now = Date.now()

      // If no session-start cookie exists, create one
      if (!sessionStartedCookie) {
        supabaseResponse.cookies.set("app_session_started_at", String(now), {
          httpOnly: true,
          maxAge: FIVE_HOURS_IN_MS / 1000,
          path: "/",
        })
      } else {
        const startedAt = Number(sessionStartedCookie.value)
        if (!Number.isNaN(startedAt) && now - startedAt > FIVE_HOURS_IN_MS) {
          // Session exceeded 5 hours: clear Supabase auth cookies and our marker, then redirect to sign-in
          const response = NextResponse.redirect(new URL("/auth/signin", request.url))

          request.cookies.getAll().forEach((cookie) => {
            if (cookie.name.startsWith("sb-") || cookie.name === "app_session_started_at") {
              response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" })
            }
          })

          return response
        }
      }
    } else if (sessionStartedCookie) {
      // Ensure we clear stale marker when user is not authenticated
      supabaseResponse.cookies.set("app_session_started_at", "", {
        maxAge: 0,
        path: "/",
      })
    }

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // Redirect to dashboard if already logged in and trying to access auth pages
    if (
      (request.nextUrl.pathname.startsWith("/auth/signin") || request.nextUrl.pathname.startsWith("/auth/signup")) &&
      user
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware error:", error)
    return supabaseResponse
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
