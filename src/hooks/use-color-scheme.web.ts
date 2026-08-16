import { useAppSettings } from '@/contexts/app-settings';

/** Resolved app color scheme — respects the user's Appearance setting (System/Light/Dark). */
export function useColorScheme() {
  return useAppSettings().colorScheme;
}
