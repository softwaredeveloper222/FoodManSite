import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmojiRatingComponent } from '@/components/EmojiRating';
import { EmojiRating, RatingTag, RedirectToken } from '@/types/food';
import { restaurants } from '@/data/mockData';
import { ArrowLeft, Clock, UtensilsCrossed, Check } from 'lucide-react';

export default function RatingPage() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<RedirectToken | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiRating | null>(null);
  const [selectedTags, setSelectedTags] = useState<RatingTag[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const tokens: RedirectToken[] = JSON.parse(localStorage.getItem('foodman_tokens') || '[]');
    const found = tokens.find((t) => t.id === tokenId);
    if (found) {
      setToken(found);
      // For demo: make available immediately if within 2 hours, or check time
      const now = Date.now();
      if (now >= found.ratingAvailableAt) {
        setIsAvailable(true);
      } else {
        setTimeLeft(found.ratingAvailableAt - now);
      }
    }
  }, [tokenId]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          setIsAvailable(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleTagToggle = (tag: RatingTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    // In a real app: require magic-link login, then save rating
    setSubmitted(true);
  };

  const restaurant = token ? restaurants.find((r) => r.id === token.restaurantId) : null;
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!token || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-body">Token not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-background px-4 gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display text-foreground">Thanks for rating!</h1>
        <p className="text-muted-foreground font-body text-center">Your verified review helps others discover great food.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-body font-semibold cursor-pointer"
        >
          Explore More
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h2 className="text-xl font-display text-foreground">Rate your experience</h2>
            <p className="text-sm text-muted-foreground font-body">{restaurant.name}</p>
          </div>
        </div>

        {/* Selected dishes */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {token.dishIds.map((dishId) => {
            const dish = restaurant.dishes.find((d) => d.id === dishId);
            if (!dish) return null;
            return (
              <div key={dishId} className="flex-shrink-0 w-16">
                <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-xl object-cover" />
                <p className="text-[10px] text-muted-foreground font-body mt-1 truncate text-center">{dish.name}</p>
              </div>
            );
          })}
        </div>

        {/* Time gate */}
        {!isAvailable ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <Clock className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-display text-foreground">Rating unlocks soon</p>
            <p className="text-3xl font-body font-bold text-primary">{formatTime(timeLeft)}</p>
            <p className="text-sm text-muted-foreground font-body max-w-xs mx-auto">
              To keep reviews authentic, you can rate after enjoying your meal.
            </p>
            <button
              onClick={() => setIsAvailable(true)}
              className="text-xs text-muted-foreground underline cursor-pointer mt-4"
            >
              (Demo: unlock now)
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <EmojiRatingComponent
              selectedEmoji={selectedEmoji}
              selectedTags={selectedTags}
              onEmojiSelect={setSelectedEmoji}
              onTagToggle={handleTagToggle}
            />

            {selectedEmoji && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold shadow-food cursor-pointer"
                >
                  Submit Rating
                </button>
              </motion.div>
            )}

            <p className="text-xs text-center text-muted-foreground font-body">
              <UtensilsCrossed className="w-3 h-3 inline mr-1" />
              Verified review — you visited this restaurant
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
