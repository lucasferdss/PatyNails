import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBanner(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallBanner || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-20 left-4 right-4 mx-auto max-w-md p-4 shadow-lg z-40 bg-card border-primary/20">
      <div className="flex items-start gap-3">
        <img
          src="/logo.jpg"
          alt="PatyNails"
          className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">Instalar PatyNails</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Instale o app para acesso rápido e use mesmo offline
          </p>         
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              size="sm"
              className="flex-1"
            >
              Instalar
            </Button>
            <Button 
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
            >
              Agora não
            </Button>
          </div>
        </div>
        <Button
          onClick={handleDismiss}
          size="icon"
          variant="ghost"
          className="flex-shrink-0 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
