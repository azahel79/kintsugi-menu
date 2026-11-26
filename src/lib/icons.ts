/**
 * Íconos Material Symbols que usa el proyecto. Google solo envía estos glifos
 * (la fuente completa pesa varios MB). Si agregas un ícono nuevo, agrégalo aquí.
 */
export const ICONOS_INGREDIENTE = [
  'bakery_dining', 'eco', 'egg', 'egg_alt', 'grass', 'local_florist', 'nutrition',
  'phishing', 'restaurant', 'set_meal', 'skillet', 'spa', 'sunny', 'water',
] as const;

const ICONOS_UI = [
  'add', 'arrow_back', 'check_circle', 'chevron_right', 'close', 'dashboard', 'delete',
  'error', 'expand_more', 'image', 'local_offer', 'location_on', 'lock', 'login', 'logout',
  'mail', 'palette', 'photo_camera', 'ramen_dining', 'restaurant_menu', 'restart_alt',
  'save', 'schedule', 'search', 'search_off', 'settings', 'thumb_up', 'chat', 'visibility',
  'visibility_off', 'category', 'key', 'open_in_new', 'arrow_upward', 'arrow_downward',
] as const;

const todos = Array.from(new Set<string>([...ICONOS_INGREDIENTE, ...ICONOS_UI])).sort();

export const MATERIAL_SYMBOLS_URL =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1' +
  `&icon_names=${todos.join(',')}&display=block`;
