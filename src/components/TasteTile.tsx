import { motion } from 'framer-motion';
import { PrimaryTaste, TASTE_ICONS } from '@/types/food';

const TASTE_BG: Record<PrimaryTaste, string> = {
  'Savory': 'bg-taste-savory/15 border-taste-savory/40',
  'Sweet': 'bg-taste-sweet/15 border-taste-sweet/40',
  'Fresh': 'bg-taste-fresh/15 border-taste-fresh/40',
  'Cheesy': 'bg-taste-cheesy/15 border-taste-cheesy/40',
  'Crispy': 'bg-taste-crispy/15 border-taste-crispy/40',
  'Comfort': 'bg-taste-comfort/15 border-taste-comfort/40',
  'Something New': 'bg-taste-new/15 border-taste-new/40',
};

const TASTE_BG_SELECTED: Record<PrimaryTaste, string> = {
  'Savory': 'bg-taste-savory border-taste-savory',
  'Sweet': 'bg-taste-sweet border-taste-sweet',
  'Fresh': 'bg-taste-fresh border-taste-fresh',
  'Cheesy': 'bg-taste-cheesy border-taste-cheesy',
  'Crispy': 'bg-taste-crispy border-taste-crispy',
  'Comfort': 'bg-taste-comfort border-taste-comfort',
  'Something New': 'bg-taste-new border-taste-new',
};

interface TasteTileProps {
  taste: PrimaryTaste;
  selected: boolean;
  onToggle: () => void;
}

export function TasteTile({ taste, selected, onToggle }: TasteTileProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={onToggle}
      className={`
        flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-colors cursor-pointer
        ${selected ? `${TASTE_BG_SELECTED[taste]} text-accent-foreground` : `${TASTE_BG[taste]} text-foreground`}
      `}
    >
      <span className="text-3xl">{TASTE_ICONS[taste]}</span>
      <span className="text-sm font-semibold font-body">{taste}</span>
    </motion.button>
  );
}
