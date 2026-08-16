import { LegalScreen } from '@/components/legal/LegalScreen';
import { privacyContent } from '@/i18n/legal-content';
import { useAppSettings } from '@/contexts/app-settings';

export default function PrivacyScreen() {
  const { language, t } = useAppSettings();
  return <LegalScreen title={t.legal.privacyTitle} sections={privacyContent[language]} />;
}
