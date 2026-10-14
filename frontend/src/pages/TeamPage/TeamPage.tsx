import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import PlayerCard from "../../components/PlayerCard/PlayerCard"

import { getPlayersByClubTeam } from "../../api/clubTeams"
import "./TeamPage.css"


function TeamPage() {
    const { slug } = useParams();
    const [clubTeam, setClubTeam] = useState<any>(null)

    useEffect(() => {
        if (!slug) return;

        async function loadPlayersByTeam() {
            try {
                const data = await getPlayersByClubTeam(slug!)
                setClubTeam(data)
            } catch (error) {
                console.error(error)
            }
        }

        loadPlayersByTeam()

    }, [slug])

    return (
        <div className="team-page container">

            {clubTeam && (
                <div>
                    <h1 className="team-page title-h1">
                        {clubTeam.name}
                    </h1>

                    <div className="players-grid">
                        {clubTeam.players.map((player: any) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                            />
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default TeamPage