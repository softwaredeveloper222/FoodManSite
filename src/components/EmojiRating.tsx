import { motion } from 'framer-motion';
import { EmojiRating as EmojiRatingType, RATING_TAGS, RatingTag } from '@/types/food';

const EMOJIS: EmojiRatingType[] = ['😍', '😋', '😊', '😐', '😕'];

interface EmojiRatingProps {
  selectedEmoji: EmojiRatingType | null;
  selectedTags: RatingTag[];
  onEmojiSelect: (emoji: EmojiRatingType) => void;
  onTagToggle: (tag: RatingTag) => void;
}

export function EmojiRatingComponent({ selectedEmoji, selectedTags, onEmojiSelect, onTagToggle }: EmojiRatingProps) {
  return (
    <div className="space-y-6">
      {/* Emoji row */}
      <div className="flex justify-center gap-3">
        {EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onEmojiSelect(emoji)}
            className={`text-4xl p-2 rounded-xl transition-colors cursor-pointer ${
              selectedEmoji === emoji ? 'bg-primary/15 ring-2 ring-primary' : 'hover:bg-muted'
            }`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {/* Tags */}
      {selectedEmoji && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {RATING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-body transition-colors cursor-pointer ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
