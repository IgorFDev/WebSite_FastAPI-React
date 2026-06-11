import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getPlayers, createPlayer } from "../../../api/players"
import { getClubTeams } from "../../../api/clubTeams"
import { getPlayerFields } from "../../components/Crud/FormField"
import UniversalModal from "../../components/UI/UniversalModal/UniversalModal"
import UniversalForm from "../../components/Forms/UniversalForm/UniversalForm"


function AdminPlayers() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [players, setPlayers] = useState([])
    const [clubTeams, setClubTeams] = useState([])
    
    async function loadClubTeams() {  
        try {
            const data = await getClubTeams()
            setClubTeams(data)
        } catch (error) {
            console.error(error) 
        }
    }

    async function loadPlayers() {

        try {

            const data = await getPlayers()

            setPlayers(data)

        } catch (error) {

            console.error(error)

        }

    }

    useEffect(() => {
        loadPlayers()
        loadClubTeams()

    }, [])

    async function handleCreatePlayers(
        data: any
    ) {
        try {
            
            await createPlayer(data)

            await loadPlayers()

            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    const clubTeamOptions = clubTeams.map(team => ({ value: team.id, label: team.name}))
    const playerFields = getPlayerFields(clubTeamOptions)

    return (

        <div>

            <h1>
                Игроки
            </h1>

            <button className="season-create-button" onClick={() => setIsModalOpen(true)}>
                Добавить игрока
            </button>
            {
                isModalOpen && (
                    <UniversalModal
                        title="Создание игрока"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <UniversalForm
                            fields={playerFields}
                            onSubmit={handleCreatePlayers}
                        />
                    </UniversalModal>
                )
            }

            {players.map((player: any) => (
               
               <Link to={`/admin/players/${player.slug}`}>
                    <div key={player.id}>

                        {player.first_name}
                        {" "}
                        {player.last_name}

                    </div>
                </Link>
            ))}

        </div>

    )

}

export default AdminPlayers