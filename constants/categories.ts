import Ionicons from '@expo/vector-icons/Ionicons';

export const REQUEST_CATEGORIES = [
  { id: 'food', label: 'Food & Essentials', icon: 'cart-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'health', label: 'Health & Personal Care', icon: 'medical-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'rent', label: 'Rent & Utilities', icon: 'home-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'family', label: 'Family & Emergencies', icon: 'people-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'education', label: 'Education & Skills', icon: 'school-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'transport', label: 'Transport', icon: 'car-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'work', label: 'Work & Hustle Support', icon: 'briefcase-outline' as keyof typeof Ionicons.glyphMap },
  { id: 'help', label: 'Just need Help', icon: 'heart-outline' as keyof typeof Ionicons.glyphMap },
] as const;

export type CategoryId = (typeof REQUEST_CATEGORIES)[number]['id'];

/** Emoji shown on success / share surfaces (matches marketing mockups per category). */
export const CATEGORY_EMOJI: Record<CategoryId, string> = {
  food: '🛒',
  health: '💊',
  rent: '🏠',
  family: '👨‍👩‍👧',
  education: '📚',
  transport: '🚗',
  work: '💼',
  help: '💛',
};

export function categoryEmojiForId(categoryId: string): string {
  return CATEGORY_EMOJI[categoryId as CategoryId] ?? '🙌';
}
