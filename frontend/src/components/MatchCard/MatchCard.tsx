import { Link } from 'react-router-dom'
import './MatchCard.css'

interface MatchCardProps {
  match: any;
  disabled?: boolean;
}


export default function MatchCard({ match, disabled = false }: MatchCardProps) {
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
        <Link 
            key={match.id} 
            to={`/match/${match.slug}`}
            className={disabled ? 'match-link disabled' : 'match-link'}
            onClick={(e) => {
                if (disabled) e.preventDefault();
            }}
            style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
        >      
            <div className={disabled ? 'match-wrapper disabled' : 'match-wrapper'}>
                <div className='match-info'>    
                    <div className='match-date'>{formatDate(match.match_datetime)}</div>
                    <div className='match-league'>{match.club_team.league_name} лига {match.club_team.group_name} группа</div>
                </div>
                <div className='match-teams'>
                    <div className='team-info-wrapper'>
                        <div className='team-image-wrapper'>
                            <img src={`http://localhost:8000${match.club_team.emblem.url}`} alt={match.club_team.name} className='team-emblem'/>
                        </div>
                        <span className='team'>{match.club_team.name}</span>
                    </div>
                    <div className='vs-wrapper'>
                        <span className='vs'>vs</span>
                    </div>
                    <div className='team-info-wrapper'>
                        <div className='team-image-wrapper'>
                            <img src={`http://localhost:8000${match.opponent_team.avatar.url}`} alt={match.opponent_team.name} className='team-emblem'/>
                        </div>
                        <span className='team'>{match.opponent_team.name}</span>
                    </div>
                </div>
                <div className='match-icon-wrapper'>
                    {match.is_home === true ? <img src='/home-dark.svg' alt='home' /> : <img src='/away-dark.svg' alt='away' />}
                </div>
            </div>
        </Link>
    )
}