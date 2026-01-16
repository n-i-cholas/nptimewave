import { useState } from 'react';
import { galleryItems, GalleryItem } from '@/store/gameStore';
import { X } from 'lucide-react';
import npCampus from '@/assets/np-campus.jpg';
import npHistory from '@/assets/np-history.jpg';
import npVision from '@/assets/np-vision.jpg';

type GalleryCategory = 'all' | 'timeline' | 'vision' | 'halloffame';

const VRGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories: { key: GalleryCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'timeline', label: 'NP Timeline' },
    { key: 'vision', label: 'NP Vision' },
    { key: 'halloffame', label: 'Hall Of Fame' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'timeline': return 'NP Timeline';
      case 'vision': return 'NP Vision';
      case 'halloffame': return 'Hall Of Fame';
      default: return category;
    }
  };

  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'timeline': return npHistory;
      case 'vision': return npVision;
      case 'halloffame': return npCampus;
      default: return npCampus;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="py-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to VR Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore Ngee Ann Polytechnic's digital heritage through our immersive virtual gallery.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === cat.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="np-card-interactive cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video rounded-xl bg-gradient-to-br from-muted to-secondary mb-4 overflow-hidden">
                <img src={getCategoryImage(item.category)} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <span className="text-xs text-primary font-medium mb-1 block">
                  {getCategoryLabel(item.category)}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Sections */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="np-card p-8 text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Ngee Ann Polytechnic:</h3>
            <p className="text-primary font-medium">A Journey Through Time</p>
          </div>
          <div className="np-card p-8 text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">NP Vision</h3>
            <p className="text-primary font-medium">Building the Future</p>
          </div>
          <div className="np-card p-8 text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Hall Of Fame</h3>
            <p className="text-primary font-medium">Celebrating Excellence</p>
          </div>
        </section>
      </div>

      {/* VR Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden animate-fade-in">
            <div className="aspect-video relative overflow-hidden">
              <img src={getCategoryImage(selectedItem.category)} alt={selectedItem.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white/95 rounded-lg p-6 max-w-md text-center shadow-xl">
                  <h3 className="font-display text-2xl font-bold text-np-navy border-b-2 border-np-gold pb-2 mb-4">
                    {selectedItem.title}
                  </h3>
                  <p className="text-np-navy/80 mb-4">{selectedItem.description}</p>
                  <button onClick={() => setSelectedItem(null)} className="bg-np-navy text-white px-6 py-2 rounded-full font-medium">
                    RETURN TO GALLERY
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRGallery;
