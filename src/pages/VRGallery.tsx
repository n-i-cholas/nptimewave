import { useEffect } from 'react';
import { ExternalLink, Compass } from 'lucide-react';

const VRGallery = () => {
  const externalUrl = 'https://nptimewave2.vercel.app/';

  useEffect(() => {
    // Auto-redirect after a brief moment
    const timer = setTimeout(() => {
      window.open(externalUrl, '_blank');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 text-center">
        <div className="np-card p-12 max-w-xl mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            VR Gallery Experience
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            You're being redirected to our immersive VR Gallery experience.
          </p>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors hover:scale-105"
          >
            <span>Open VR Gallery</span>
            <ExternalLink className="w-5 h-5" />
          </a>
          <p className="text-muted-foreground text-sm mt-6">
            If not redirected automatically, click the button above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VRGallery;