import type { Metadata } from 'next';
import './globals.css';

import { MainContent } from '@/components/layout/MainContent';

export const metadata: Metadata = {
  title: 'QuestLog',
  description: 'Гейміфікуй своє життя',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <meta name="theme-color" content="#111827" />
      </head>
      <body>
        <div className="flex h-screen bg-gray-100">    
          <div className="flex-1 flex flex-col overflow-hidden">          
            <MainContent>
              {children}
            </MainContent>
          </div>
        </div>
      </body>
    </html>
  );
}