'use client'; 

export const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">QuestLog</h1>
        <div className="flex items-center space-x-2">
          <span>(Тут буде XP-бар)</span>
          <span>(Тут буде Аватар)</span>
        </div>
      </div>
    </header>
  );
};