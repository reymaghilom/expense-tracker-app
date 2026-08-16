import { useAppSettings } from '@/contexts/app-settings';

/** The active language's translation dictionary, e.g. `t.dashboard.title`. */
export function useTranslation() {
  return useAppSettings().t;
}
