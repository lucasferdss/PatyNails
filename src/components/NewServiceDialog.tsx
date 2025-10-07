
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  price: z.number().min(0.01, "Preço deve ser maior que zero").max(100000, "Preço deve ser menor que 100.000"),
});

export const NewServiceDialog = () => {
  const [open, setOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  
  const { addService } = useApp();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNumber = parseFloat(price);
    
    // Validate using Zod schema
    const validation = serviceSchema.safeParse({
      name: serviceName,
      price: priceNumber,
    });

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Dados inválidos";
      toast({
        title: "Erro de Validação",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    await addService({
      name: validation.data.name,
      price: validation.data.price,
    });

    toast({
      title: "Sucesso",
      description: "Serviço criado com sucesso!",
    });

    // Reset form
    setServiceName('');
    setPrice('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6">
          <Plus size={16} className="mr-2" />
          Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="serviceName">Nome do Serviço</Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Digite o nome do serviço"
            />
          </div>
          
          <div>
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
