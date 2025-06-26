
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { NewServiceDialog } from './NewServiceDialog';
import { useToast } from '@/hooks/use-toast';

const ServicosPage = () => {
  const { services, deleteService } = useApp();
  const { toast } = useToast();

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    if (confirm(`Tem certeza que deseja excluir o serviço "${serviceName}"?`)) {
      deleteService(serviceId);
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });
    }
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary-600">Serviços</h1>
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

      {/* Services Table Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
          <div>Serviço</div>
          <div className="text-center">Preço (R$)</div>
          <div className="text-center">Ações</div>
        </div>
      </div>

      {/* Services List */}
      <Card>
        <CardContent className="p-6">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum serviço cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h4 className="font-medium text-gray-800">{service.name}</h4>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-700">R$ {service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id, service.name)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicosPage;
