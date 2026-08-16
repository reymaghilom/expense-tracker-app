import type { Language } from '@/i18n/translations';

export interface LegalSection {
  heading: string;
  body: string;
}

const termsEn: LegalSection[] = [
  {
    heading: '1. Purpose of the App',
    body: 'Income & Expense Tracker is a personal finance tool that helps you record and review your own income and expense transactions. It is intended for personal, informal money tracking only.',
  },
  {
    heading: '2. Personal Financial Tracking',
    body: 'All amounts, categories, notes, and receipts you enter are for your own reference. The app does not connect to any bank, e-wallet, or financial institution, and does not automatically import or verify any transaction.',
  },
  {
    heading: '3. Accuracy of Data and Calculations',
    body: 'Totals, balances, and charts are calculated directly from the transactions you enter. You are responsible for entering accurate amounts, dates, and categories. The app performs straightforward arithmetic on your data but cannot detect or correct mistakes you make when entering a transaction.',
  },
  {
    heading: '4. Local Storage and Device Responsibility',
    body: 'All data is stored locally on your device using an on-device database. There is no cloud account and no automatic sync between devices. If your device is lost, damaged, reset, or the app is uninstalled without a backup, your data may be permanently lost.',
  },
  {
    heading: '5. Backup Responsibility',
    body: 'The app provides a manual Backup & Restore feature. Creating and safely storing backup files is your responsibility. The app cannot recover data that was never backed up.',
  },
  {
    heading: '6. No Financial, Accounting, Investment, Tax, or Legal Advice',
    body: 'This app is a record-keeping tool only. Nothing in the app constitutes financial, accounting, investment, tax, or legal advice. Consult a qualified professional for decisions that require expert advice.',
  },
  {
    heading: '7. Limitation of Liability',
    body: 'The app is provided "as is," without warranties of any kind. The developers are not liable for any loss of data, financial loss, or other damages arising from the use, misuse, or inability to use this app.',
  },
  {
    heading: '8. App Changes and Updates',
    body: 'Features, screens, and these Terms may change in future updates as the app is improved. Continued use of the app after an update constitutes acceptance of the current Terms.',
  },
  {
    heading: '9. Acceptance of Terms',
    body: 'By using this app, you acknowledge that you have read and understood these Terms of Use.',
  },
];

const termsCeb: LegalSection[] = [
  {
    heading: '1. Katuyoan sa App',
    body: 'Ang Income & Expense Tracker usa ka personal nga himan sa pananalapi nga makatabang nimo sa pagrekord ug pagrepaso sa imong kaugalingong kita ug gasto. Kini para lamang sa personal, dili-pormal nga pagsubay sa kwarta.',
  },
  {
    heading: '2. Personal nga Pagsubay sa Pananalapi',
    body: 'Tanang kantidad, kategorya, nota, ug resibo nga imong isulod para lamang sa imong kaugalingong reperensya. Ang app dili konektado sa bangko, e-wallet, o bisan unsang institusyon sa pananalapi, ug dili automatic nga mag-import o mag-verify sa bisan unsang transaksyon.',
  },
  {
    heading: '3. Kasibo sa Datos ug Kalkulasyon',
    body: 'Ang mga total, balanse, ug graph gikalkula direkta gikan sa mga transaksyon nga imong gisulod. Ikaw ang responsable sa pagsulod og tama nga kantidad, petsa, ug kategorya. Ang app naghimo lang og yano nga aritmetika sa imong datos apan dili makadeteksyon o makaayo sa sayop nga imong nasulod.',
  },
  {
    heading: '4. Lokal nga Pagtipig ug Responsibilidad sa Device',
    body: 'Ang tanang datos gitipig lokal sa imong device gamit ang database nga naa mismo sa device. Walay cloud account ug walay automatic nga pag-sync tali sa mga device. Kung mawala, madaot, ma-reset ang imong device, o ma-uninstall ang app nga walay backup, ang imong datos mahimong permanenteng mawala.',
  },
  {
    heading: '5. Responsibilidad sa Backup',
    body: 'Ang app naghatag og manual nga Backup & Restore nga feature. Ang paghimo ug pagtipig og luwas sa backup files imong responsibilidad. Dili mahimo sa app nga mabawi ang datos nga wala gyud gi-backup.',
  },
  {
    heading: '6. Dili Tambag sa Pananalapi, Accounting, Investment, Buhis, o Legal',
    body: 'Kini nga app usa lamang ka himan sa pagrekord. Walay bisan unsa niini nga app nga giisip nga tambag sa pananalapi, accounting, investment, buhis, o legal. Pakisayod sa kwalipikadong propesyonal para sa mga desisyon nga nagkinahanglan og eksperto nga tambag.',
  },
  {
    heading: '7. Limitasyon sa Liability',
    body: 'Ang app gihatag "as is," walay garantiya sa bisan unsang klase. Ang mga developer dili manubag sa bisan unsang pagkawala sa datos, kadaot sa pananalapi, o uban pang kadaot nga mahitabo gikan sa paggamit, sayop nga paggamit, o kawalay katakos sa paggamit niini nga app.',
  },
  {
    heading: '8. Kausaban sa App',
    body: 'Ang mga feature, screen, ug kining mga Termino mahimong mausab sa umaabot nga update samtang gina-improve ang app. Ang padayon nga paggamit sa app human sa update nagpasabot nga gidawat nimo ang kasamtangang mga Termino.',
  },
  {
    heading: '9. Pagdawat sa mga Termino',
    body: 'Pinaagi sa paggamit niini nga app, gikumpirma nimo nga imo nang nabasa ug nasabtan kining mga Termino sa Paggamit.',
  },
];

const privacyEn: LegalSection[] = [
  {
    heading: '1. Overview',
    body: 'This app is local-first: your financial data stays on your device. There is no user account, login, or backend server that collects your transactions.',
  },
  {
    heading: '2. Data You Enter',
    body: 'You may enter transaction amounts, types (income or expense), categories, payment methods, dates, and optional notes. This information is used only to display your totals, lists, and charts within the app.',
  },
  {
    heading: '3. Local Device Storage',
    body: 'All transactions, categories, and settings are stored in a database file on your device. This app does not transmit this data to any server, and the developers do not have access to it.',
  },
  {
    heading: '4. Receipt Images',
    body: 'If you attach a receipt photo to a transaction, the app stores a reference (file path) to that image on your device, using the permission you grant to your photo library. The image file itself remains in your device storage — it is not uploaded anywhere by this app.',
  },
  {
    heading: '5. Backup and Export Files',
    body: 'When you create a backup or export a CSV report, the app generates a file on your device and hands it to the sharing option you choose (for example, Files, email, or another app). Where that file ends up, and who can access it, depends on the destination you pick — this app does not upload it to any server on your behalf.',
  },
  {
    heading: '6. No Sale of Data, No Server Collection',
    body: 'This app does not sell, rent, or share your data with third parties, and does not collect analytics or usage data on a remote server, because it does not operate one.',
  },
  {
    heading: '7. Your Responsibility',
    body: 'Because your data lives on your device and in any backup/export files you create, keeping your device and those files secure (screen lock, safe storage location, etc.) is your responsibility.',
  },
  {
    heading: '8. Data Deletion',
    body: 'You can delete individual transactions or categories at any time from within the app. "Clear All Data" in Settings permanently deletes all transactions on your device (categories and settings are kept). Uninstalling the app removes its local database entirely.',
  },
  {
    heading: '9. Changes to This Policy',
    body: 'This Privacy Policy may be updated as the app changes. The version shown in the app always reflects its current data-handling behavior.',
  },
  {
    heading: '10. Developers',
    body: 'This app is developed and maintained by Rey C. Maghilom and Cris S. Basco.',
  },
];

const privacyCeb: LegalSection[] = [
  {
    heading: '1. Kinatibuk-an',
    body: 'Kini nga app local-first: ang imong datos sa pananalapi nagpabilin sa imong device. Walay account, walay login, ug walay backend server nga naga-kolekta sa imong mga transaksyon.',
  },
  {
    heading: '2. Datos nga Imong Gisulod',
    body: 'Mahimo kang mosulod og kantidad sa transaksyon, tipo (kita o gasto), kategorya, paagi sa pagbayad, petsa, ug opsyonal nga nota. Kini nga impormasyon gigamit lamang aron ipakita ang imong mga total, listahan, ug graph sulod sa app.',
  },
  {
    heading: '3. Lokal nga Pagtipig sa Device',
    body: 'Tanang transaksyon, kategorya, ug setting gitipig sa database file diha sa imong device. Kini nga app dili nagpadala niini nga datos sa bisan unsang server, ug ang mga developer walay access niini.',
  },
  {
    heading: '4. Litrato sa Resibo',
    body: 'Kung mag-attach ka og litrato sa resibo sa transaksyon, ang app magtipig og reperensya (file path) niana nga litrato sa imong device, gamit ang permiso nga imong gitugot sa imong photo library. Ang litrato mismo magpabilin sa storage sa imong device — dili kini i-upload bisan asa niini nga app.',
  },
  {
    heading: '5. Backup ug Export Files',
    body: 'Kung maghimo ka og backup o mag-export og CSV report, ang app maghimo og file diha sa imong device ug itugyan kini sa opsyon sa pag-share nga imong pilion (pananglitan, Files, email, o laing app). Kung asa mahiadto kana nga file, ug kinsay makaabli niini, nagdepende sa destinasyon nga imong gipili — kini nga app dili mo-upload niini sa bisan unsang server.',
  },
  {
    heading: '6. Walay Pagbaligya sa Datos, Walay Server nga Nagkolekta',
    body: 'Kini nga app dili nagbaligya, nagpaarkila, o nagbahin sa imong datos ngadto sa ikatulong partido, ug dili nagkolekta og analytics o usage data sa remote server, tungod kay wala kini nagpadagan og server.',
  },
  {
    heading: '7. Imong Responsibilidad',
    body: 'Tungod kay ang imong datos naa sa imong device ug sa bisan unsang backup/export files nga imong gihimo, ang pagpanalipod sa imong device ug niadtong mga files (screen lock, luwas nga storage, uban pa) imong responsibilidad.',
  },
  {
    heading: '8. Pagtangtang sa Datos',
    body: 'Mahimo nimong tangtangon ang indibidwal nga transaksyon o kategorya bisan kanus-a sulod sa app. Ang "Tangtangon Tanang Datos" sa Setting permanenteng magtangtang sa tanang transaksyon sa imong device (ang kategorya ug setting mahibilin). Ang pag-uninstall sa app magtangtang sa tibuok lokal nga database niini.',
  },
  {
    heading: '9. Kausaban niini nga Palisiya',
    body: 'Kini nga Privacy Policy mahimong ma-update samtang mausab ang app. Ang bersyon nga gipakita sa app kanunay nagpakita sa kasamtangang paagi sa pagdumala sa datos.',
  },
  {
    heading: '10. Mga Developer',
    body: 'Kini nga app gihimo ug gi-atiman ni Rey C. Maghilom ug Cris S. Basco.',
  },
];

export const termsContent: Record<Language, LegalSection[]> = { en: termsEn, ceb: termsCeb };
export const privacyContent: Record<Language, LegalSection[]> = { en: privacyEn, ceb: privacyCeb };
