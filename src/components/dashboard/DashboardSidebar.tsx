'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  LogOut,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/propiedades',
      label: 'Propiedades',
      icon: Home,
    },
    {
      href: '/dashboard/usuarios',
      label: 'Usuarios',
      icon: Users,
    },
  ];

  const agentLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/mis-propiedades',
      label: 'Mis Propiedades',
      icon: Home,
    },
  ];

  const links = isAdmin ? adminLinks : agentLinks;

  return (
    <div className="flex h-full flex-col bg-background border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Waves className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            CostaSuite
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User info and logout */}
      <div className="p-4 space-y-4">
        <div className="rounded-lg bg-accent p-3 text-sm">
          <p className="font-semibold truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize mt-1">
            {user?.role === 'admin' ? 'Administrador' : 'Agente'}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
