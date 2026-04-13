import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/api/auth",
  "/api/webhooks",
  "/_next",
  "/favicon.ico",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Deixar passar rotas públicas
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Extrair orgSlug da URL: /[orgSlug]/...
  const segments = pathname.split("/").filter(Boolean)
  const orgSlug = segments[0]

  if (!orgSlug) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verificar sessão
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar se o usuário tem acesso à org
  const membership = await auth.api.hasPermission({
    headers: request.headers,
    body: { permission: { organization: ["read"] } },
  })

  if (!membership.success) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/webhooks).*)",
  ],
}
