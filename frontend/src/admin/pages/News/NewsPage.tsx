import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getAllNews, createNews } from "../../../api/news"
import UniversalModal from "../../components/UI/UniversalModal/UniversalModal"
import UniversalForm from "../../components/Forms/UniversalForm/UniversalForm"
import { newsFields } from "../../components/Crud/FormField"

import "./NewsPage.css"

function NewsPage() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [news, setNews] = useState([])

    async function loadNews() {
        try {
            const data = await getAllNews()
            setNews(data)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleCreateNews(data: any) {
        try {

            await createNews(data)
            
            await loadNews()
            
            setIsModalOpen(false)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadNews()
    }, [])

    return (
        <div className="container">
            <h1>Новости</h1>

            <button className="season-create-button" onClick={() => setIsModalOpen(true)}>
                Добавить новость
            </button>
            {
                isModalOpen && (
                    <UniversalModal
                        title="Создание новости"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <UniversalForm
                            fields={newsFields}
                            onSubmit={handleCreateNews}
                        />
                    </UniversalModal>
                )
            }
            
            <div className="news-list">
                {news.map((newsItem: any) => (
                    <div key={newsItem.id}>
                        <Link to={`${newsItem.slug}`}>
                            <div className="news-item">
                                <h2>{newsItem.title}</h2>
                                <img src={`http://localhost:8000${newsItem.cover.url}`} alt={newsItem.title} className="news-image"/>
                            </div>
                        </Link>

                        <button>
                            Опубликовать
                        </button>

                        <button>
                            ✏️
                        </button>
                        
                        <button>
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewsPage