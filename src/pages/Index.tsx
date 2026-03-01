import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryTaste, PRIMARY_TASTES } from '@/types/food';
import { TasteTile } from '@/components/TasteTile';
import { RestaurantCard } from '@/components/RestaurantCard';
import { restaurants } from '@/data/mockData';
import { ArrowRight, UtensilsCrossed, Search, Moon, Sun, Flame, IceCream, Fish, Beef, Pizza, Cherry, Salad, Coffee, X } from 'lucide-react';

const FLOATING_CARDS = [
  { image: '/images/burger.jpg', label: 'Burgers', x: '8%', y: '18%', rotate: -8, delay: 0.3 },
  { image: '/images/pizza.jpg', label: 'Pizza', x: '78%', y: '12%', rotate: 6, delay: 0.5 },
  { image: '/images/tacos.jpg', label: 'Tacos', x: '5%', y: '62%', rotate: 12, delay: 0.7 },
  { image: '/images/poke-bowl.jpg', label: 'Bowls', x: '82%', y: '55%', rotate: -5, delay: 0.4 },
  { image: '/images/salmon.jpg', label: 'Seafood', x: '70%', y: '78%', rotate: 8, delay: 0.6 },
  { image: '/images/chocolate-cake.jpg', label: 'Desserts', x: '15%', y: '82%', rotate: -12, delay: 0.8 },
];

const CUISINE_CATEGORIES: { label: string; icon: typeof Flame; color: string; tastes: PrimaryTaste[] }[] = [
  { label: 'BBQ & Grill', icon: Flame, color: 'hsl(var(--taste-savory))', tastes: ['Savory', 'Crispy'] },
  { label: 'Desserts', icon: IceCream, color: 'hsl(var(--taste-sweet))', tastes: ['Sweet'] },
  { label: 'Seafood', icon: Fish, color: 'hsl(var(--taste-fresh))', tastes: ['Fresh', 'Savory'] },
  { label: 'Steakhouse', icon: Beef, color: 'hsl(var(--taste-comfort))', tastes: ['Savory', 'Comfort'] },
  { label: 'Italian', icon: Pizza, color: 'hsl(var(--taste-cheesy))', tastes: ['Cheesy', 'Comfort'] },
  { label: 'Healthy', icon: Salad, color: 'hsl(var(--taste-fresh))', tastes: ['Fresh'] },
  { label: 'Brunch', icon: Coffee, color: 'hsl(var(--taste-comfort))', tastes: ['Comfort', 'Sweet'] },
  { label: 'Fruity', icon: Cherry, color: 'hsl(var(--taste-sweet))', tastes: ['Sweet', 'Fresh'] },
];

const Index = () => {
  const [selectedTastes, setSelectedTastes] = useState<PrimaryTaste[]>([]);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById('hero-section')?.offsetHeight || 480;
      setShowNav(window.scrollY > heroHeight - 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTaste = (taste: PrimaryTaste) => {
    setSelectedTastes((prev) => {
      if (prev.includes(taste)) return prev.filter((t) => t !== taste);
      if (prev.length >= 5) return prev;
      return [...prev, taste];
    });
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesTaste = selectedTastes.length === 0 || r.dishes.some((d) => selectedTastes.includes(d.primaryTaste));
    const matchesSearch = searchQuery.trim() === '' || r.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesTaste && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Nav */}
      <AnimatePresence>
        {showNav && !showRestaurants && (
          <motion.nav
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm"
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
              >
                <div className="p-1.5 rounded-lg bg-accent">
                  <UtensilsCrossed className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-xl font-display text-foreground">FoodMan</span>
              </button>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.div
                      key="search-input"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 overflow-hidden"
                    >
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search restaurants…"
                        className="bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full"
                      />
                      <button
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="p-0.5 rounded-full hover:bg-accent/20 cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="search-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSearchOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-body font-semibold cursor-pointer transition-transform hover:scale-105"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Find Food
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    const next = !isDark;
                    setIsDark(next);
                    document.documentElement.classList.toggle('dark', next);
                  }}
                  className="p-2 rounded-full bg-muted text-muted-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showRestaurants ? (
          <motion.div
            key="taste-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="min-h-screen flex flex-col"
          >
            {/* Full-bleed Hero */}
            <section id="hero-section" className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src="/images/steak.jpg"
                  alt="Delicious food spread"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
              </div>

              {/* Floating food cards */}
              {FLOATING_CARDS.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: card.rotate }}
                  transition={{ delay: card.delay, type: 'spring', stiffness: 200, damping: 15 }}
                  className="absolute hidden md:block"
                  style={{ left: card.x, top: card.y }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shadow-elevated border-2 border-card/50 backdrop-blur-sm"
                  >
                    <img src={card.image} alt={card.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-foreground/60 px-1 py-0.5">
                      <p className="text-[9px] font-body font-semibold text-primary-foreground text-center">{card.label}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Hero content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="p-2 rounded-xl bg-accent/90 backdrop-blur-sm">
                    <UtensilsCrossed className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display text-primary-foreground drop-shadow-lg">
                    FoodMan
                  </h1>
                </motion.div>

                {/* Animated tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg md:text-2xl font-body font-medium text-primary-foreground/90 max-w-lg mb-2 drop-shadow-md"
                >
                  Discover food you'll{' '}
                  <motion.span
                    animate={{ color: ['hsl(8,78%,58%)', 'hsl(42,90%,55%)', 'hsl(340,70%,55%)', 'hsl(8,78%,58%)'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="font-bold"
                  >
                    actually love
                  </motion.span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm md:text-base text-primary-foreground/70 font-body mb-8 max-w-md drop-shadow"
                >
                  Pick dishes, not restaurants. Real photos, verified ratings.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    document.getElementById('taste-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-accent-foreground font-body font-bold text-lg shadow-elevated cursor-pointer transition-shadow hover:shadow-food"
                >
                  <Search className="w-5 h-5" />
                  Find My Food
                </motion.button>
              </div>
            </section>

            {/* Cuisine Category Filters */}
            <section className="w-full bg-card border-b border-border overflow-hidden">
              <div className="max-w-3xl mx-auto px-4 py-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-sm font-body text-muted-foreground text-center mb-4 tracking-wide uppercase"
                >
                  Quick Browse
                </motion.p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
                  {CUISINE_CATEGORIES.map((cat, i) => {
                    const isActive = cat.tastes.length > 0 && cat.tastes.every((t) => selectedTastes.includes(t));
                    return (
                      <motion.button
                        key={cat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i, type: 'spring', stiffness: 300, damping: 20 }}
                        whileHover={{ scale: 1.08, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedTastes(cat.tastes.slice(0, 5));
                          document.getElementById('taste-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-colors cursor-pointer min-w-[80px] group ${
                          isActive
                            ? 'border-accent bg-accent/15 shadow-md ring-1 ring-accent/30'
                            : 'border-border bg-muted/60 hover:bg-accent/10 hover:border-accent/40'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors ${isActive ? '' : 'group-hover:bg-accent/20'}`}
                          style={{ backgroundColor: isActive ? `${cat.color}30` : `${cat.color}15` }}
                        >
                          <cat.icon className="w-5 h-5 transition-colors" style={{ color: cat.color }} />
                        </div>
                        <span className={`text-xs font-body font-semibold whitespace-nowrap ${
                          isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
                        }`}>
                          {cat.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Taste Selection Section */}
            <section id="taste-section" className="flex flex-col items-center px-4 py-16 bg-background">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-display text-foreground mb-2"
              >
                What sounds good?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground font-body text-center mb-10 max-w-sm"
              >
                Pick up to 5 tastes to find your perfect meal.
              </motion.p>

              {/* Taste Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md w-full mb-8">
                {PRIMARY_TASTES.map((taste, i) => (
                  <motion.div
                    key={taste}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <TasteTile
                      taste={taste}
                      selected={selectedTastes.includes(taste)}
                      onToggle={() => toggleTaste(taste)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Counter + Continue */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-body">
                    {selectedTastes.length}/5 selected
                  </span>
                  {selectedTastes.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedTastes([])}
                      className="text-xs font-body font-medium text-destructive/80 hover:text-destructive px-2 py-0.5 rounded-full border border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      Clear All
                    </motion.button>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowRestaurants(true)}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-accent-foreground font-body font-semibold text-base shadow-food transition-shadow hover:shadow-elevated cursor-pointer"
                >
                  {selectedTastes.length === 0 ? 'Browse All' : 'Show Me Food'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                {selectedTastes.length === 0 && (
                  <button
                    onClick={() => setShowRestaurants(true)}
                    className="text-sm text-muted-foreground underline underline-offset-2 font-body cursor-pointer"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="restaurant-list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-screen px-4 py-6 max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-display text-foreground">FoodMan</h2>
              </div>
              <button
                onClick={() => setShowRestaurants(false)}
                className="text-sm font-body text-muted-foreground underline underline-offset-2 cursor-pointer"
              >
                Change tastes
              </button>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2.5 mb-4 border border-border focus-within:border-accent/40 transition-colors">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants…"
                className="bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-full hover:bg-accent/20 cursor-pointer shrink-0">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Selected tastes */}
            {selectedTastes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTastes.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-body font-medium">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRestaurants.map((restaurant, i) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={i} />
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body">No restaurants match your tastes yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
