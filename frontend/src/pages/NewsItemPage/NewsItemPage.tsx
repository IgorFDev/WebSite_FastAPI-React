import { useState, useEffect, useRef } from 'react';
import { getNewsBySlug, incrementNewsView } from '../../api/news';
/* import { getNewsCategories } from '../../api/categories'; */
import { useParams } from 'react-router-dom';
import './NewsItemPage.css';

function NewsItemPage() {

    const { slug } = useParams()
    
    const [news, setNews] = useState<any>(null);
    const [viewRecorded, setViewRecorded] = useState(false);
    const viewTimerRef = useRef<number | null>(null);

    async function loadNews() {
        if (!slug) return
        try {
            const data = await getNewsBySlug(slug)
            setNews(data)
        } catch (error) {
            console.error(error)
        }
    }

    async function recordView() {
        if (!news || viewRecorded) return;
        
        try {
            await incrementNewsView(news.id);
            setViewRecorded(true);
            console.log('Просмотр записан');
        } catch (error) {
            console.error('Ошибка при записи просмотра:', error);
        }
    }

    useEffect(() => {
        loadNews();
    }, [slug])

    // Таймер 5+ секунд для записи просмотра
    useEffect(() => {
        if (!news || viewRecorded) return;

        // Запускаем таймер на 5 секунд
        viewTimerRef.current = setTimeout(() => {
            recordView();
        }, 5000);

        // Очистка таймера при размонтировании
        return () => {
            if (viewTimerRef.current) {
                clearTimeout(viewTimerRef.current);
            }
        };
    }, [news, viewRecorded]);

    if (!news) {
        return <div>Загрузка...</div>
    }

    return (
        news && (
            <div className='news-item-page container'>
                <h1 className='title-h1'>
                    {news.title}
                </h1>
                <div className='news-item-meta'>
                    <span className='news-views-count'>👁 {news.views_count} просмотров</span>
                </div>
                <div className='news-item-image-wrapper'>
                    <img src={`http://localhost:8000${news.cover.url}`} alt={news.title} className='news-item-image'/>
                </div>
                <div className='news-item-content-wrapper'>
                    <div className='news-item-content'>
                        <div dangerouslySetInnerHTML={{ __html: news.content }} />
                    </div>
                </div>
            </div>
        )
    )
}

export default NewsItemPage;