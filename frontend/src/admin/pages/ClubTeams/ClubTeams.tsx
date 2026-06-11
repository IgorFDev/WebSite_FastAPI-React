import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getClubTeams, createClubTeam, updateClubTeam, deleteClubTeam } from "../../../api/clubTeams"
import { fieldsClubTeam } from "../../components/Crud/FormField"
import UniversalModal from "../../components/UI/UniversalModal/UniversalModal"
import UniversalForm from "../../components/Forms/UniversalForm/UniversalForm"
import "./ClubTeams.css"

function ClubTeams() {
    const [clubTeams, setClubTeams] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [initialData, setInitialData] = useState<any>(null)

    async function loadClubTeams() {
        try {
            const data = await getClubTeams()
            setClubTeams(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadClubTeams()
    }, [])

    async function handleCreateClubTeam(
            data: any
        ) {

            try {

                await createClubTeam(data)

                await loadClubTeams()

                setIsModalOpen(false)

            } catch (error) {

                console.error(error)

            }

        }

    async function handleUpdateClubTeam(
            data: any,
            id: number
        ) {

            try {

                await updateClubTeam(id, data)

                await loadClubTeams()

                setIsModalOpen(false)

            } catch (error) {

                console.error(error)

            }

        }
    
    async function handleDeleteClubTeam(
            id: number
        ) {

            try {

                await deleteClubTeam(id)

                await loadClubTeams()

            } catch (error) {

                console.error(error)

            }

        }

    return (
        <div className="container-club-teams">
            <h1>Клубные команды</h1>

            
            <button className="club-team-create-button" onClick={() =>{setInitialData(null); setIsModalOpen(true)}}>
                Создать команду
            </button>
            {
                isModalOpen && (
                    <UniversalModal
                        title="Создание команды"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <UniversalForm
                            fields={fieldsClubTeam}
                            onSubmit={handleCreateClubTeam}
                        />
                    </UniversalModal>
                )
            }

            <div className="club-teams-list">
                {clubTeams.map((clubTeamsItem: any) => (
                    <div key={clubTeamsItem.id}>
                        <Link to={`${clubTeamsItem.slug}`}>
                            <div className="club-teams-item">
                                <h2>{clubTeamsItem.name}</h2>
                            </div>
                        </Link>
                        <button
                            onClick={() => {

                                setInitialData(clubTeamsItem)

                                setIsModalOpen(true)

                            }}
                        >
                            ✏️
                        </button>
                        {
                            isModalOpen && (
                                <UniversalModal
                                    title="Редактирование команды"
                                    onClose={() => setIsModalOpen(false)}
                                >
                                    <UniversalForm
                                        fields={fieldsClubTeam}
                                        initialData={initialData}
                                        onSubmit={
                                            initialData
                                                ? (data) => handleUpdateClubTeam(data, initialData.id)
                                                : handleCreateClubTeam
                                        }
                                    />
                                </UniversalModal>
                            )
                        }
                        <button className="club-team-create-button" 
                            onClick={() => handleDeleteClubTeam(clubTeamsItem.id)}
                            title="Удалить команду"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>


    )
}

export default ClubTeams