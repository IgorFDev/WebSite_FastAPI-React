import "./PlayerQuestionnaire.css"

export interface Player {
    id: number;
    last_name: string;
    first_name: string;
    position: string;
    avatar_url: string;
    shirt_number: number;
    matches_played: number;
    total_points: number;
}

export const PLAYER_POSITIONS: Record<string, string> = {
    SETTER: "Связующий",
    OUTSIDE_HITTER: "Доигровщик",
    MIDDLE_BLOCKER: "Центральный блокирующий",
    OPPOSITE: "Диагональный",
    LIBERO: "Либеро",
}

export default function PlayerQuestionnaire({player}: any) {
    
    const lastName = player.last_name || '';
    const firstName = player.first_name || '';
    const position = player.position || 'Игрок';
    const shirtNumber = player.number ?? 0;
    const avatarUrl = player.avatar?.url
    const matchesPlayed = player.statistics.matches_played ?? 0;
    const totalPoints = player.statistics.total_points ?? 0;


    return (
        <div className="player-questionnaire">
            <div className="player-questionnaire-wrapper">
                <div className="player-questionnaire-profile-wrapper">
                    <div className="player-questionnaire-number">{shirtNumber}</div>
                    <div className="player-questionnaire-image-wrapper">
                        <img src={`http://localhost:8000${avatarUrl}`} alt={`${lastName} ${firstName}`} className='player-questionnaire-image'/>
                    </div>
                </div>
                <div className="player-questionnaire-info-wrapper">
                    <div className="player-questionnaire-info-block">
                        <div className="player-questionnaire-fullname">
                            <div className="player-questionnaire-lastname">{lastName}</div>
                            <div className="player-questionnaire-firstname">{firstName}</div>
                        </div>
                        <div className="player-questionnaire-position">
                            {PLAYER_POSITIONS[player.position] || position}
                        </div>
                    </div>
                    <div className="player-questionnaire-stat-block">
                        <div className="player-questionnaire-stat matches">
                            <div>{matchesPlayed}</div>
                            <div className="player-questionnaire-inscription">Игр</div>
                        </div>
                        <div className="player-questionnaire-stat points">
                            <div>{totalPoints}</div>
                            <div className="player-questionnaire-inscription">Очков</div>
                        </div>
                    </div>
                    <div className="player-questionnaire-achievements-block">
                        <div className="player-questionnaire-achievements-inscription">Достижения:</div>
                        <ul className="player-questionnaire-achievements-list">    
                            {player.achievements && player.achievements.length > 0 ? (
                                player.achievements.map((achievement: any) => (
                                    <li key={achievement.id} className="player-achievement">
                                        <div className="achievement-text">{achievement.text}</div>
                                    </li>
                                ))
                            ) : (
                                <li className="player-achievement">
                                    <div className="achievement-text">Нет достижений</div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}