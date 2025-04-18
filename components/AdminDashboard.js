'use client';

// IMPORT
import { useState, useMemo } from 'react';
import CardSelector from '#/CardSelector';
import SectionHeader from '#/SectionHeader';
import EditableCardList from '#/EditableCardList';

// COMPONENT
export default function AdminDashboard({ divisions }) {
    const [selectedDivision, setSelectedDivision] = useState(divisions[0]?._id);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);

    const selectedDivisionData = useMemo(
        () => divisions.find(d => d._id === selectedDivision),
        [divisions, selectedDivision]
    );

    const selectedSeasons = selectedDivisionData?.seasons || [];

    const selectedSeasonData = useMemo(() => {
        if (!selectedSeasonId) return null;
        return selectedDivisionData?.seasons.find(s => s._id === selectedSeasonId);
    }, [selectedDivisionData, selectedSeasonId]);    

    const teams = selectedSeasonData?.teams || [];
    const scores = selectedSeasonData?.scores || [];
    const schedule = selectedSeasonData?.schedule || [];

    const handleTeamEdit = (team) => {
        console.log('Edit team:', team);
    };

    const handleScheduleEdit = (match) => {
        console.log('Edit match:', match);
    };

    return (
        <>
            {/* DIVISION MENU */}
            <SectionHeader title="Divisions" topSpace={false} />
            <CardSelector
                cards={divisions}
                cardProperty="divisionName"
                onSelect={(id) => {
                    setSelectedDivision(id);
                    setSelectedSeasonId(null); // Reset season on division change
                }}
                selected={selectedDivision}
            />

            {/* SEASON MENU */}
            <SectionHeader title="Seasons" />
            <CardSelector
                cards={selectedSeasons}
                cardProperty="seasonName"
                onSelect={(seasonId) => setSelectedSeasonId(seasonId)}
                selected={selectedSeasonId}
            />

            {/* TEAMS */}
            <SectionHeader title="Teams" />
            <EditableCardList
                items={teams}
                fields={['name', 'win', 'loss', 'pf', 'pa']}
                editable
                onEdit={handleTeamEdit}
            />

            {/* SCORES */}
            <SectionHeader title="Scores" />
            <EditableCardList
                items={scores}
                fields={['team1', 'score1', 'team2', 'score2']}
                editable={false}
            />

            {/* SCHEDULE */}
            <SectionHeader title="Schedule" />
            <EditableCardList
                items={schedule}
                fields={['homeTeam', 'awayTeam', 'date', 'time']}
                editable
                onEdit={handleScheduleEdit}
            />
        </>
    );
}