'use client';

import { useState } from 'react';

export default function CardSelector({ cards, cardProperty }) {
    const [selectedCard, setSelectedCard] = useState(cards?.[0]?._id ?? null);

    const handleSelect = (cardId) => {
        setSelectedCard(cardId);
    }

    return (
        <>
            <div className="flex flex-wrap gap-1 w-full">
                {cards.map(item => {
                    const isSelected = selectedCard === item._id;
                    return (
                        <div
                            key={item._id}
                            className={`text-lg rounded-lg py-2 px-6 cursor-pointer 
                                ${isSelected ? 'text-uiLight bg-uiDark' : 'text-uiDark bg-gray-300 hover:brightness-[0.90]'}`}
                            onClick={() => handleSelect(item._id)}
                        >
                            {item[cardProperty]}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
