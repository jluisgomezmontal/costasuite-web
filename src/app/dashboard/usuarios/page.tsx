'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function UsersManagementPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios de la plataforma
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">
              Funcionalidad en desarrollo
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Esta sección permitirá gestionar usuarios, asignar roles y permisos.
              Por ahora puedes gestionar propiedades desde la sección correspondiente.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
