'use client';

// IMPORT
import { useState, useMemo, useEffect } from 'react';
import SectionHeader from '#/SectionHeader';

// COMPONENT
export default function DivisionSelector({ divisions, onSelectionChange }) {
    const [selectedDivision, setSelectedDivision] = useState(divisions[0]?._id || '');
    const selectedDivisionData = useMemo(
        () => divisions.find(d => d._id === selectedDivision),
        [divisions, selectedDivision]
    );

    const [selectedSeason, setSelectedSeason] = useState(
        selectedDivisionData?.seasons?.[0]?._id || ''
    );

    const seasons = selectedDivisionData?.seasons || [];

    // Notify the parent component whenever the selection changes
    useEffect(() => {
        onSelectionChange(selectedDivision, selectedSeason);
    }, [selectedDivision, selectedSeason, onSelectionChange]);

    return (
        <>
            {/* DIVISION MENU */}
            <SectionHeader topSpace={false}>Division</SectionHeader>
            <select
                value={selectedDivision}
                onChange={(e) => {
                    const newDivisionId = e.target.value;
                    setSelectedDivision(newDivisionId);

                    // Reset the selected season to the first season of the new division
                    const newDivisionData = divisions.find(d => d._id === newDivisionId);
                    const firstSeasonId = newDivisionData?.seasons?.[0]?._id || '';
                    setSelectedSeason(firstSeasonId);
                }}
                className="select bg-uiDark text-uiBg w-full text-lg block"
            >
                {divisions.map(division => (
                    <option key={division._id} value={division._id}>
                        {division.divisionName}
                    </option>
                ))}
            </select>

            {/* SEASONS */}
            <SectionHeader>Seasons</SectionHeader>
            <div className="flex flex-wrap gap-1 w-full">
                {seasons.map(season => (
                    <button
                        key={season._id}
                        onClick={() => setSelectedSeason(season._id)}
                        className={`text-uiDark text-lg hover:underline mr-2 hover:cursor-pointer ${
                            selectedSeason === season._id ? 'font-bold' : ''
                        }`}
                    >
                        {season.seasonName} ({selectedDivisionData.divisionName})
                    </button>
                ))}
            </div>
        </>
    );
}