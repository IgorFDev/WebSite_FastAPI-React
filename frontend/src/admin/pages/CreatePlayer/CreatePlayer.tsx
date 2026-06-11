import { useState } from "react"
import { createPlayer } from "../../../api/players"


function CreatePlayer() {

    /* const [clubTeamId, setClubTeamId] = useState(1) */
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [number, setNumber] = useState(0)
    const [BirthDate, setBirthDate] = useState()
    const [message, setMessage] = useState("")

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault()

        try {

            await createPlayer({

                club_team_id: 1,
                first_name: firstName,
                last_name: lastName,
                number: number,

                position: "SETTER",

                birth_date: "2026-10-09",

                height: 180,
                weight: 75,

                sport_rank: "Любитель",

                avatar_media_id: 15,
                background_media_id: 20,

                is_current: true

            })

            alert("Игрок создан")

        } catch (error: any) {
                console.error('Ошибка валидации:', error.response?.data);
                setMessage(`Ошибка: ${JSON.stringify(error.response?.data?.detail)}`);
            }

    }

    return (

        <div>

            <h1>
                Создание игрока
            </h1>

            <form onSubmit={handleSubmit}>


                <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) =>
                        setFirstName(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) =>
                        setLastName(e.target.value)
                    }
                />

                <input
                    type="number"
                    placeholder="Номер"
                    value={number}
                    onChange={(e) =>
                        setNumber(Number(e.target.value))
                    }
                />

                {/* <input
                    type="date"
                    placeholder="Дата рождения"
                    value={BirthDate}
                    onChange={() =>
                        setBirthDate(undefined)
                    }
                /> */}


                <button type="submit">
                    Создать
                </button>

            </form>
            {message && <p>{message}</p>}
        </div>

    )

}

export default CreatePlayer