import api from "./client"

const API_URL = "http://localhost:8000/api/v1"

export async function getNews() {
    const response = await fetch(`${API_URL}/news`)
    
    if (!response.ok) {
        throw new Error("Ошибка загрузки новостей")
    }
    
    return response.json()
}

export async function getNewsById(id: number) {
    const response = await fetch(`${API_URL}/news/${id}`)
    
    if (!response.ok) {
        throw new Error("Новость не найдена")
    }
    
    return response.json()
}

export async function createNews(data: any) {
    const response = await api.post("/news", data)
    return response.data
}

export async function getAllNews() {
    const response = await api.get("/news/all")
    return response.data
}

export async function updateNews(id: number, data: any) {
    const response = await api.patch(`/news/${id}`, data)
    return response.data
}

export async function deleteNews(id: number) {
    const response = await api.delete(`/news/${id}`)
    return response.data
}

export async function publishNews(id: number) {
    const response = await api.post(`/news/${id}/publish`)
    return response.data
}
