import { Link } from 'react-router-dom'
import "./TeamCard.css"

function TeamCard({ team }: any) {
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <Link to={`/team/${team.slug}`}
        className="team-card-container">

            <div className="team-card">
                
                <div className="team-card-content">
                    <h2 className="team-card-title">
                        Команда {team.name}
                    </h2>

                    <h3 className="team-card-subtitle">
                        Участвуют в лиге: {team.league_name}
                    </h3>

                    <div className="team-card-date"> 
                        <div className="team-card-date-label">Команда создана:</div>
                        <div className="team-card-date-value">{formatDate(team.created_at)}</div>
                    </div>
                </div>
                
                <div className="team-card-image">
                    <div className="team-card-image-wrapper">
                        <img src={`http://localhost:8000${team.preview.url || '/media/news/placeholder.svg'}`}
                        alt={team.name}
                        className='team-image'/>
                    </div>
                </div>


            </div>
        </Link>
    )
}

export default TeamCard
