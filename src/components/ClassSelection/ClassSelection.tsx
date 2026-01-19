'use client';

import React, { useState } from 'react';
import './ClassSelection.css';

// ДАННЫЕ КЛАССОВ (Кавычки убраны)
const CLASS_DATA = [
    {
        id: 1,
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

const ClassSelection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);

    const handleSelectClass = (item: any) => {
        setSelectedClass(item);
        setIsModalOpen(false);
    };

    const handleEmbraceJourney = () => {
        alert(`Journey started as ${selectedClass.title}!`);
        // Здесь будет логика перехода на следующую страницу или сохранение в базу
    };

    return (
        <div className="class-selection-wrapper">

            {/* Если класс выбран, показываем его название. Если нет - пусто или заголовок */}
            {selectedClass && (
                <div style={{ textAlign: 'center', marginBottom: '30px', zIndex: 10, position: 'relative' }}>
                    <p style={{ color: 'white', fontFamily: 'monospace', fontSize: '1.5rem', textShadow: '2px 2px #000' }}>
                        You are: <span style={{ color: '#ffd700' }}>{selectedClass.title}</span>
                    </p>
                </div>
            )}

            {/* ЛОГИКА КНОПОК НА ГЛАВНОМ ЭКРАНЕ */}
            <div style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>

                {/* Сценарий 1: Класс ЕЩЕ НЕ выбран */}
                {!selectedClass && (
                    <button
                        className="pixel-btn btn-blue"
                        onClick={() => setIsModalOpen(true)}
                    >
                        CHOOSE YOUR CLASS!
                    </button>
                )}

                {/* Сценарий 2: Класс УЖЕ выбран */}
                {selectedClass && (
                    <>
                        <button
                            className="pixel-btn btn-green"
                            onClick={handleEmbraceJourney}
                        >
                            EMBRACE YOUR JOURNEY!
                        </button>

                        <button
                            className="pixel-btn btn-gray"
                            onClick={() => setIsModalOpen(true)}
                        >
                            CHANGE CLASS
                        </button>
                    </>
                )}
            </div>

            {/* МОДАЛЬНОЕ ОКНО ВЫБОРА */}
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
                                    {/* Аватар */}
                                    <div className="banner-avatar-container pixel-border-inner">
                                        {item.imageSrc ? (
                                            <img src={item.imageSrc} alt={item.title} className="banner-avatar-img" />
                                        ) : (
                                            <div className="avatar-placeholder"></div>
                                        )}
                                    </div>

                                    {/* Текст */}
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

export default ClassSelection;