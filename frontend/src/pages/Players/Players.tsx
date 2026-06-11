import { useEffect, useState } from "react"
import PlayerCard from "../../components/PlayerCard/PlayerCard"

import { getPlayers } from "../../api/players"

import "./Players.css"

function Players() {

    const [players, setPlayers] = useState([])

    useEffect(() => {

        async function loadPlayers() {

            try {

                const data = await getPlayers()

                setPlayers(data)

            } catch (error) {

                console.error(error)

            }

        }

        loadPlayers()

    }, [])

    return (
        <div className="players-page">

            <h1>
                Игроки Samurais
            </h1>

            <div className="players-grid">

                {players.map((player: any) => (

                    <PlayerCard
                        key={player.id}
                        player={player}
                    />

                ))}

            </div>

        </div>
    )
}

export default Players