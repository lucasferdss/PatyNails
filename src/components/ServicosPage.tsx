import { Trash2, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewServiceDialog } from './NewServiceDialog';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from './LoadingSpinner';

const ServicosPage = () => {
  const { services, deleteService, loading } = useApp();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    if (confirm(`Tem certeza que deseja excluir o serviço "${serviceName}"?`)) {
      const result = await deleteService(serviceId);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.message,
        });
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-20 max-w-md mx-auto animate-fade-in">
        <LoadingSpinner className="mt-20" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-primary-600">Serviços</h1>
          {user && (
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <LogOut size={16} className="mr-1" />
          Sair
        </Button>
      </div>

      {/* Manage Services Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary-700 mb-2">Gerenciar Serviços</h2>
        <p className="text-gray-600 mb-4">Adicione, edite e remova os serviços oferecidos.</p>
        
        {/* New Service Button */}
        <div className="flex justify-end mb-4">
          <NewServiceDialog />
        </div>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum serviço cadastrado</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  <p className="text-sm text-gray-600">R$ {Number(service.price).toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteService(service.id, service.name)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={20} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicosPage;