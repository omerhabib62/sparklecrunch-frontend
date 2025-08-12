import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache for backend status to avoid multiple requests
let backendStatusCache: { isOnline: boolean; lastChecked: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

async function checkBackendHealth(): Promise<boolean> {
    if (backendStatusCache && (Date.now() - backendStatusCache.lastChecked) < CACHE_DURATION) {
        console.log('🏥 Using cached backend status:', backendStatusCache.isOnline);
        return backendStatusCache.isOnline;
    }

    try {
        console.log('🏥 Checking backend health at:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api'}/health`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api'}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(5000)
        });

        const isOnline = response.ok;
        console.log('🏥 Backend health result:', isOnline ? 'Online' : 'Offline', response.status);

        backendStatusCache = { isOnline, lastChecked: Date.now() };
        return isOnline;
    } catch (error) {
        console.error('🚨 Backend health check failed:', error.message);
        backendStatusCache = { isOnline: false, lastChecked: Date.now() };
        return false;
    }
}

export async function middleware(request: NextRequest) {
    console.log('🔥 MIDDLEWARE HIT:', request.nextUrl.pathname);

    const { pathname } = request.nextUrl;

    // Check backend health first
    const isBackendOnline = await checkBackendHealth();

    if (!isBackendOnline) {
        console.log('🚨 Backend is offline, showing maintenance page');

        // Don't redirect maintenance page to itself
        if (pathname !== '/maintenance') {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }

        // Allow access to maintenance page
        return NextResponse.next();
    }

    // If backend is online but user is on maintenance page, redirect them away
    if (pathname === '/maintenance') {
        console.log('✅ Backend is back online, redirecting from maintenance');
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Get auth data from cookies
    const authCookie = request.cookies.get('auth-storage');
    console.log('🍪 Auth cookie:', authCookie?.value ? 'Found' : 'Not found');

    let authData = null;

    if (authCookie) {
        try {
            const parsed = JSON.parse(authCookie.value);
            authData = parsed.state;
        } catch (error) {
            console.error('❌ Failed to parse auth cookie:', error);
        }
    }

    const isAuthenticated = authData?.isAuthenticated;
    const user = authData?.user;
    const isAdmin = user?.role === 'admin';
    const profileCompleted = user?.profileCompleted === true;

    console.log('🛡️ Middleware check:', {
        pathname,
        isAuthenticated,
        userRole: user?.role,
        profileCompleted,
        isAdmin,
        backendOnline: isBackendOnline
    });

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Auth-required routes
    const protectedRoutes = ['/dashboard', '/onboarding'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && isProtectedRoute) {
        console.log('🚪 Redirecting to login: not authenticated');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated and trying to access public auth routes
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
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

    // If authenticated but profile not completed and not on onboarding
    if (isAuthenticated && !isAdmin && !profileCompleted && pathname !== '/onboarding') {
        console.log('📝 Redirecting to onboarding: profile incomplete');
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // If authenticated, profile completed, and on onboarding (trying to bypass)
    if (isAuthenticated && profileCompleted && pathname === '/onboarding') {
        console.log('✅ Redirecting to dashboard: profile already completed');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If admin trying to access onboarding
    if (isAuthenticated && isAdmin && pathname === '/onboarding') {
        console.log('👑 Redirecting admin away from onboarding');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('✅ Allowing access to:', pathname);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};