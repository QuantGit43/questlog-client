'use client'; // 1. Кажемо Next.js, що це код для браузера (Клієнтський Компонент)

import { useEffect, useState } from 'react';

export default function Home() {
  
  // 2. Створюємо "стан", де будемо зберігати відповідь від API
  const [apiMessage, setApiMessage] = useState("Connecting to backend...");

  useEffect(() => {
    // 3. Це запускається автоматично, коли сторінка завантажилась
    
    // Перевіряємо, чи ми взагалі "бачимо" нашу адресу
    if (!process.env.NEXT_PUBLIC_API_URL) {
      setApiMessage("Error: NEXT_PUBLIC_API_URL is not set in .env.local");
      return;
    }

    // А ось і ваш код!
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ping`)
      .then(res => {
        // Якщо відповідь не ОК (напр., 404 або 500), кидаємо помилку
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // 4. Зберігаємо успішну відповідь (якщо вона є)
        setApiMessage(data.message || "Connected, but got empty message");
      })
      .catch(error => {
        // 5. Ловимо помилку (напр., API не запущено або CORS не налаштовано)
        console.error('Fetch error:', error);
        setApiMessage("Failed to connect. Is API running? Is CORS configured?");
      });

  }, []); // [] = запустити цей код 1 раз при завантаженні

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>QuestLog Client</h1>
      <hr />
      <h2>API Connection Test:</h2>
      <p style={{ fontFamily: 'monospace', background: '#000', padding: '1rem' }}>
        <strong>Status: </strong> {apiMessage}
      </p>
    </main>
  );
}