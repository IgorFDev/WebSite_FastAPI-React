import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import NewsCard from '../../components/NewsCard/NewsCardBig';
import { getMatches } from '../../api/matches';
import { getNews } from '../../api/news';
import MatchCard from '../../components/MatchCard/MatchCard';
import { getClubTeams } from '../../api/clubTeams';
import PlayerCarousel, { type PlayerCarouselHandle } from '../../components/PlayerCarousel/PlayerCarousel'
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [clubTeams, setClubTeams] = useState<any[]>([]);
  const [selectedClubTeams, setSelectedClubTeams] = useState<number | null>(null);
  const [visibleStates, setVisibleStates] = useState<boolean[]>([]);
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const playerCarouselRef = useRef<PlayerCarouselHandle>(null);


  // Состояния для drag-to-scroll
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  async function GetMatches() {
    const data = await getMatches();
    setMatches(data);
  }

  async function GetNews() {
    const data = await getNews();
    setNews(data);
  }

  async function GetClubTeams() {
    const data = await getClubTeams();
    setClubTeams(data);
  }

  useEffect(() => {
    GetMatches();
    GetNews();
    GetClubTeams();
  }, []);

  const filteredPlayers = clubTeams.find((team) => team.id === selectedClubTeams)?.players ?? [];

  function selectClubTeam(clubTeamId: number) {
    setSelectedClubTeams(clubTeamId);
  }

  useEffect(() => {
    if (clubTeams.length === 0) return;
    if (selectedClubTeams !== null) return;

    const samurais =
      clubTeams.find((t) => t.slug === 'samurais') ?? clubTeams[0];
      setSelectedClubTeams(samurais.id);
  }, [clubTeams, selectedClubTeams]);


  // Функция определения полностью видимых карточек
  const updateVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLLIElement[];
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    const tolerance = 1;

    const newVisibleStates = children.map((child) => {
      const left = child.offsetLeft;
      const width = child.offsetWidth;
      return left >= scrollLeft - tolerance && left + width <= scrollLeft + clientWidth + tolerance;
    });

    setVisibleStates(newVisibleStates);
  }, []);

  useLayoutEffect(() => {
    updateVisibility();
  }, [matches, updateVisibility]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    updateVisibility();
  };

  // --- Вспомогательные функции для центрирования карточек ---
  const getLastFullyVisibleCard = (): HTMLLIElement | null => {
    const container = scrollContainerRef.current;
    if (!container) return null;
    const children = Array.from(container.children) as HTMLLIElement[];
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    const tolerance = 1;
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      const left = child.offsetLeft;
      const right = left + child.offsetWidth;
      if (left >= scrollLeft - tolerance && right <= scrollLeft + clientWidth + tolerance) {
        return child;
      }
    }
    return null;
  };

  const getFirstFullyVisibleCard = (): HTMLLIElement | null => {
    const container = scrollContainerRef.current;
    if (!container) return null;
    const children = Array.from(container.children) as HTMLLIElement[];
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    const tolerance = 1;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const left = child.offsetLeft;
      const right = left + child.offsetWidth;
      if (left >= scrollLeft - tolerance && right <= scrollLeft + clientWidth + tolerance) {
        return child;
      }
    }
    return null;
  };

  const centerCard = (card: HTMLLIElement) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const newScrollLeft = cardCenter - container.clientWidth / 2;
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  // --- Drag-to-scroll ---
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.startScrollLeft = el.scrollLeft;
    dragState.current.moved = false;
    el.classList.add('dragging');
  };

  const stopDragging = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    dragState.current.isDown = false;
    el.classList.remove('dragging');
  };

  const handleMouseUp = () => {
    stopDragging();
  };

  const handleMouseLeave = () => {
    stopDragging();
    const el = scrollContainerRef.current;
    if (el) el.style.cursor = 'grab';
  };

  // --- Обработчик кликов (зоны и карточки) ---
  const handleClick = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Если было перетаскивание, игнорируем клик
    if (dragState.current.moved) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const leftZoneWidth = rect.width * 0.15;
    const rightZoneWidth = rect.width * 0.15;

    // Клик по левой зоне
    if (x < leftZoneWidth && canScrollLeft) {
      const firstCard = getFirstFullyVisibleCard();
      if (firstCard) centerCard(firstCard);
      return;
    }

    // Клик по правой зоне
    if (x > rect.width - rightZoneWidth) {
      const lastCard = getLastFullyVisibleCard();
      if (lastCard) centerCard(lastCard);
      return;
    }

    // Клик по карточке (не в зоне)
    const target = e.target as HTMLElement;
    const cardElement = target.closest('li.home-match-item');
    if (cardElement) {
      const children = Array.from(container.children) as HTMLLIElement[];
      const index = children.indexOf(cardElement as HTMLLIElement);
      if (index !== -1 && visibleStates[index] === false) {
        // Карточка не полностью видима
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (cardRect.right > containerRect.right - 1) {
          // Карточка справа — центрируем последнюю полностью видимую
          const lastCard = getLastFullyVisibleCard();
          if (lastCard) centerCard(lastCard);
        } else if (cardRect.left < containerRect.left + 1) {
          // Карточка слева — центрируем первую полностью видимую
          const firstCard = getFirstFullyVisibleCard();
          if (firstCard) centerCard(firstCard);
        }
      }
    }
  };

  return (
    <main>
      <HeroCarousel />
      
      <div className="home-container">
        <div className="home-wrapper"> 
          <h2>Календарь матчей</h2>
          <div className="home-button">
            <Link to='/calendar/samurais'>
              <button className="header__button">
                Весь календарь
              </button>
            </Link>
          </div>
        </div> 
        <ul
          ref={scrollContainerRef}
          className="home-matches-list matches-list"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {matches.map((match: any, index: number) => (
            <li key={match.id} className="home-match-item match-item">
              <MatchCard
                key={match.id}
                match={match}
                disabled={!visibleStates[index]}
              />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="home-container">
        <div className="home-wrapper"> 
          <h2>Новости клуба</h2>
          <div className="home-button">
            <Link to="/news">
              <button className="header__button">
                Все новости
              </button>
            </Link>
          </div>
        </div>
        <div className="home-news">
          <div className="home-news-wrapper">
            <div className="home-news-item-wrapper"> 
              {news.slice(0, 3).map((item, index) => {
                const isFirst = index === 0;

                if (isFirst) {
                  return (
                    <NewsCard key={item.id} news={item}/>
                  );
                }
                
                return null;
              })}
            </div>
            <div className="home-news-items-wrapper">
              {news.slice(1, 3).map((item) => {
                return (
                  <NewsCard key={item.id} news={item}/>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="home-container">
        <div className="home-wrapper"> 
          <h2>Команды</h2>
          <div className="home-button">
            <Link to={`/team/${clubTeams.find(team => team.id === selectedClubTeams)?.slug || ''}`}>
              <button className="header__button">
                Вся команда
              </button>
            </Link>
          </div>
        </div>
        <div className="home-club-teams-controlling">  
          <div className="home-club-teams-filters">
            <div className="club-teams-filters-wrapper">
              {clubTeams.map((item) => {
                const isSelected = selectedClubTeams === item.id;

                return(
                  <div
                      key={item.id}
                      className={`club-teams-filter ${isSelected ? 'active' : ''}`}
                      onClick={() => selectClubTeam(item.id)}
                      >
                      <div className={`club-teams-filter-text ${isSelected ? 'active' : ''}`}>
                        {item.name}
                      </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="controls">
              <button className="nav" onClick={() => playerCarouselRef.current?.prev()}>
                <img src="/arrow-right.svg" alt="arrow-left" className="arrow arrow-left" />
              </button>
              <button className="nav" onClick={() => playerCarouselRef.current?.next()}>
                <img src="/arrow-right.svg" alt="arrow-right" className="arrow" />
              </button>
          </div>
        </div>
        <div className="home-club-teams">
          <PlayerCarousel 
            ref={playerCarouselRef}
            players={filteredPlayers}
          />
        </div>
      </div>
      
      <div className="home-container">
        <div className="home-wrapper"> 
          <h2>Таблица</h2>
          <div className="club-teams">

          </div>
          <div className="home-button">
            <button className="header__button">
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;