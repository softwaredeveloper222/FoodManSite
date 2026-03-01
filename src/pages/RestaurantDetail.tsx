import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { restaurants } from '@/data/mockData';
import { DishCard } from '@/components/DishCard';
import { ArrowLeft, ExternalLink } from 'lucide-react';


export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === id);
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);

  const handleDishTap = useCallback((dishId: string) => {
    setSelectedDishIds((prev) => {
      if (prev.includes(dishId)) return prev.filter((d) => d !== dishId);
      if (prev.length >= 5) return prev;
      return [...prev, dishId];
    });
  }, []);

  const handleContinue = () => {
    if (!restaurant || selectedDishIds.length === 0) return;

    // Create redirect token
    const token = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      restaurantId: restaurant.id,
      dishIds: selectedDishIds,
      createdAt: Date.now(),
      ratingAvailableAt: Date.now() + 60 * 60 * 1000, // 60 min
    };

    // Store token
    const existing = JSON.parse(localStorage.getItem('foodman_tokens') || '[]');
    existing.push(token);
    localStorage.setItem('foodman_tokens', JSON.stringify(existing));

    // Redirect (in demo, navigate to rating page instead)
    navigate(`/rating/${token.id}`);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-body">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-display text-primary-foreground">{restaurant.name}</h1>
          <div className="flex gap-1 mt-1">
            {restaurant.categories.map((c) => (
              <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground font-body text-center">
          Tap dishes to rank your top 5 picks
        </p>
      </div>

      {/* 3×3 Dish Grid */}
      <div className="px-4 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {restaurant.dishes.slice(0, 9).map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              rank={selectedDishIds.includes(dish.id) ? selectedDishIds.indexOf(dish.id) + 1 : null}
              onTap={() => handleDishTap(dish.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      {selectedDishIds.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-elevated"
        >
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="text-sm font-body text-muted-foreground">
              {selectedDishIds.length}/5 selected
            </span>
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-body font-semibold shadow-food cursor-pointer"
            >
              Continue
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
