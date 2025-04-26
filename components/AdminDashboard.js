'use client';

// IMPORT
import { useState, useMemo, useEffect } from 'react';
import CardSelector from '#/CardSelector';
import SectionHeader from '#/SectionHeader';
import EditableTable from '#/EditableTable';
import DbOperationBar from '#/DbOperationBar';

// COMPONENT
export default function AdminDashboard({ initialDivisions }) {
    const [divisions, setDivisions] = useState(initialDivisions);
    const [selectedDivision, setSelectedDivision] = useState(divisions[0]?._id || null);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);
    const [teams, setTeams] = useState([]);
    const [scores, setScores] = useState([]);
    const [schedule, setSchedule] = useState([]);

    const selectedDivisionData = useMemo(
        () => divisions.find(d => d._id === selectedDivision),
        [divisions, selectedDivision]
    );

    const selectedSeasons = useMemo(
        () => selectedDivisionData?.seasons || [],
        [selectedDivisionData]
    );

    useEffect(() => {
        if (selectedSeasons.length > 0 && !selectedSeasonId) {
            setSelectedSeasonId(selectedSeasons[0]._id);
        }
    }, [selectedSeasons, selectedSeasonId]);

    const selectedSeasonData = useMemo(() => {
        if (!selectedSeasonId) return null;
        return selectedDivisionData?.seasons.find(s => s._id === selectedSeasonId);
    }, [selectedDivisionData, selectedSeasonId]);

    useEffect(() => {
        if (selectedSeasonData) {
            setTeams((selectedSeasonData.teams || []).map(team => ({
                ...team,
                _id: team._id || team.id,
                id: team.id || team._id,
            })));
            setScores(selectedSeasonData.scores || []);
            setSchedule(selectedSeasonData.schedule || []);
        }
    }, [selectedSeasonData]);

    // Function to refetch divisions
    const refetchDivisions = async () => {
        const response = await fetch('/api/divisions');
        if (response.ok) {
            const updatedDivisions = await response.json();
            setDivisions(updatedDivisions);
        }
    };

    return (
        <>
            {/* DIVISION MENU */}
            <SectionHeader topSpace={true}>
                Divisions
                <DbOperationBar 
                    createFunction={async () => {
                        const divisionName = prompt("Enter the name of the new division:");
                        if (divisionName) {
                            await fetch('/api/divisions', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionName }),
                            });
                            await refetchDivisions(); // Refetch divisions after creation
                        }
                    }}
                    editFunction={async () => {
                        const newName = prompt("Enter the new name for the division:");
                        if (newName && selectedDivision) {
                            await fetch('/api/divisions', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedDivision, divisionName: newName }),
                            });
                            await refetchDivisions(); // Refetch divisions after editing
                        }
                    }}
                    deleteFunction={async () => {
                        if (selectedDivision && confirm("Are you sure you want to delete this division?")) {
                            await fetch('/api/divisions', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedDivision }),
                            });
                            await refetchDivisions(); // Refetch divisions after deletion
                        }
                    }}
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
                    createFunction={async () => {
                        const seasonName = prompt("Enter the name of the new season:");
                        if (seasonName && selectedDivision) {
                            await fetch('/api/seasons', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonName }),
                            });
                            await refetchDivisions(); // Refetch divisions after creating a season
                        }
                    }}
                    editFunction={async () => {
                        const newName = prompt("Enter the new name for the season:");
                        if (newName && selectedDivision && selectedSeasonId) {
                            await fetch('/api/seasons', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId, seasonName: newName }),
                            });
                            await refetchDivisions(); // Refetch divisions after editing a season
                        }
                    }}
                    deleteFunction={async () => {
                        if (selectedDivision && selectedSeasonId && confirm("Are you sure you want to delete this season?")) {
                            await fetch('/api/seasons', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId }),
                            });
                            await refetchDivisions(); // Refetch divisions after deleting a season
                        }
                    }}
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
                    createFunction={async () => {
                        if (!selectedSeasonId) {
                            alert("Please select a season first.");
                            return;
                        }
                        const teamName = prompt("Enter the name of the new team:");
                        if (teamName && selectedDivision && selectedSeasonId) {
                            const response = await fetch('/api/teams', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId, teamName }),
                            });
                            if (response.ok) {
                                const updatedTeam = await response.json();
                                setTeams((prevTeams) => [...prevTeams, updatedTeam.team]);
                                
                            }
                        }
                    }}
                />
            </SectionHeader>
            <EditableTable
                items={teams}
                teamList={teams}
                fields={['displayName']}
                headers={['Team Name']}
                editable
                onEdit={async (updatedRow, index) => {
                    if (updatedRow) {
                        await fetch('/api/teams', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                divisionId: selectedDivision,
                                seasonId: selectedSeasonId,
                                teamId: teams[index].id,
                                updatedTeam: updatedRow,
                            }),
                        });
                        setTeams((prevTeams) => {
                            const newTeams = [...prevTeams];
                            newTeams[index] = updatedRow;
                            return newTeams;
                        });
                    } else {
                        const response = await fetch('/api/teams', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                divisionId: selectedDivision,
                                seasonId: selectedSeasonId,
                                teamId: teams[index].id,
                            }),
                        });
                        if (response.ok) {
                            setTeams((prevTeams) => prevTeams.filter((_, i) => i !== index));
                        }
                    }
                }}
                getTeamName={(teamId) => {
                    const team = teams.find(team => team._id === teamId || team.id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
                renderField={(field, value, onChange) => {
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
                    createFunction={async () => {
                        if (!selectedSeasonId) {
                            alert("Please select a season first.");
                            return;
                        }
                        if (selectedDivision && selectedSeasonId) {
                            const response = await fetch('/api/scores', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId }),
                            });
                            if (response.ok) {
                                const { score } = await response.json();
                                setScores((prevScores) => [...prevScores, score]); // Add the new score to the state
                            }
                        }
                    }}
                />
            </SectionHeader>
            <EditableTable
                items={scores}
                teamList={teams}
                fields={['team1', 'score1', 'team2', 'score2']}
                headers={['Away Team', 'Away Team Points', 'Home Team', 'Home Team Points']}
                editable
                onEdit={async (updatedRow, index) => {
                    if (updatedRow) {
                        // Update score
                        await fetch('/api/scores', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                divisionId: selectedDivision,
                                seasonId: selectedSeasonId,
                                scoreIndex: index,
                                updatedScore: updatedRow,
                            }),
                        });
                        setScores((prevScores) => {
                            const newScores = [...prevScores];
                            newScores[index] = updatedRow;
                            return newScores;
                        });
                    } else {
                        const response = await fetch('/api/scores', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                divisionId: selectedDivision,
                                seasonId: selectedSeasonId,
                                scoreIndex: index,
                            }),
                        });
                        if (response.ok) {
                            setScores((prevScores) => prevScores.filter((_, i) => i !== index));
                        }
                    }
                }}
                getTeamName={(teamId) => {
                    const team = teams.find(team => team._id === teamId || team.id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
                renderField={(field, value, onChange) => {
                    if (field === 'team1' || field === 'team2' || field === 'homeTeam' || field === 'awayTeam') {
                        return (
                            <select
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team._id || team.id} value={team._id || team.id}>
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
                    createFunction={async () => {
                        if (!selectedSeasonId) {
                            alert("Please select a season first.");
                            return;
                        }
                        if (selectedDivision && selectedSeasonId) {
                            const response = await fetch('/api/schedule', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId }),
                            });
                            if (response.ok) {
                                const updatedSchedule = await response.json();
                                setSchedule((prevSchedule) => [...prevSchedule, updatedSchedule.schedule]);
                            }
                        }
                    }}
                />
            </SectionHeader>
            <EditableTable
                items={schedule}
                teamList={teams}
                fields={['homeTeam', 'awayTeam', 'date', 'time']}
                headers={['Home Team', 'Away Team', 'Date', 'Time']}
                editable
                onEdit={async (updatedRow, index) => {
                    if (updatedRow) {
                        // Update schedule
                        await fetch('/api/schedule', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                divisionId: selectedDivision,
                                seasonId: selectedSeasonId,
                                scheduleIndex: index,
                                updatedSchedule: updatedRow,
                            }),
                        });
                        setSchedule((prevSchedule) => {
                            const newSchedule = [...prevSchedule];
                            newSchedule[index] = updatedRow;
                            return newSchedule;
                        });
                    } else {
                        const response = await fetch('/api/schedule', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                divisionId: selectedDivision,
                                seasonId: selectedSeasonId,
                                scheduleIndex: index,
                            }),
                        });
                        if (response.ok) {
                            setSchedule((prevSchedule) => prevSchedule.filter((_, i) => i !== index));
                        }
                    }
                }}
                getTeamName={(teamId) => {
                    const team = teams.find(team => team._id === teamId || team.id === teamId);
                    return team ? team.displayName : 'Unknown Team';
                }}
                renderField={(field, value, onChange) => {
                    if (field === 'team1' || field === 'team2' || field === 'homeTeam' || field === 'awayTeam') {
                        return (
                            <select
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team._id || team.id} value={team._id || team.id}>
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