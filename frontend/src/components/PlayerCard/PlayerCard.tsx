import { Link } from 'react-router-dom'
import "./PlayerCard.css"

function PlayerCard({ player }: any) {
    return (
        <Link to={`/player/${player.slug}`}
        className="player-card-link">

            <div className="player-card">
                
                <img src={`http://localhost:8000${player.avatar.url}`}
                alt={player.first_name}
                className='player-image'/>
                
                <div className='player-info'>
                    {player.last_name} {player.first_name}
                </div>
                <div className="player-number">
                    {player.number}
                </div>
                <p>
                    {player.birth_date}
                </p>

            </div>
        </Link>
    )
}

export default PlayerCard