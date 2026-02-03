import React from 'react';

type MainContentProps = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 w-full font-pixel relative">
      {children}
    </main>
  );
}; 