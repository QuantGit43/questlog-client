import React from 'react';

type MainContentProps = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      {children}
    </main>
  );
};