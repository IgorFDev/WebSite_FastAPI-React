import api from "./client"

const API_URL = "http://localhost:8000/api/v1/"

export async function getNewsCategories() {
    
    const response = await fetch(`${API_URL}categories`)

    if (!response.ok) {
        throw new Error("Ошибка загрузки категорий новостей")
    }

    return response.json()
}

export async function addCategoriesForNews(slug: string) {

    const response = await api.patch(`news/${slug}/add-categories`)
    return response.data
}