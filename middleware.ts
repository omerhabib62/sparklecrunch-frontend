import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    console.log('🚨 MIDDLEWARE RUNNING:', request.nextUrl.pathname);

    const { pathname } = request.nextUrl;

    // Get auth data from cookies
    const authCookie = request.cookies.get('auth-storage');
    let authData = null;

    if (authCookie) {
        try {
            const parsed = JSON.parse(authCookie.value);
            authData = parsed.state;
        } catch (error) {
            console.error('❌ Failed to parse auth cookie:', error);
        }
    }

    const isAuthenticated = authData?.isAuthenticated === true;
    const user = authData?.user;
    const isAdmin = user?.role === 'admin';
    const profileCompleted = user?.profileCompleted === true;

    console.log('🛡️ Auth status:', {
        pathname,
        isAuthenticated,
        userRole: user?.role,
        profileCompleted,
        isAdmin
    });

    // Define route types
    const publicRoutes = ['/login', '/register', '/maintenance'];
    const isPublicRoute = publicRoutes.includes(pathname);
    const protectedRoutes = ['/dashboard', '/onboarding'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // 1. Handle unauthenticated users first
    if (!isAuthenticated) {
        if (isProtectedRoute) {
            console.log('🚪 Redirecting to login: not authenticated');
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Allow access to public routes and home page
        return NextResponse.next();
    }

    // 2. Handle authenticated users trying to access auth pages
    if (pathname === '/login' || pathname === '/register') {
        if (isAdmin) {
            console.log('👑 Redirecting admin to dashboard');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (!profileCompleted) {
            console.log('📝 Redirecting to onboarding: profile not completed');
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        console.log('✅ Redirecting to dashboard: profile completed');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. Handle home page for authenticated users
    if (pathname === '/') {
        if (isAdmin) {
            console.log('👑 Redirecting admin from home to dashboard');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (!profileCompleted) {
            console.log('📝 Redirecting from home to onboarding: profile not completed');
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        console.log('✅ Redirecting from home to dashboard: profile completed');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 4. Handle onboarding page access
    if (pathname === '/onboarding') {
        if (isAdmin) {
            console.log('👑 Redirecting admin away from onboarding');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (profileCompleted) {
            console.log('✅ Redirecting to dashboard: profile already completed');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Allow access if authenticated and profile not completed
        console.log('✅ Allowing access to onboarding');
        return NextResponse.next();
    }

    // 5. Handle dashboard and other protected routes
    if (pathname.startsWith('/dashboard')) {
        if (!profileCompleted && !isAdmin) {
            console.log('📝 Redirecting to onboarding: profile incomplete');
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        // Allow access if authenticated and (profile completed OR admin)
        console.log('✅ Allowing access to dashboard');
        return NextResponse.next();
    }

    // 6. Allow access to any other routes
    console.log('✅ Allowing access to:', pathname);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};