import api from "./client"

export async function getMatchSets(matchId: number) {
    const response = await api.get(`/match-sets/${matchId}`)
    return response.data
}

export async function createMatchSet(data: any) {
    const response = await api.post(`/match-sets`, data)
    return response.data
}

export async function updateMatchSet(match_set_id: number, data: any) {
    const response = await api.patch(`/match-sets/${match_set_id}`, data)
    return response.data
}

export async function deleteMatchSet(match_set_id: number) {
    const response = await api.delete(`/match-sets/${match_set_id}`)
    return response.data
}