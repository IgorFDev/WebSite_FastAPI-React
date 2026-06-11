import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { login } from "../../../api/auth"

import AdminLogin from "../../components/Login/Login"

import { saveToken } from "../../../utils/auth"

import "./Login.css"

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault()

        try {

            const data = await login(
                email,
                password
            )

            saveToken(data.access_token)

            navigate("/admin")

        } catch (error) {

            setError("Неверный email или пароль")

        }

    }

    return (
        <div className="admin-login-container">
            <AdminLogin 
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                error={error}

            />
        </div>
    )
}

export default Login