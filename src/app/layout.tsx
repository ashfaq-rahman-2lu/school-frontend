import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import './globals.css';
export const metadata: Metadata = { title: 'School community', description: 'Your school’s online home.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): ReactElement {
  return <html lang="en"><body>{children}</body></html>;
}
