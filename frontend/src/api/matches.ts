import api from "./client"

const API_URL = "http://localhost:8000/api/v1"

export async function getMatches() {
    const response = await fetch(`${API_URL}/match/`)

    if (!response.ok) {
        throw new Error("Ошибка загрузки матчей")
    }
    
    return response.json()
}

export async function getMatchbySlug(slug: string) {
    const response = await fetch(`${API_URL}/match/${slug}`)

    if (!response.ok) {
        throw new Error("Матч не найден")
    }
    
    return response.json()
}

export async function createMatch(data: any) {
    const response = await api.post("/match/", data)
    return response.data
}

export async function updateMatch(slug: string, data: any) {
    const response = await api.patch(`/match/${slug}`, data)
    return response.data
}

export async function deleteMatch(slug: string) {
    const response = await api.delete(`/match/${slug}`)
    return response.data
}

export async function deleteMatchSet(match_id: number) {
    const response = await api.delete(`/match-sets/match/${match_id}`)
    return response.data
}