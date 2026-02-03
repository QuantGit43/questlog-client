'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import './ClassSelection.css'; // Твій CSS файл

// ДАНІ КЛАСІВ
const CLASS_DATA = [
    {
        id: 1, // Переконайся, що ці ID збігаються з ID в базі даних (якщо вони там є)
        title: 'The Healer',
        description: 'Your path is to maintain a balance between body and spirit. Your quests revolve around self-care: proper nutrition, adequate sleep, meditation, and stress management',
        imageSrc: '/images/avatar_healer.png'
    },
    {
        id: 2,
        title: 'The Warrior',
        description: 'Your quests are challenges that require willpower: regular training, adherence to a regimen, fighting bad habits, achieving difficult goals.',
        imageSrc: '/images/avatar_warrior.png'
    },
    {
        id: 3,
        title: 'The Crafter',
        description: 'Your passion is to build, create, and constantly improve. Your tasks are focused on completing projects, from learning a new language or skill to starting your own business or writing a book.',
        imageSrc: '/images/avatar_crafter.png'
    },
    {
        id: 4,
        title: 'The Mage',
        description: 'Your path of continuous learning and intellectual development. Your quests are related to deepening knowledge: reading books, taking courses, studying complex topics, solving logical problems.',
        imageSrc: '/images/avatar_mage.png'
    }
];

const ClassSelectionPage = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectClass = (item: any) => {
        setSelectedClass(item);
        setIsModalOpen(false);
    };

    const handleEmbraceJourney = async () => {
        if (!selectedClass) return;
        setIsLoading(true);

        try {
            // 1. Відправляємо запит на бекенд для створення аватара/вибору класу
            await authService.selectClass(selectedClass.id, selectedClass.title);
            
            console.log(`User selected class: ${selectedClass.title}`);
            
            // 2. Успіх -> Переходимо на Дашборд
            router.push('/dashboard');
            
        } catch (error) {
            console.error("Failed to select class:", error);
            alert("Something went wrong with creating your hero. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="class-selection-wrapper">
            {/* Текст обраного класу */}
            {selectedClass && (
                <div style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10, position: 'relative' }}>
                    <p style={{ color: 'white', fontFamily: 'monospace', fontSize: '1.5rem', textShadow: '2px 2px #000' }}>
                        You are: <span style={{ color: '#ffd700' }}>{selectedClass.title}</span>
                    </p>
                </div>
            )}

            {/* Кнопки головного екрану */}
            <div style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>

                {!selectedClass && (
                    <button
                        className="pixel-btn btn-blue"
                        onClick={() => setIsModalOpen(true)}
                    >
                        CHOOSE YOUR CLASS!
                    </button>
                )}

                {selectedClass && (
                    <>
                        <button
                            className="pixel-btn btn-green"
                            onClick={handleEmbraceJourney}
                            disabled={isLoading}
                        >
                            {isLoading ? "SUMMONING..." : "EMBRACE YOUR JOURNEY!"}
                        </button>

                        <button
                            className="pixel-btn btn-gray"
                            onClick={() => setIsModalOpen(true)}
                            disabled={isLoading}
                        >
                            CHANGE CLASS
                        </button>
                    </>
                )}
            </div>

            {/* МОДАЛКА (без змін логіки, тільки типи) */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content--wide">
                        <h2 className="modal-title">SELECT YOUR DESTINY</h2>

                        <div className="class-banner-list">
                            {CLASS_DATA.map((item) => (
                                <div
                                    key={item.id}
                                    className="class-banner pixel-border-gold"
                                    onClick={() => handleSelectClass(item)}
                                >
                                    <div className="banner-avatar-container pixel-border-inner">
                                        {item.imageSrc ? (
                                            <img src={item.imageSrc} alt={item.title} className="banner-avatar-img" />
                                        ) : (
                                            <div className="avatar-placeholder"></div>
                                        )}
                                    </div>

                                    <div className="banner-text-container">
                                        <h3 className="banner-title">{item.title}</h3>
                                        <p className="banner-description">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="pixel-btn btn-red"
                            onClick={() => setIsModalOpen(false)}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassSelectionPage;