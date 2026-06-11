import "./PlayerStatistic.css"

interface StatisticsCardProps {
    statistics: any
    clubTeam: any
}

function StatisticsCard({ statistics, clubTeam }: StatisticsCardProps) {
    const pointPetSet = statistics.sets_played > 0 ? (statistics.total_points / statistics.sets_played).toFixed(1) : 0
    
    return (
        <div className="statistics-card">
            <div className="statistics-content">    
                <h2>
                    Статистика за сезон {statistics.season.name} ({clubTeam.league_name})
                </h2>

                <div className="statistics-grid">

                        <div className="statistic-item">
                            <h3>Сыграно матчей</h3>
                            <span>{statistics.matches_played}</span>
                        </div>

                        <div className="statistic-item">
                            <h3>Сыграно партий</h3>
                            <span>{statistics.sets_played}</span>
                        </div>

                        <div className="statistic-item">
                            <h3>Всего очков</h3>
                            <span>{statistics.total_points}</span>
                        </div>
                        
                        <div className="statistic-item">
                            <h3>Очков в среднем за сет</h3>
                            <span>{pointPetSet}</span>
                        </div>
                        
                        <div className="statistic-item">
                            <h3>Блок</h3>
                            <span>{statistics.blocks}</span>
                        </div>
                        
                        <div className="statistic-item">
                            <h3>Атака</h3>
                            <span>{statistics.attacks}</span>
                        </div>
                        
                        <div className="statistic-item">
                            <h3>Подачи (Эйсы)</h3>
                            <span>{statistics.aces}</span>
                        </div>
                        
                        <div className="statistic-item">
                            <h3>Ошибки</h3>
                            <span>{statistics.errors}</span>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticsCard
