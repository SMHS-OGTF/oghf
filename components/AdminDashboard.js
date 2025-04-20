'use client';

// IMPORT
import { useState, useMemo } from 'react';
import CardSelector from '#/CardSelector';
import SectionHeader from '#/SectionHeader';
import EditableTable from '#/EditableTable';
import DbOperationBar from '#/dbOperationBar';

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

    const teams = (selectedSeasonData?.teams || []).map(team => ({
        ...team,
        _id: team._id || team.id,
        id: team.id || team._id,
    }));
    const scores = selectedSeasonData?.scores || [];
    const schedule = selectedSeasonData?.schedule || [];

    return (
        <>
            {/* DIVISION MENU */}
            <SectionHeader topSpace={true}>
                Divisions
                <DbOperationBar 
                    createFunction={() => {}}
                    editFunction={() => {}}
                    deleteFunction={() => {}}
                />
            </SectionHeader>
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
            <SectionHeader>
                Seasons
                <DbOperationBar 
                    createFunction={() => {}}
                    editFunction={() => {}}
                    deleteFunction={() => {}}
                />
            </SectionHeader>
            <CardSelector
                cards={selectedSeasons}
                cardProperty="seasonName"
                onSelect={(seasonId) => setSelectedSeasonId(seasonId)}
                selected={selectedSeasonId}
            />

            {/* TEAMS */}
            <SectionHeader>
                Teams
                <DbOperationBar 
                    createFunction={() => {}}
                />
            </SectionHeader>
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
                    const team = teams.find(team => team._id === teamId || team.id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
                renderField={(field, value, onChange) => {
                    // Render textboxes for team names
                    if (field === 'displayName') {
                        return (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                            />
                        );
                    }
                    return null;
                }}
            />

            {/* SCORES */}
            <SectionHeader>
                Scores
                <DbOperationBar 
                    createFunction={() => {}}
                />
            </SectionHeader>
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
                    const team = teams.find(team => team._id === teamId || team.id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
                renderField={(field, value, onChange) => {
                    if (field === 'team1' || field === 'team2') {
                        return (
                            <select
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.displayName}
                                    </option>
                                ))}
                            </select>
                        );
                    }
                    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />;
                }}
            />

            {/* SCHEDULE */}
            <SectionHeader>
                Schedule
                <DbOperationBar 
                    createFunction={() => {}}
                />
            </SectionHeader>
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
                    const team = teams.find(team => team._id === teamId || team.id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
                renderField={(field, value, onChange) => {
                    if (field === 'homeTeam' || field === 'awayTeam') {
                        return (
                            <select
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.displayName}
                                    </option>
                                ))}
                            </select>
                        );
                    }
                    return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />;
                }}
            />

        </>
    );
}