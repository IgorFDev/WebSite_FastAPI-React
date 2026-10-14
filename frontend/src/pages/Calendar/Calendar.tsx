// Calendar.tsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Calendar.css';
import { getPlayersByClubTeam } from '../../api/clubTeams';
import { getMatchesByTeam } from '../../api/matches';
import { getCurrentSeason, getSeasonsUntilThisYear } from '../../api/seasons';

// types.ts
export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  clubTeam?: string;
  emblemClubTeamURL?: string;
  opponentTeam?: string;
  emblemOpponentTeamURL?: string;
  ourScore?: string;
  opponentScore?: string;
  isHome?: boolean;
  address?: string;
  status?: string;
  slug?: string;
}

export interface SeasonData {
  id: number;
  start_year: number;
  end_year: number;
  season: string;
}

export interface DayData {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matches, setMatches] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<SeasonData | null>(null);
  const [clubTeam, setClubTeam] = useState<{ name: string } | null>(null);;
  const [loading, setLoading] = useState(true);
  const [matchFilter, setMatchFilter] = useState<'all' | 'home' | 'away'>('all');
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  
  async function loadMatches() {
      try {
        const data = await getMatchesByTeam(slug!); 
        setMatches(data);
      } catch (error) {
        console.error('Ошибка загрузки матчей:', error);
      } finally {
        setLoading(false);
      }
    }

  async function loadCurrentSeason() {
    try {
      const data = await getCurrentSeason();
      setSelectedSeason(data);
    } catch (error) {
      console.error('Ошибка загрузки сезона:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSeasons() {
    try {
      const data = await getSeasonsUntilThisYear();
      setSeasons(data);
    } catch (error) {
      console.error('Ошибка загрузки сезонов:', error);
    }
  }

  async function loadPlayersByTeam() {
    try {
      const data = await getPlayersByClubTeam(slug!)
      setClubTeam(data)
    } catch (error) {
      console.error(error)
    }
  } 
  // Загрузка действующего сезона и его матчей
  useEffect(() => {
    loadMatches();
    loadCurrentSeason();
    loadSeasons();
    loadPlayersByTeam();
    // Сбрасываем календарь на текущий месяц при смене команды
    setCurrentDate(new Date());
  }, [slug]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonId = parseInt(e.target.value);
    const selected = seasons.find(s => s.id === seasonId);
    if (selected) {
      setSelectedSeason(selected);
      
      // Определяем текущий сезон по дате
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const currentSeasonStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;
      
      // Проверяем, является ли выбранный сезон текущим
      const isCurrentSeason = selected.start_year === currentSeasonStartYear;
      
      if (isCurrentSeason) {
        // Если это текущий сезон, открываем текущий месяц
        setCurrentDate(new Date());
      } else {
        // Если это предыдущий сезон, открываем май
        setCurrentDate(new Date(selected.start_year + 1, 4, 1)); // Май следующего года (месяц 4)
      }
    }
  };

  const handleMatchFilterChange = (filter: 'all' | 'home' | 'away') => {
    setMatchFilter(filter);
  };

  // Фильтрация матчей по месту проведения
  const filteredMatches = matches.filter(match => {
    if (matchFilter === 'all') return true;
    if (matchFilter === 'home') return match.is_home === true;
    if (matchFilter === 'away') return match.is_home === false;
    return true;
  });

  // Преобразование матчей в формат календаря
  const matchesByDate = filteredMatches.reduce((acc: Record<string, CalendarEvent[]>, match: any) => {
    const matchDate = new Date(match.match_datetime);
    const dateString = matchDate.toISOString().split('T')[0];
    const time = matchDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    
    acc[dateString].push({
      id: match.id.toString(),
      title: `${match.club_team.name} - ${match.opponent_team.name}`,
      time,
      clubTeam: match.club_team.name,
      emblemClubTeamURL: match.club_team.emblem.url,
      opponentTeam: match.opponent_team.name,
      emblemOpponentTeamURL: match.opponent_team.avatar.url,
      ourScore: match.our_score,
      opponentScore: match.opponent_score,
      isHome: match.is_home,
      address: match.address,
      status: match.status,
      slug: match.slug,
    });
    
    return acc;
  }, {});

  // Определение сезона: сентябрь текущего года - август следующего года
  const currentYear = selectedSeason ? selectedSeason.start_year : currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Определяем начало сезона (сентябрь) - приоритет выбранному сезону
  const seasonStartYear = selectedSeason ? selectedSeason.start_year : (currentMonth >= 8 ? currentYear : currentYear - 1);

  // Генерация массива месяцев сезона
  const seasonMonths = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (8 + i) % 12; // Начинаем с сентября (8)
    const yearOffset = monthIndex < 8 ? 1 : 0;
    const monthYear = seasonStartYear + yearOffset;
    const monthDate = new Date(monthYear, monthIndex, 1);
    
    // Формат: Сен'26
    const monthShortRaw = monthDate.toLocaleDateString('ru-RU', { month: 'short' });
    const monthShort = monthShortRaw.replace('.', '').slice(0, 3);
    const yearShort = String(monthYear).slice(-2);
    const monthLabel = `${monthShort.charAt(0).toUpperCase() + monthShort.slice(1)} '${yearShort}`;
    
    seasonMonths.push({
      date: monthDate,
      label: monthLabel,
      isCurrent: currentDate.getMonth() === monthIndex && currentDate.getFullYear() === monthYear
    });
  }

  // Объединяем данные матчей с существующими событиями (если есть)
  const calendarData = matchesByDate;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Первый день месяца и последний день
  const startDay = new Date(year, month, 1).getDay(); // 0 (Вс) - 6 (Сб)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Корректируем индекс: сделаем понедельник первым днем недели (1-7)
  const correctedStartDay = startDay === 0 ? 6 : startDay - 1;

  const generateCalendarDays = (): DayData[] => {
    const days: DayData[] = [];
    
    // Дни предыдущего месяца для заполнения пустых ячеек
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = correctedStartDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        date: new Date(year, month - 1, day),
        events: [],
        isCurrentMonth: false,
      });
    }

    // Дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dateString = dateObj.toISOString().split('T')[0];
      
      days.push({
        date: dateObj,
        events: calendarData[dateString] || [],
        isCurrentMonth: true,
      });
    }

    // Дни следующего месяца для заполнения оставшихся ячеек сетки (до 42)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        events: [],
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleMonthSelect = (monthIndex: number, year: number) => {
    setCurrentDate(new Date(year, monthIndex, 1));
  };

  return (
    <div className="calendar container">
      <h1 className='title-h1'>
        Календарь
        <br />
        {clubTeam?.name}
      </h1>

      <div className="calendar-general-filter">
        <div className="calendar-filters-wrapper">
          {/* Фильтры матчей по месту проведения */}
          <div className="match-filters">
            <button 
              className={`filter-button ${matchFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleMatchFilterChange('all')}
            >
              Все
            </button>
            <button 
              className={`filter-button ${matchFilter === 'home' ? 'active' : ''}`}
              onClick={() => handleMatchFilterChange('home')}
            >
              Домашние
            </button>
            <button 
              className={`filter-button ${matchFilter === 'away' ? 'active' : ''}`}
              onClick={() => handleMatchFilterChange('away')}
            >
              Выездные
            </button>
          </div>

          {/* Панель с кнопками месяцев сезона */}
          <div className="months-panel">
            {seasonMonths.map((month, index) => (
              <button
                key={index}
                className={`month-button ${month.isCurrent ? 'active' : ''}`}
                onClick={() => handleMonthSelect(month.date.getMonth(), month.date.getFullYear())}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>

        {/* Выпадающий список сезонов */}
        {seasons.length > 0 && (
          <div className="season-selector">
            <div className="custom-select">
              <button 
                className={`season-select-trigger ${isSeasonDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
              >
                <span className="season-select-text">
                  {selectedSeason ? `${selectedSeason.start_year}/${String(selectedSeason.end_year).slice(-2)}` : 'Выберите сезон'}
                </span>
                <span className="season-select-arrow"></span>
              </button>
              <div className={`season-dropdown ${isSeasonDropdownOpen ? 'open' : ''}`}>
                {seasons.map((s) => (
                  <div 
                    key={s.id} 
                    className={`season-option ${selectedSeason?.id === s.id ? 'selected' : ''}`}
                    onClick={() => {
                      handleSeasonChange({ target: { value: s.id.toString() } } as React.ChangeEvent<HTMLSelectElement>);
                      setIsSeasonDropdownOpen(false);
                    }}
                  >
                    {s.start_year}/{String(s.end_year).slice(-2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="calendar-grid">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="weekday-header">{day}</div>
        ))}

        {calendarDays.map((dayData, index) => {
          const dayNumber = dayData.date.getDate();
          const isCurrent = dayData.isCurrentMonth;
          
          return (
            <div 
              key={index} 
              className={`calendar-cell ${isCurrent ? 'current-month' : 'other-month'}`}
            >
              { isCurrent && (
                <div className={dayData.events.length > 0 ? 'day-number day-number-event' : 'day-number'}>{dayNumber}</div>
              )}
              {/* Рендер переданных данных в ячейке */}
              <div className="events-container">
                {dayData.events.map((event) => (
                  <Link 
                    key={event.id} 
                    to={`/match/${event.slug}`}
                    className={`event-item event-item-${event.status?.toLowerCase()}`}
                  >
                    <div className={`event-time event-time-${event.status?.toLowerCase()}`}>{event.time}</div>
                    
                    <div className="event-teams">
                      
                      <div className="team-info">
                        <div className="club-team-emblem">  
                          <img src={`http://localhost:8000${event.emblemClubTeamURL}`} alt={event.emblemClubTeamURL} className='calendar-team-emblem team-emblem'/>
                        </div>
                        <span className={`event-club-team event-teams-${event.status?.toLowerCase()}`}>{event.clubTeam}</span>
                        <div className={`club-team-score team-score-${event.status?.toLowerCase()}`}>{event.ourScore}</div>
                      </div>
                      
                      <div className="team-info">
                        <div className="opponent-team-emblem">  
                          <img src={`http://localhost:8000${event.emblemOpponentTeamURL}`} alt={event.emblemOpponentTeamURL} className='calendar-team-emblem team-emblem'/>
                        </div>
                        <span className={`event-opponent-team event-teams-${event.status?.toLowerCase()}`}>{event.opponentTeam}</span>
                        <div className={`opponent-team-score team-score-${event.status?.toLowerCase()}`}>{event.opponentScore}</div>
                      </div>
                    </div>
                    {event.address && (
                      <div className={`event-address event-address-${event.status?.toLowerCase()}`}>{event.address}</div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
