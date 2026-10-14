import { useState, useEffect } from 'react';
import { getMatchbySlug } from '../../api/matches'
import { getMatchSets } from '../../api/matchSet'
import { useParams } from 'react-router-dom'

import './Match.css'

export default function Match() {
    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    
    const [match, setMatch] = useState<any>(null)
    const [matchSets, setMatchSets] = useState([])
    const [isScheduled, setisScheduled] = useState(false)
    const { slug } = useParams<{ slug: string }>();
    
    async function LoadMatch() {
        const match = await getMatchbySlug(slug!)
        setMatch(match)
        
        try {
            const matchSets = await getMatchSets(match.id);
            setMatchSets(matchSets);
        } catch (error) {
            console.warn('Не удалось получить сеты (возможно, матч ещё не сыгран):', error);
            // В любом случае устанавливаем пустой массив, чтобы UI не ломался
            setMatchSets([]);
        }


        const isScheduled = match.status === 'SCHEDULED'
        console.log('Статус матча:', match.status);           // <-- сюда
        console.log('Вычислено isScheduled:', isScheduled);   // <-- сюда
        setisScheduled(isScheduled)
    }


    useEffect(() => {
        LoadMatch()
    }, [slug, isScheduled]);

    useEffect(() => {
        console.log('isScheduled (в useEffect):', isScheduled);
    }, [isScheduled]);

    

    return (
        match && (
            <div className="match container">
                <div className="match-title">
                    <h1 className='match-team-name club-team'>{match.club_team.name}</h1>
                    <span className='match-vs'>X</span>
                    <h1 className='match-team-name opponent-team'>{match.opponent_team.name}</h1>
                </div>

                <div className='match-results'>
                    <div>
                        <img src={`http://localhost:8000/media/Лого.png`} className='match-logo'/>
                    </div>
                    <div className='match-results-preview match-date'>
                        <div>
                            <p>{formatDate(match.match_datetime)}</p>
                        </div>
                        
                        {!isScheduled ? (
                            <div className='match-score'>
                                <h2>{match.our_score}</h2>
                                <h2>:</h2>
                                <h2>{match.opponent_score}</h2>
                            </div>
                        ) : (
                            <div className="match-time">
                            <h2>{formatTime(match.match_datetime)}</h2>
                            </div>
                        )}
                    </div>
                    <div>
                        <img src={`http://localhost:8000/media/Лого.png`} className='match-logo'/>
                    </div>
                </div>
                {!isScheduled && (
                    <div className='match-result-table'>
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>Команда</th>
                                    {matchSets.map((set: any) => (
                                        <th key={set.id}>{set.set_number}</th>
                                    ))}
                                    <th>Итог</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="team-name">{match.club_team.name}</td>
                                    {matchSets.map((set: any) => (
                                        <td key={set.id}>{set.our_score}</td>
                                    ))}
                                    <td className="total-score">
                                        {match.our_score}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="team-name">{match.opponent_team.name}</td>
                                    {matchSets.map((set: any) => (
                                        <td key={set.id}>{set.opponent_score}</td>
                                    ))}
                                    <td className="total-score">
                                        {match.opponent_score}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {match.address && (
                    <div className='match-address-map'>
                        <h3 className='match-address-title'>Адрес проведения</h3>
                        <div className='map-container'>
                            <iframe
                                src={`https://yandex.ru/map-widget/v1/?z=15&ol=biz&text=${encodeURIComponent(`Санкт-Петербург, ${match.address}`)}`}
                                width="100%"
                                height="100%"
                                title="Карта с адресом матча"
                                className="map-iframe"
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    )
}