import { CONFIG } from 'src/config-global';

import { QuestView } from 'src/sections/quest/view/quest-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Quest  - ${CONFIG.site.name}` };

export default function Page() {
  return <QuestView />;
}
