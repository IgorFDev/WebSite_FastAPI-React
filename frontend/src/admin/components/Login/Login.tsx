import { useState } from "react"
import "../Login/Login.css"

type LoginProps = {

    email: string

    password: string

    setEmail: React.Dispatch<
        React.SetStateAction<string>
    >

    setPassword: React.Dispatch<
        React.SetStateAction<string>
    >

    handleSubmit: (
        e: React.FormEvent
    ) => Promise<void>

    error: string

}

export default function AdminLogin({

    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    error

}: LoginProps) {

    return (

        <div className="login-card">

            <div className="admin-header">

                <i className="fas fa-shield-halved"></i>

                <h1>
                    Вход в админку
                </h1>

                <p>
                    Введите учётные данные
                    для доступа
                </p>

            </div>


            <form
                onSubmit={handleSubmit}
                id="adminLoginForm"
            >

                {/* EMAIL */}

                <div className="input-group">

                    <label htmlFor="email">

                        <i className="fas fa-envelope"></i>

                        {" "}E-mail

                    </label>

                    <div className="input-wrapper">

                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                </div>


                {/* PASSWORD */}

                <div className="input-group">

                    <label htmlFor="password">

                        <i className="fas fa-lock"></i>

                        {" "}Password

                    </label>

                    <div className="input-wrapper">

                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>

                </div>


                {/* BUTTON */}

                <button
                    type="submit"
                    className="login-btn"
                >

                    <span>
                        Войти
                    </span>

                    {" "}

                    <i className="fas fa-arrow-right-to-bracket"></i>

                </button>

            </form>


            {error && (
                <p>{error}</p>
            )}

        </div>

    )

}