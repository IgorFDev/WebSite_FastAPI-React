import { Link } from "react-router-dom";


interface NewsCardBigProps {
  news: any;
}

export default function NewsCard({ news }: NewsCardBigProps) {
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
            key={news.id} 
            to={`/news/${news.slug}`}
            className="news-card-link"
        >
            <div key={news.id} className='news-post big'>
                <div className='news-post-background'>
                    <div className='news-post-img'>
                        <img
                            src={`http://localhost:8000${news.cover.url}`}
                            alt={news.title}
                            className='news-post-img-big'
                        />
                        <div className='news-post-overlay' />
                    </div>
                    <div className='news-content-wrapper'>
                        <div className='news-date'>
                            {formatDate(news.published_at)}
                        </div>
                        <h2 className='news-title'>{news.title}</h2>
                        <div className='news-content' dangerouslySetInnerHTML={{ __html: news.content }} />
                    </div>
                </div>
            </div>
        </Link>
    )

}