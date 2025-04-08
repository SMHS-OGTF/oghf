// IMPORT
import fetchData from "$/libs/mongo";

// PAGE
export default async function Home() {
    const rankSuffix = ["st", "nd", "rd"]
    const standings = [
        { name: "St. Mark", ranking: 1, win: 5, loss: 13, pf: 1, pa: 8 },
        { name: "St. Joe", ranking: 2, win: 15, loss: 8, pf: 5, pa: 11 },
        { name: "St. Mary", ranking: 3, win: 11, loss: 4, pf: 9, pa: 14 },
        { name: "St. FX", ranking: 4, win: 11, loss: 15, pf: 13, pa: 15 },
        { name: "St. Benedicts", ranking: 5, win: 5, loss: 12, pf: 1, pa: 3 },
        { name: "St. Joseph", ranking: 6, win: 11, loss: 11, pf: 6, pa: 7 },
        { name: "St. Mother Teresa", ranking: 7, win: 14, loss: 10, pf: 14, pa: 3 },
        { name: "St. Patrick", ranking: 8, win: 12, loss: 16, pf: 5, pa: 8 }
    ]
    const games = [
        { team1: "St Mark", score1: 3, team2: "St Joe", score2: 1, key: 0 },
        { team1: "St Mary", score1: 2, team2: "St FX", score2: 2, key: 1 },
        { team1: "St Lorem", score1: 1, team2: "St Lucas", score2: 0, key: 2 },
        { team1: "St Paul", score1: 4, team2: "St Patrick", score2: 2, key: 3 },
        { team1: "St Mark", score1: 2, team2: "St Mary", score2: 3, key: 4 },
        { team1: "St Joe", score1: 1, team2: "St FX", score2: 0, key: 5 },
        { team1: "St Lucas", score1: 3, team2: "St Paul", score2: 1, key: 6 },
        { team1: "St Patrick", score1: 2, team2: "St Lorem", score2: 3, key: 7 },
        { team1: "St Mark", score1: 4, team2: "St FX", score2: 2, key: 8 },
        { team1: "St Joe", score1: 0, team2: "St Lucas", score2: 1, key: 9 }
    ]
    const schedule = [
        { homeTeam: "St Mark", awayTeam: "St Joe", date: "2024-03-10", time: "15:00", key: 0 },
        { homeTeam: "St Mary", awayTeam: "St FX", date: "2024-03-11", time: "18:30", key: 1 },
        { homeTeam: "St Lorem", awayTeam: "St Lucas", date: "2024-03-12", time: "14:00", key: 2 },
        { homeTeam: "St Paul", awayTeam: "St Patrick", date: "2024-03-13", time: "16:45", key: 3 },
        { homeTeam: "St Mark", awayTeam: "St Mary", date: "2024-03-14", time: "20:00", key: 4 },
        { homeTeam: "St Joe", awayTeam: "St FX", date: "2024-03-15", time: "17:15", key: 5 },
        { homeTeam: "St Lucas", awayTeam: "St Paul", date: "2024-03-16", time: "19:30", key: 6 },
        { homeTeam: "St Patrick", awayTeam: "St Lorem", date: "2024-03-17", time: "13:00", key: 7 },
        { homeTeam: "St Mark", awayTeam: "St FX", date: "2024-03-18", time: "18:00", key: 8 },
        { homeTeam: "St Joe", awayTeam: "St Lucas", date: "2024-03-19", time: "21:00", key: 9 }
    ];

    const seasons = await fetchData({})

    return <>    
        {/* DIVISON MENU */}
        <h3 className="mb-2 text-xl text-uiDark border-uiDark border-b-2">Divisions</h3>
        <select defaultValue="12v12" className="select bg-uiDark text-uiBg w-full text-lg block">
            <option>12v12</option>
            <option>9v9</option>
            <option>6v6</option>
        </select>

        {/* SEASONS */}
        <h3 className="mt-8 mb-2 text-xl text-uiDark border-uiDark border-b-2">Seasons</h3>
        <div className="flex flex-wrap gap-1 w-full">
            {[...seasons].map(item => (
                <a key={item._id} className="text-uiDark text-lg hover:underline mr-2 hover:cursor-pointer">{item.seasonName} ({item.division})</a>
            ))}
        </div>

        {/* STANDINGS */}
        <h3 className="mt-8 mb-2 text-xl text-uiDark border-uiDark border-b-2">Standings</h3>
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
                    {standings.map(team => (
                        <tr key={team.ranking} className="border-0">
                            <td className="font-bold">
                                {team.ranking}{team.ranking <= 3 ? rankSuffix[team.ranking-1] : "th"}
                            </td>
                            <td>{team.name}</td>
                            <td>{team.win}</td>
                            <td>{team.loss}</td>
                            <td>
                                { Math.round(team.win / (team.win + team.loss) * 1000) / 1000 }
                            </td>
                            <td>{team.pf}</td>
                            <td>{team.pa}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* SCORE */}
        <h3 className="mt-8 mb-2 text-xl text-uiDark border-uiDark border-b-2">Scores</h3>
        <div className="flex flex-wrap gap-1 w-full">
            {games.map(game => (
                <div className="py-2 px-4 min-w-[200px] inline-block w-[19%] text-lg bg-gray-300 hover:brightness-[0.90]" key={game.key}>
                    <p className={`text-uiDark flex justify-between ${game.score1 >= game.score2 ? "font-bold" : ""}`}>
                        {game.team1}
                        <span>
                            {game.score1}
                        </span>
                    </p>
                    <p className={`text-uiDark flex justify-between ${game.score2 >= game.score1 ? "font-bold" : ""}`}>
                        @ {game.team2}
                        <span className="text-right">
                            {game.score2}
                        </span>
                    </p>
                </div>
            ))}
        </div>

        {/* SCHEDULE */}
        <h3 className="mt-8 mb-2 text-xl text-uiDark border-uiDark border-b-2">Schedule</h3>
        <div className="flex flex-wrap gap-1 w-full">
            {schedule.map(event => (
                <div className="py-2 px-4 min-w-[200px] inline-block w-[19%] text-lg bg-gray-300 hover:brightness-[0.90]" key={event.key}>
                    <p className="text-uiDark text-center text-lg font-bold">
                        {event.awayTeam} @ {event.homeTeam}
                    </p>
                    <p className="text-uiDark text-center text-base">
                        {event.date} - {event.time}
                    </p>                
                </div>
            ))}
        </div>
    </>
}
