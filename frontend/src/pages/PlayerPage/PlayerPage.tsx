import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"
import PlayerPageComponent from "../../components/PlayerPage/PlayerPage"
import StatisticsCard from "../../components/PlayerStatistic/PlayerStatistic"
import PlayerGallerey from "../../components/PlayerGallerey/PlayerGallerey"

import "./PlayerPage.css"
import { getPlayer } from "../../api/players"

function PlayerPage() {

    const { slug } = useParams()

    const [player, setPlayer] = useState<any>(null)

    useEffect(() => {

        async function loadPlayer() {

            if (!slug) return

            try {

                const data = await getPlayer(slug)

                setPlayer(data)

            } catch (error) {

                console.error(error)

            }

        }

        loadPlayer()

    }, [slug])

    if (!player) {
        return <div>Загрузка...</div>
    }

    return (

        <div className="player-page-container">
            <PlayerPageComponent
                    key={player.id}
                    player={player}
                />
            
            {player.statistics.map((stat: any) => (
                <StatisticsCard
                    key={stat.id}
                    statistics={stat}
                    clubTeam={player.club_team}
                />
            ))}
            
            <PlayerGallerey
                galleryItems={player.gallery_items}
            />
        </div>
    )
}

export default PlayerPage