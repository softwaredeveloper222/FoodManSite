import { motion, AnimatePresence } from 'framer-motion';
import { Dish } from '@/types/food';

interface DishCardProps {
  dish: Dish;
  rank: number | null; // 1-5 or null
  onTap: () => void;
}

const RANK_COLORS = [
  'bg-primary',
  'bg-primary/85',
  'bg-primary/70',
  'bg-primary/55',
  'bg-primary/40',
];

export function DishCard({ dish, rank, onTap }: DishCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
    >
      <img
        src={dish.image}
        alt={dish.name}
        className={`w-full h-full object-cover transition-all duration-300 ${rank ? 'brightness-75' : 'group-hover:scale-105'}`}
        loading="lazy"
      />
      
      {/* Name overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-2">
        <p className="text-xs font-body font-medium text-primary-foreground truncate">{dish.name}</p>
        {dish.modifiers.length > 0 && (
          <div className="flex gap-1 mt-0.5">
            {dish.modifiers.map((m) => (
              <span key={m} className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/80 text-accent-foreground">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rank badge */}
      <AnimatePresence>
        {rank && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full ${RANK_COLORS[rank - 1]} flex items-center justify-center`}
          >
            <span className="text-sm font-bold text-primary-foreground">#{rank}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
