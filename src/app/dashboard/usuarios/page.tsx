'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Edit, Trash2, Mail, Calendar } from 'lucide-react';
import { userService, User } from '@/lib/api/user.service';
import { toast } from 'sonner';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({ search: searchTerm });
      setUsers(response.users);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('Usuario eliminado correctamente');
        loadUsers();
      } catch (error) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const handleSearch = () => {
    loadUsers();
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra los usuarios de la plataforma
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleSearch} variant="outline">
                Buscar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando usuarios...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground mb-2">
                  No se encontraron usuarios
                </p>
                <p className="text-sm text-muted-foreground">
                  No hay usuarios registrados o no coinciden con la búsqueda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Usuario</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Rol</th>
                      <th className="text-left py-3 px-4">Propiedades</th>
                      <th className="text-left py-3 px-4">Fecha de registro</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Administrador' : 'Agente'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">
                            {user._count?.properties || 0} propiedades
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
