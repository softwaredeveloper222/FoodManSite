import { motion } from 'framer-motion';
import { Restaurant } from '@/types/food';
import { useNavigate } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-card bg-card group"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-display text-primary-foreground">{restaurant.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {restaurant.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center gap-2">
        <div className="flex -space-x-2">
          {restaurant.dishes.slice(0, 3).map((dish) => (
            <img
              key={dish.id}
              src={dish.image}
              alt={dish.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-card"
              loading="lazy"
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{restaurant.dishes.length} dishes</span>
      </div>
    </motion.div>
  );
}
