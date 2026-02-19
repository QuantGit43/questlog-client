﻿'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import './ClassSelection.css';

const CLASS_DATA = [
    {
        id: 1,
        title: 'The Healer',
        description: 'A guardian of life who mends wounds and cures ailments.',
        imageSrc: '/images/avatar_healer.png',
        animationSrc: '/images/avatar_healer.png',
        heroCutout: '/images/hero_healer.png',
        cssClass: 'hero-healer'
    },
    {
        id: 2,
        title: 'The Warrior',
        description: 'A master of martial arts and heavy weaponry.',
        imageSrc: '/images/avatar_warrior.png',
        animationSrc: '/images/avatar_warrior.png',
        heroCutout: '/images/hero_warrior.png',
        cssClass: 'hero-warrior'
    },
    {
        id: 4,
        title: 'The Mage',
        description: 'A scholar of the arcane arts, wielding elemental forces.',
        imageSrc: '/images/avatar_mage.png',
        animationSrc: '/images/avatar_mage.png',
        heroCutout: '/images/hero_mage.png',
        cssClass: 'hero-mage'
    },
    {
        id: 3,
        title: 'The Crafter',
        description: 'An artisan of unparalleled skill.',
        imageSrc: '/images/avatar_crafter.png',
        animationSrc: '/images/avatar_crafter.png',
        heroCutout: '/images/hero_crafter.png',
        cssClass: 'hero-crafter'
    },
];

const ClassSelectionPage = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredClassId, setHoveredClassId] = useState<number | null>(null);

    const handleSelectClass = (item: any) => {
        setSelectedClass(item);
        setIsModalOpen(false);
    };

        const handleEmbraceJourney = async () => {
        if (!selectedClass) return;
        setIsLoading(true);

        try {
            await authService.selectClass(selectedClass.id, selectedClass.title);      
            router.push('/dashboard');
            
        } catch (error) {
            console.error(" [ClassSelection] Error selecting class:", error);
            alert("Something went wrong with creating your hero. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="class-selection-wrapper">
            <div className="scene-container">
                <img src="/images/prop-island.png" alt="Builder Island" className="scene-prop prop-builder-island" />
                <img src="/images/healer_island.png" alt="Healer Island" className="scene-prop prop-healer-island" />
                <img src="/images/dragon.png" alt="Dragon" className="scene-prop prop-dragon" />
            </div>
            <div className="hero-overlay-container">
                {CLASS_DATA.map((item) => (
                    <img
                        key={item.id}
                        src={item.heroCutout}
                        alt={item.title}
                        className={`hero-overlay ${item.cssClass} ${(hoveredClassId === item.id || selectedClass?.id === item.id) ? 'visible' : ''
                            }`}
                    />
                ))}
            </div>
            <div className="ui-container">
                {selectedClass && (
                    <div className="selected-class-info">
                        <p>You are: <span>{selectedClass.title}</span></p>
                    </div>
                )}

                {!selectedClass ? (
                    <button className="pixel-btn btn-blue" onClick={() => setIsModalOpen(true)}>
                        CHOOSE YOUR CLASS!
                    </button>
                ) : (
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
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content--wide">
                        <h2 className="modal-title">SELECT YOUR DESTINY</h2>
                        <div className="class-banner-list">
                            {CLASS_DATA.map((item) => {
                                const isHovered = hoveredClassId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className={`class-banner pixel-border-gold ${isHovered ? 'is-hovered' : ''}`}
                                        onClick={() => handleSelectClass(item)}
                                        onMouseEnter={() => setHoveredClassId(item.id)}
                                        onMouseLeave={() => setHoveredClassId(null)}
                                    >
                                        <div className="banner-avatar-container pixel-border-inner">
                                            <img
                                                src={isHovered ? item.animationSrc : item.imageSrc}
                                                alt={item.title}
                                                className={`banner-avatar-img ${isHovered ? 'animate-bounce' : ''}`}
                                            />
                                        </div>
                                        <div className="banner-text-container pixel-border-inner">
                                            <h3 className="banner-title">{item.title}</h3>
                                            <p className="banner-description">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="pixel-btn btn-red" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassSelectionPage;
