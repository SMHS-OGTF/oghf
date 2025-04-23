'use client';

// IMPORT
import { useState, useMemo, useEffect } from 'react';
import CardSelector from '#/CardSelector';
import SectionHeader from '#/SectionHeader';
import EditableTable from '#/EditableTable';
import DbOperationBar from '#/DbOperationBar';

// COMPONENT
export default function AdminDashboard({ divisions }) {
    const [selectedDivision, setSelectedDivision] = useState(divisions[0]?._id);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);
    const [teams, setTeams] = useState([]);
    const [scores, setScores] = useState([]);
    const [schedule, setSchedule] = useState([]);

    const selectedDivisionData = useMemo(
        () => divisions.find(d => d._id === selectedDivision),
        [divisions, selectedDivision]
    );

    const selectedSeasons = selectedDivisionData?.seasons || [];

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
            console.log("Updated scores:", selectedSeasonData.scores);
        }
    }, [selectedSeasonData]);

    return (
        <>
            {/* DIVISION MENU */}
            <SectionHeader topSpace={true}>
                Divisions
                <DbOperationBar 
                    createFunction={async () => {
                        const divisionName = prompt("Enter the name of the new division:");
                        if (divisionName) {
                            console.log("Creating division:", { divisionName });
                            await fetch('/api/divisions', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionName }),
                            });
                            location.reload(); // Reload to fetch updated data
                        }
                    }}
                    editFunction={async () => {
                        const newName = prompt("Enter the new name for the division:");
                        if (newName && selectedDivision) {
                            console.log("Editing division:", { divisionId: selectedDivision, divisionName: newName });
                            await fetch('/api/divisions', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedDivision, divisionName: newName }),
                            });
                            location.reload();
                        }
                    }}
                    deleteFunction={async () => {
                        if (selectedDivision && confirm("Are you sure you want to delete this division?")) {
                            console.log("Deleting division:", { divisionId: selectedDivision });
                            await fetch('/api/divisions', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedDivision }),
                            });
                            location.reload();
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
                            console.log("Creating season:", { divisionId: selectedDivision, seasonName });
                            await fetch('/api/seasons', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonName }),
                            });
                            location.reload(); // Reload to fetch updated data
                        }
                    }}
                    editFunction={async () => {
                        const newName = prompt("Enter the new name for the season:");
                        if (newName && selectedDivision && selectedSeasonId) {
                            console.log("Editing season:", { divisionId: selectedDivision, seasonId: selectedSeasonId, seasonName: newName });
                            await fetch('/api/seasons', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId, seasonName: newName }),
                            });
                            location.reload();
                        }
                    }}
                    deleteFunction={async () => {
                        if (selectedDivision && selectedSeasonId && confirm("Are you sure you want to delete this season?")) {
                            console.log("Deleting season:", { divisionId: selectedDivision, seasonId: selectedSeasonId });
                            await fetch('/api/seasons', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId }),
                            });
                            location.reload();
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
                            console.log("Creating team:", { divisionId: selectedDivision, seasonId: selectedSeasonId, teamName });
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
                            console.log("Creating score:", { divisionId: selectedDivision, seasonId: selectedSeasonId });
                            const response = await fetch('/api/scores', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ divisionId: selectedDivision, seasonId: selectedSeasonId }),
                            });
                            if (response.ok) {
                                const { score } = await response.json();
                                console.log("New score created:", score); // Debugging
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
                    console.log("------------------")
                    console.log("Rendering field:", field, value);
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
                            console.log("Creating schedule entry:", { divisionId: selectedDivision, seasonId: selectedSeasonId });
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

/*
{
  "_id": {
    "$oid": "67f27d278d517a9ad0f9349d"
  },
  "divisionName": "9v9",
  "seasons": [
    {
      "seasonName": "2024",
      "teams": [
        {
          "id": "stmark",
          "displayName": "St. Mark"
        },
        // ...
      ],
      "rankings": [
        {
          "teamId": "stmark",
          "win": 5,
          "loss": 13,
          "pf": 1,
          "pa": 8
        },
        // ...
      ],
      "scores": [
        {
          "team1": "stmark",
          "score1": 3,
          "team2": "stjoe",
          "score2": 1
        },
        // ...
      ],
      "schedule": [
        {
          "homeTeam": "stmark",
          "awayTeam": "stjoe",
          "date": "2024-03-10",
          "time": "15:00"
        },
        // ...
      ]
    },
    // ...
  ]
}
*/