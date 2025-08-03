import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/login',
    '/cadastro',
    '/recuperar-senha',
    '/redefinir-senha',
    '/verificacao-email',
    '/como-funciona',
    '/ajuda',
    '/termos',
    '/privacidade',
    '/faq',
    '/api/auth/callback',
    '/api/auth/register',
    '/api/auth/reset-password',
    '/api/webhooks',
    '/api/supabase',
  ];

  // Rotas que precisam de autenticação
  const protectedRoutes = [
    '/dashboard',
    '/perfil',
    '/anuncios',
    '/mensagens',
    '/favoritos',
    '/notificacoes',
    '/propostas',
    '/sugestoes',
    '/estatisticas',
    '/checkout',
    '/checkout-success',
    '/checkout-upgrade',
    '/selecionar-plano',
    '/planos',
  ];

  // Rotas administrativas
  const adminRoutes = [
    '/admin',
    '/admin/dashboard',
    '/admin/usuarios',
    '/admin/imoveis',
    '/admin/propostas',
    '/admin/mensagens',
    '/admin/financeiro',
    '/admin/planos',
    '/admin/configuracoes',
  ];

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Verificar se é uma rota administrativa
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Para desenvolvimento, permitir acesso a todas as rotas
  if (process.env.NODE_ENV === 'development') {
    return res;
  }

  // Verificar se há token de autenticação
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  const hasSession = !!(accessToken || refreshToken);

  // Se não há sessão e a rota é protegida, redirecionar para login
  if (!hasSession && isProtectedRoute) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se há sessão mas está tentando acessar páginas de login/cadastro, redirecionar para dashboard
  if (hasSession && (pathname === '/login' || pathname === '/cadastro')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Para rotas administrativas, verificar se é admin (isso será feito no componente)
  if (isAdminRoute && !hasSession) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 