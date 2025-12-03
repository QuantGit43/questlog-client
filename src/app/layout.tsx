import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google'; 
import './globals.css';
import { MainContent } from '@/components/layout/MainContent';

const pixelFont = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'QuestLog',
  description: 'Turn Your Life into an Epic RPG',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${pixelFont.variable} antialiased bg-[#2d1b4e]`}>
        <div className="flex min-h-screen flex-col">    
            <MainContent>
              {children}
            </MainContent>
        </div>
      </body>
    </html>
  );
}