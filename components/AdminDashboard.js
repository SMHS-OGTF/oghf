'use client';

// IMPORT
import { useState, useMemo } from 'react';
import CardSelector from '#/CardSelector';
import SectionHeader from '#/SectionHeader';
import EditableTable from '#/EditableTable';

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

    return (
        <>
            {/* DIVISION MENU */}
            <SectionHeader title="Divisions" topSpace={false} />
            <CardSelector
                cards={divisions}
                cardProperty="divisionName"
                onSelect={(id) => {
                    setSelectedDivision(id);
                    setSelectedSeasonId(null);
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
            <EditableTable
                items={teams}
                teamList={teams}
                fields={['displayName']}
                headers={['Team Name']}
                editable
                onEdit={(updatedRow, index) => {
                    if (updatedRow) {
                        // update logic
                        console.log('Updated row:', updatedRow, 'at index', index);
                    } else {
                        // deletion logic
                        console.log('Deleted row at index', index);
                    }
                }}
                getTeamName={(teamId) => {
                    const team = teams.find(team => team._id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
            />

            {/* SCORES */}
            <SectionHeader title="Scores" />
            <EditableTable
                items={scores}
                teamList={teams}
                fields={['team1', 'score1', 'team2', 'score2']}
                headers={['Team 1', 'Score 1', 'Team 2', 'Score 2']}
                editable
                onEdit={(updatedRow, index) => {
                    if (updatedRow) {
                        // update logic
                        console.log('Updated row:', updatedRow, 'at index', index);
                    } else {
                        // deletion logic
                        console.log('Deleted row at index', index);
                    }
                }}
                getTeamName={(teamId) => {
                    const team = teams.find(team => team._id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
            />

            {/* SCHEDULE */}
            <SectionHeader title="Schedule" />
            <EditableTable
                items={schedule}
                teamList={teams}
                fields={['homeTeam', 'awayTeam', 'date', 'time']}
                headers={['Home Team', 'Away Team', 'Date', 'Time']}
                editable
                onEdit={(updatedRow, index) => {
                    if (updatedRow) {
                        // update logic
                        console.log('Updated row:', updatedRow, 'at index', index);
                    } else {
                        // deletion logic
                        console.log('Deleted row at index', index);
                    }
                }}
                getTeamName={(teamId) => {
                    const team = teams.find(team => team._id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
            />

        </>
    );
}