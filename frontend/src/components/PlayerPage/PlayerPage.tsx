import "./PlayerPage.css"

export const PLAYER_POSITIONS: Record<string, string> = {
    SETTER: "Связующий",
    OUTSIDE_HITTER: "Доигровщик",
    MIDDLE_BLOCKER: "Центральный блокирующий",
    OPPOSITE: "Диагональный",
    LIBERO: "Либеро",
}

function PlayerPage({ player }: any) {
    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    
    const fullName = `${player.first_name || ''} ${player.last_name || ''}`.trim();
    const position = player.position || 'Игрок';
    const shirtNumber = player.number ?? 0;
    const heightCm = player.height ? `${player.height}` : '—';
    const ageValue = player.age ?? '—';
    const birthDateFormatted = formatDate(player.birth_date);
    const sportRank = player.sport_rank || '—';
    const avatarUrl = player.avatar?.url
    const backgroundUrl = player.background?.url

    
    return (
        <div className="player-page">
            <div className="player-page__content">
                <div className="content">
                    <section className="player-info__background" style={{ backgroundImage: `url(http://localhost:8000${backgroundUrl})` }}>
                        <div className="player-info__header">
                            <div className="player-info__role">{PLAYER_POSITIONS[player.position] || position}</div>
                            <div className="player-info__name">{fullName}</div>
                            <div className="player-info__number">
                                {shirtNumber}
                            </div>
                        </div>
                        <div className="player-info__card">
                            <div className="player-info__avatar">
                                <img src={`http://localhost:8000${avatarUrl}`} alt={fullName} className='playerpage-image'/>
                            </div>
                            <div className="player-info__info">
                                <div className="player-info__block-age">
                                    <div className="player-info__block-title">Возраст</div>
                                    <div className="player-info__block-value">{ageValue}</div>
                                </div>
                                <div className="player-info__block-birth-date">
                                    <div className="player-info__block-title">Дата рождения</div>
                                    <div className="player-info__block-value">{birthDateFormatted}</div>
                                </div>
                                <div className="player-info__block-height">
                                    <div className="player-info__block-title">Рост</div>
                                    <div className="player-info__block-value">{heightCm}</div>
                                </div>
                                <div className="player-info__block-sport-rank">
                                    <div className="player-info__block-title">Звание</div>
                                    <div className="player-info__block-value">{sportRank}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default PlayerPage