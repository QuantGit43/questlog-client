import React from "react";

interface HeartDisplayProps {
  currentHp: number; // 0–100
}

export function HeartDisplay({ currentHp }: HeartDisplayProps) {
  // Обмежуємо здоров'я від 0 до 100
  const percentage = Math.min(Math.max(currentHp, 0), 100);

  return (
    // Контейнер для всієї смужки.
    // w-40 (160px) - підберіть ширину, яка відповідає реальному розміру вашої картинки
    // h-8 (32px) - висота смужки
    <div className="relative w-40 h-8">
      
      {/* ШАР 1: ФОН (Пусті серця)
         Тут має бути картинка heart_empty.png, яка ТАКОЖ має містити 5 пустих сердець у ряд.
         Якщо у вас її немає, скажіть, і ми зробимо її через CSS.
      */}
      <img
        src="/images/heart_empty.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-50 grayscale" 
        // Додав opacity/grayscale на випадок, якщо у вас немає окремої картинки empty, 
        // це зробить "повну" картинку сірою на фоні.
      />

      {/* ШАР 2: ЗДОРОВ'Я (Повні серця)
         Це "вікно", яке зменшується по ширині.
      */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      >
        {/* ВАЖЛИВО:
           Картинка всередині повинна мати фіксовану ширину (w-40), таку ж як контейнер.
           Завдяки цьому, коли батьківський div звужується, картинка не сплющується, 
           а просто обрізається справа.
        */}
        <img
          src="/images/heart_full.png"
          alt="Health"
          className="w-40 h-full max-w-none object-contain object-left"
        />
      </div>
    </div>
  );
}