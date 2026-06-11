import { getToken }
    from "../utils/auth"

export async function apiFetch(
    url: string,
    options: RequestInit = {}
) {
    const token = getToken()

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    })
}

import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1"
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api