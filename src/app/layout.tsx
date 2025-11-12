import type { Metadata } from 'next';
import './globals.css';

// Імпортуємо наші нові компоненти!
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
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
        <meta name="theme-color" content="#111827" /> {/* Темний колір, як у сайдбара */}
      </head>
      <body>
        {/* Ми використовуємо Flexbox, щоб створити "святий грааль" лейаут.
          h-screen = повна висота екрану
          flex = увімкнути flexbox
        */}
        <div className="flex h-screen bg-gray-100">
          
          {/* 1. Наш Сайдбар (ліворуч, фіксований) */}
          <Sidebar />

          {/* 2. Контейнер для Хедера та Контенту (праворуч) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* 2a. Наш Хедер (зверху) */}
            <Header />

            {/* 2b. Наш Головний Контент (решта простору) */}
            <MainContent>
              {children} {/* <--- Сюди потрапить ваш page.tsx */}
            </MainContent>

          </div>
        </div>
      </body>
    </html>
  );
}