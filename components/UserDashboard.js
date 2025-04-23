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
    const [standings, setStandings] = useState([]);
    const [scores, setScores] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [teams, setTeams] = useState([]);

    // Fetch data for the selected division and season
    useEffect(() => {
        const divisionData = divisions.find(d => d._id === selectedDivision);
        const seasonData = divisionData?.seasons.find(s => s._id === selectedSeason);

        setStandings(seasonData?.rankings || []);
        setScores(seasonData?.scores || []);
        setSchedule(seasonData?.schedule || []);
        setTeams(seasonData?.teams || []);
    }, [selectedDivision, selectedSeason, divisions]);

    // Function to get the team's display name
    const getTeamName = (teamId) => {
        const team = teams.find(team => team._id === teamId || team.id === teamId);
        return team ? team.displayName : 'Unknown Team';
    };

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