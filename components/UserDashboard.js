'use client';

// IMPORT
import { useState, useEffect } from 'react';
import SectionHeader from '#/SectionHeader';
import DivisionSelector from '#/DivisionSelector';

// COMPONENT
export default function UserDashboard({ divisions }) {
    const [selectedDivision, setSelectedDivision] = useState(divisions[0]?._id || '');
    const [selectedSeason, setSelectedSeason] = useState(
        divisions[0]?.seasons?.[0]?._id || ''
    );
    const [scores, setScores] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const divisionData = divisions.find(d => d._id === selectedDivision);
        const seasonData = divisionData?.seasons.find(s => s._id === selectedSeason);

        setScores(seasonData?.scores || []);
        setSchedule(seasonData?.schedule || []);
        setTeams(seasonData?.teams || []);
    }, [selectedDivision, selectedSeason, divisions]);

    const getTeamName = (teamId) => {
        const team = teams.find(team => team._id === teamId || team.id === teamId);
        return team ? team.displayName : 'Unknown Team';
    };

    const calculateStandings = () => {
        const standingsMap = {};
    
        scores.forEach((game) => {
            const { team1, score1, team2, score2 } = game;
    
            // Initialize teams in the standings map if not already present
            if (!standingsMap[team1]) {
                standingsMap[team1] = { teamId: team1, win: 0, loss: 0, pf: 0, pa: 0 };
            }
            if (!standingsMap[team2]) {
                standingsMap[team2] = { teamId: team2, win: 0, loss: 0, pf: 0, pa: 0 };
            }
    
            // Update points for and points against
            standingsMap[team1].pf += parseInt(score1);
            standingsMap[team1].pa += parseInt(score2);
            standingsMap[team2].pf += parseInt(score2);
            standingsMap[team2].pa += parseInt(score1);
    
            // Update wins and losses
            if (score1 > score2) {
                standingsMap[team1].win += 1;
                standingsMap[team2].loss += 1;
            } else if (score2 > score1) {
                standingsMap[team2].win += 1;
                standingsMap[team1].loss += 1;
            }
        });
    
        // Convert the standings map to an array
        const standingsArray = Object.values(standingsMap);
    
        // Calculate PCT% for each team
        standingsArray.forEach((team) => {
            const totalGames = team.win + team.loss;
            team.pct = totalGames > 0 ? team.win / totalGames : 0; // Avoid division by zero
        });
    
        // Sort by wins, then by PCT%
        return standingsArray.sort((a, b) => {
            if (b.win !== a.win) {
                return b.win - a.win; // Sort by wins
            }
            return b.pct - a.pct; // If wins are equal, sort by PCT%
        });
    };

    const standings = calculateStandings();

    return (
        <>
            <DivisionSelector
                divisions={divisions}
                onSelectionChange={(divisionId, seasonId) => {
                    setSelectedDivision(divisionId);
                    setSelectedSeason(seasonId);
                }}
            />

            {/* STANDINGS */}
            <SectionHeader>Standings</SectionHeader>
            <div className="overflow-auto">
                <table className="table text-uiDark text-base">
                    <thead>
                        <tr className="text-lg font-bold bg-uiDark text-uiBg">
                            <th className="py-2">Rank</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Win</th>
                            <th className="py-2">Loss</th>
                            <th className="py-2">PCT%</th>
                            <th className="py-2">PF</th>
                            <th className="py-2">PA</th>
                        </tr>
                    </thead>
                    <tbody className="cssZebraRow">
                        {standings.map((team, index) => (
                            <tr key={team.teamId} className="border-0">
                                <td className="font-bold">
                                    {index + 1}
                                    {index + 1 <= 3 ? ['st', 'nd', 'rd'][index] : 'th'}
                                </td>
                                <td>{getTeamName(team.teamId)}</td>
                                <td>{team.win}</td>
                                <td>{team.loss}</td>
                                <td>
                                    {Math.round((team.win / (team.win + team.loss)) * 1000) / 1000}
                                </td>
                                <td>{team.pf}</td>
                                <td>{team.pa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SCORES */}
            <SectionHeader>Scores</SectionHeader>
            <div className="flex flex-wrap gap-1 w-full">
                {scores.map((game, index) => (
                    <div
                        className="py-2 px-4 min-w-[200px] inline-block w-[19.5%] text-lg bg-gray-300 hover:brightness-[0.90]"
                        key={index}
                    >
                        <p
                            className={`text-uiDark flex justify-between ${
                                game.score1 >= game.score2 ? 'font-bold' : ''
                            }`}
                        >
                            {getTeamName(game.team1)}
                            <span>{game.score1}</span>
                        </p>
                        <p
                            className={`text-uiDark flex justify-between ${
                                game.score2 >= game.score1 ? 'font-bold' : ''
                            }`}
                        >
                            @ {getTeamName(game.team2)}
                            <span className="text-right">{game.score2}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* SCHEDULE */}
            <SectionHeader>Schedule</SectionHeader>
            <div className="flex flex-wrap gap-1 w-full">
                {schedule.map((event, index) => (
                    <div
                        className="py-2 px-4 min-w-[200px] inline-block w-[19.5%] text-lg bg-gray-300 hover:brightness-[0.90]"
                        key={index}
                    >
                        <p className="text-uiDark text-center text-lg font-bold">
                            {getTeamName(event.awayTeam)} @ {getTeamName(event.homeTeam)}
                        </p>
                        <p className="text-uiDark text-center text-base">
                            {event.date} - {event.time}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}