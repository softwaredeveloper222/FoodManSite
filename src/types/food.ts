export type PrimaryTaste = 'Savory' | 'Sweet' | 'Fresh' | 'Cheesy' | 'Crispy' | 'Comfort' | 'Something New';
export type Modifier = 'Spicy' | 'Vegan' | 'Vegetarian';
export type Category =
  | 'Burgers & Sandwiches'
  | 'Pizza & Italian'
  | 'Asian'
  | 'Mexican & Latin'
  | 'Steak & Grill'
  | 'Seafood'
  | 'Salads & Bowls'
  | 'Comfort Classics'
  | 'Desserts & Sweets'
  | 'Drinks & Shakes';

export interface Dish {
  id: string;
  name: string;
  image: string;
  category: Category;
  primaryTaste: PrimaryTaste;
  modifiers: Modifier[];
}

export interface Restaurant {
  id: string;
  name: string;
  coverImage: string;
  categories: Category[];
  dishes: Dish[];
  redirectUrl: string;
  rating?: number;
}

export interface RedirectToken {
  id: string;
  restaurantId: string;
  dishIds: string[];
  createdAt: number;
  ratingAvailableAt: number;
}

export type EmojiRating = '😍' | '😋' | '😊' | '😐' | '😕';

export const RATING_TAGS = [
  'Worth the trip',
  'Great value',
  'Perfectly cooked',
  'Fresh ingredients',
  'Beautiful plating',
  'Generous portions',
  'Quick service',
  'Cozy vibes',
  'Would order again',
  'Overrated',
] as const;

export type RatingTag = typeof RATING_TAGS[number];

export const PRIMARY_TASTES: PrimaryTaste[] = ['Savory', 'Sweet', 'Fresh', 'Cheesy', 'Crispy', 'Comfort', 'Something New'];
export const MODIFIERS: Modifier[] = ['Spicy', 'Vegan', 'Vegetarian'];
export const CATEGORIES: Category[] = [
  'Burgers & Sandwiches', 'Pizza & Italian', 'Asian', 'Mexican & Latin',
  'Steak & Grill', 'Seafood', 'Salads & Bowls', 'Comfort Classics',
  'Desserts & Sweets', 'Drinks & Shakes',
];

export const TASTE_ICONS: Record<PrimaryTaste, string> = {
  'Savory': '🍖',
  'Sweet': '🍰',
  'Fresh': '🥗',
  'Cheesy': '🧀',
  'Crispy': '🍟',
  'Comfort': '🍲',
  'Something New': '✨',
};
