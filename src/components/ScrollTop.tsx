'use client';

import {useScrollTopWhenReady} from '@/lib/scroll-top';

// For a page that renders on the server and still opens part way down. Nothing is being
// waited for here -- the content is already whole -- so it is ready the moment it mounts,
// and the only job is to undo the scroll offset carried over from the page before.
export function ScrollTop(){
  useScrollTopWhenReady(true);
  return null;
}
