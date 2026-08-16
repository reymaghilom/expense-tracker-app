import { LegalScreen } from '@/components/legal/LegalScreen';
import { termsContent } from '@/i18n/legal-content';
import { useAppSettings } from '@/contexts/app-settings';

export default function TermsScreen() {
  const { language, t } = useAppSettings();
  return <LegalScreen title={t.legal.termsTitle} sections={termsContent[language]} />;
}
