import { useState, useEffect } from 'react';
import NewsCard from '../../components/NewsCard/NewsCardBig';
import { getNews, getMostViewedNews } from '../../api/news';
import { getNewsCategories } from '../../api/categories';
import { getMatches } from '../../api/matches';
import './NewsPage.css';
import { Link } from 'react-router-dom';

function ClientNewsPage() {
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    const formatWithTime = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        return `${day} ${month}, ${time}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // --- РЕАЛЬНЫЕ НОВОСТИ (с сервера) ---
    const [news, setNews] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [categories, setcategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [mostViewedNews, setMostViewedNews] = useState<any[]>([]);

    async function GetNews() {
        const news = await getNews();
        setNews(news);
    }

    async function GetNewsCategories() {
        const newsCategories = await getNewsCategories();
        setcategories(newsCategories);
    }
    
    async function GetMatches() {
        const matches = await getMatches();
        setMatches(matches);
    }

    async function GetMostViewedNews() {
        const mostViewedNews = await getMostViewedNews();
        setMostViewedNews(mostViewedNews);
    }

    useEffect(() => {
        GetNews();
        GetNewsCategories();
        GetMatches();
        GetMostViewedNews();
    }, []);

    const filteredNews = news.filter((item) => {
    if (selectedCategories.length === 0) {
        return true;
    }

    return selectedCategories.every((categoryId) =>
        item.categories.some(
                (category: any) => category.id === categoryId
            )
        );
    });

    function toggleCategory(categoryId: number) {
        setSelectedCategories((current) => {
            if (current.includes(categoryId)) {
                return current.filter(id => id !== categoryId);
            }

            return [...current, categoryId];
        });
    }

    return (
        <div className='news-page container'>
            <div className='news-page-title'>
                <h1>Новости</h1>
            </div>

            <div className='news-page-filters'>
                <div className='news-filters-wrapper'>
                    {categories.map((item) => {
                        const isSelected = selectedCategories.includes(item.id);
                        
                        return(
                            <div 
                                key={item.id} 
                                className={`news-filter ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleCategory(item.id)}
                            >
                                <div className={`news-filter-text ${isSelected ? 'active' : ''}`}>
                                    {item.name}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <div className='news-page-wrapper'>
                {/* Основной контент – 85% */}
                <div className='news-page-content'>
                    

                    {filteredNews.map((item, index) => {
                        const isFirst = index === 0;
                        
                        if (isFirst) {
                            return(
                                <NewsCard news={item} />
                            )
                        }                        
                        
                        return (    
                            <Link 
                                key={item.id} 
                                to={`/news/${item.slug}`}
                            >
                                <div key={item.id} className='news-post small'>
                                    <div className='news-post-img'>
                                        <img
                                            src={`http://localhost:8000${item.cover.url}`}
                                            alt={item.title}
                                            className='news-img'
                                        />
                                    </div>
                                    <div className='post_content_wrap'>
                                        
                                            <h2 className='news-title'>{item.title}</h2>
                                            <div className='news-content'>
                                                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                            </div>
                                            <div className='news-date'>{formatDate(item.published_at)}</div>
                                        
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Сайдбар – 10% */}
                <div className='news-page-sidebar'>
                    {/* Блок "Популярное" */}
                    <div className='sidebar-block popular'>
                        <h3 className='sidebar-title'>Популярное</h3>
                        <ul className='popular-list'>
                            {mostViewedNews.map(item => (
                                <li key={item.id} className='popular-item'>
                                    <Link 
                                        key={item.id} 
                                        to={`/news/${item.slug}`}
                                    >
                                        <div className='popular-item-wrapper'>    
                                            <div className='img-wrapper'>    
                                                <img src={`http://localhost:8000${item.cover.url}`} alt={item.title} className='popular-img'/>
                                            </div>
                                            <div className='content-wrapper'>
                                                <span className='popular-date'>{formatDate(item.published_at)}</span>
                                                <span className='popular-title'>{item.title}</span>
                                                <span className='popular-views'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#D3D3D3" width="20px" height="20px" viewBox="-3.5 0 32 32" version="1.1">
                                                        <title>view</title>
                                                        <path d="M12.406 13.844c1.188 0 2.156 0.969 2.156 2.156s-0.969 2.125-2.156 2.125-2.125-0.938-2.125-2.125 0.938-2.156 2.125-2.156zM12.406 8.531c7.063 0 12.156 6.625 12.156 6.625 0.344 0.438 0.344 1.219 0 1.656 0 0-5.094 6.625-12.156 6.625s-12.156-6.625-12.156-6.625c-0.344-0.438-0.344-1.219 0-1.656 0 0 5.094-6.625 12.156-6.625zM12.406 21.344c2.938 0 5.344-2.406 5.344-5.344s-2.406-5.344-5.344-5.344-5.344 2.406-5.344 5.344 2.406 5.344 5.344 5.344z"/>
                                                    </svg>
                                                     {item.views_count}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Блок "Ближайшие матчи" */}
                    <div className='sidebar-block matches'>
                        <h3 className='sidebar-title'>Ближайшие матчи</h3>
                        <ul className='matches-list'>
                            {matches
                                .slice(0, 3)
                                .map(match => ( 
                                    <li key={match.id} className='match-item'>
                                        <Link 
                                            key={match.id} 
                                            to={`/match/${match.slug}`}
                                        >      
                                            <div className='match-wrapper'>
                                                <div className='match-info'>    
                                                    <div className='match-date'>{formatWithTime(match.match_datetime)}</div>
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
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientNewsPage;