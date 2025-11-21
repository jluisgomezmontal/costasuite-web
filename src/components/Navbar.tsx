'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Waves className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CostaSuite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Propiedades
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              Contacto
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button>Iniciar Sesión</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Propiedades
            </Link>
            <Link
              href="/contacto"
              className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            <div className="px-4 pt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="ghost">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Iniciar Sesión</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
