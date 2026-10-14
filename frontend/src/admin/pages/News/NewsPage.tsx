import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getAllNews, createNews, deleteNews, publishNews, updateNews } from "../../../api/news"
/* import { getNewsCategories } from "../../../api/categories" */
import UniversalModal from "../../components/UI/UniversalModal/UniversalModal"
import UniversalForm from "../../components/Forms/UniversalForm/UniversalForm"
import { newsFields, newsUpdateFields } from "../../components/Crud/FormField"

import "./NewsPage.css"
import { getNewsCategories } from "../../../api/categories"

function NewsPage() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingNews, setEditingNews] = useState<any>(null)
    const [categories, setCategories] = useState([])
    const [news, setNews] = useState([])
    const [initialData, setInitialData] = useState<any>(null)

    async function loadNews() {
        try {
            const data = await getAllNews()
            setNews(data)
        } catch (error) {
            console.error(error)
        }
    }

    async function loadCategories() {
        try {
            const data = await getNewsCategories()
            setCategories(data)
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

    function openEditModal(newsItem: any) {
        console.log('Данные новости для редактирования:', newsItem)
        
        // Преобразуем данные для формы
        const formData = {
            ...newsItem,
            cover: newsItem.cover?.id || newsItem.cover_media_id, // Пробуем получить id из объекта cover или из cover_media_id
            categories: newsItem.categories?.map((cat: any) => cat.id) || [] // Преобразуем категории в массив id
        }
        console.log('Преобразованные данные для формы:', formData)
        
        setEditingNews(formData)
        setIsEditModalOpen(true)
    }

    function closeEditModal() {
        setEditingNews(null)
        setIsEditModalOpen(false)
    }

    async function handleUpdateNews(id: number, data: any) {
        try {
            // Отправляем только те поля, которые ожидает бэкенд
            const updateData = {
                title: data.title,
                content: data.content,
                cover: data.cover,
                categories: data.categories
            }
            
            console.log('Отправляемые данные для обновления:', updateData)
            await updateNews(id, updateData)
            await loadCategories()
            await loadNews()
            closeEditModal()
        } catch (error) {
            console.error(error)
        }
    }

    async function handleDeleteNews(
            id : number
        ) {
            try {
                await deleteNews(id)
                await loadNews()
            } catch (error) {
                console.error(error)
            }
        }
    
    async function handlePublishNews(
            id : number
        ) {
            try {
                await publishNews(id)
                await loadNews()
            } catch (error) {
                console.error(error)
            }
        }

    useEffect(() => {
        loadNews()
        loadCategories()
    }, [])

    const categoryOptions = categories.map(category => ({ value: category.id, label: category.name}))
    const newsUpdateFieldsArray = newsUpdateFields(categoryOptions)

    return (
        <div className="container">
            <h1>Новости</h1>

            <button className="season-create-button" onClick={() => {setInitialData(null); setIsModalOpen(true)}}>
                Добавить новость
            </button>
            {
                isModalOpen && (
                    <UniversalModal
                        title="Создание новости"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <UniversalForm
                            fields={newsUpdateFieldsArray}
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

                        <button
                            onClick={() => handlePublishNews(newsItem.id)}
                        >
                            Опубликовать
                        </button>

                        <button className="news-edit-button" onClick={() => openEditModal(newsItem)}>
                            ✏️
                        </button>
                        {
                            isEditModalOpen && editingNews && (
                                <UniversalModal
                                    title="Обновление новости"
                                    onClose={closeEditModal}
                                >
                                    <UniversalForm
                                        fields={newsUpdateFieldsArray}
                                        initialData={editingNews}
                                        onSubmit={(data) => handleUpdateNews(editingNews.id, data)}
                                    />
                                </UniversalModal>
                            )
                        }
                        
                        <button
                            onClick={() => handleDeleteNews(newsItem.id)}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewsPage