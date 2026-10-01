'use client';

import { useEffect, type ReactNode } from 'react';

// Survives route changes (module scope), so the very first load — which already has the
// intro — doesn't get a wipe, but every later navigation does.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const showWipe = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      {showWipe && <div aria-hidden className="page-wipe" />}
      <div className="animate-page-in">{children}</div>
    </>
  );
}
