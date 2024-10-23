import { CONFIG } from 'src/config-global';

import { AdventureView } from 'src/sections/adventure/view/adventure-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Adventure - ${CONFIG.site.name}` };

export default function Page() {
  return <AdventureView />;
}
