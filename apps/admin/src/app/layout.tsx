import { Inter } from 'next/font/google';
import type React from 'react';
import { ReactQueryProvider } from './react-query-provider';
import './globals.css';

import type { Metadata } from 'next';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'artloupe Admin',
  description: 'Admin panel for artloupe',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className={inter.className}>
          <ReactQueryProvider>
            <div>{children}</div>
          </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
