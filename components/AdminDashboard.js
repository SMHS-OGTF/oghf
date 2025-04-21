'use client';

// IMPORT
import { useState, useMemo } from 'react';
import CardSelector from '#/CardSelector';
import SectionHeader from '#/SectionHeader';
import EditableTable from '#/EditableTable';
import DbOperationBar from '#/DbOperationBar';

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
                headers={['Away Team', 'Away Team Points', 'Home Team', 'Home Team Points']}
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