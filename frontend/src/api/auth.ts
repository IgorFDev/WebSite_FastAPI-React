export async function login(
    email: string,
    password: string
) {
    const formData = new URLSearchParams()

    formData.append("username", email)
    formData.append("password", password)
    
    const response = await fetch(
        "http://localhost:8000/api/v1/admins/auth/login", {
        
        method: "POST",
        
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData
    }
)

if (!response.ok) {
        throw new Error("Ошибка авторизации")    
    }
    return response.json()
}
