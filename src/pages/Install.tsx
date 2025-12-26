import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Check, Share, MoreVertical, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-info/10 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-info" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Magolla Farm</h1>
            <p className="text-muted-foreground">Financial Dashboard</p>
          </div>
        </div>

        {isInstalled ? (
          /* Already Installed */
          <div className="card-futuristic p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Already Installed!</h2>
            <p className="text-muted-foreground">
              The app is installed on your device. Open it from your home screen for the best experience.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Open Dashboard
            </Button>
          </div>
        ) : isIOS ? (
          /* iOS Instructions */
          <div className="card-futuristic p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-info" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Install on iPhone/iPad</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-info">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Share className="w-4 h-4" /> at the bottom of Safari
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-info">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Scroll and tap "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground mt-1">You may need to scroll down to find it</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-info">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Add" to confirm</p>
                  <p className="text-sm text-muted-foreground mt-1">The app icon will appear on your home screen</p>
                </div>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          /* Android/Desktop Install Button */
          <div className="card-futuristic p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 text-info" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Install the App</h2>
            <p className="text-muted-foreground">
              Install Magolla Farm on your device for quick access and offline support.
            </p>
            <Button onClick={handleInstall} className="w-full gap-2" size="lg">
              <Download className="w-5 h-5" />
              Install App
            </Button>
          </div>
        ) : (
          /* Android Browser Menu Instructions */
          <div className="card-futuristic p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-info" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Install on Android</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-info">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap the menu button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MoreVertical className="w-4 h-4" /> in your browser
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-xl">
                <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-info">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Install app" or "Add to Home screen"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skip to Dashboard */}
        <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground">
          Skip and continue to dashboard
        </Button>
      </div>
    </div>
  );
}