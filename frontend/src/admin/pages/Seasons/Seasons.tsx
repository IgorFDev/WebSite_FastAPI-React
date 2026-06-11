import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getSeasons, createSeason, updateSeason, deleteSeason } from "../../../api/seasons"
import { fieldsSeason } from "../../components/Crud/FormField"
import UniversalModal from "../../components/UI/UniversalModal/UniversalModal"
import UniversalForm from "../../components/Forms/UniversalForm/UniversalForm"
import "./Seasons.css"

function SeasonsPage() {

    const [seasons, setSeasons] = useState([])
    const [initialData, setInitialData] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    async function loadSeasons() {
        try {
            const data = await getSeasons()
            setSeasons(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadSeasons()
    }, [])

    async function handleCreateSeason(
        data: any
    ) {
        try {
            await createSeason(data)
            await loadSeasons()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleUpdateSeason(
        data: any,
        id: number
    ) {
        try {
            await updateSeason(id, data)
            await loadSeasons()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleDeleteSeason(
        id : number
    ) {
        try {
            await deleteSeason(id)
            await loadSeasons()
        } catch (error) {
            console.error(error)
        }
    }
        

    return (
        <div className="container-seasons">
            <h1>Сезоны</h1>

            
            <button className="season-create-button" onClick={() => {setInitialData(null); setIsModalOpen(true)}}>
                Создать сезон
            </button>
            {
                isModalOpen && (
                    <UniversalModal
                        title="Создание сезона"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <UniversalForm
                            fields={fieldsSeason}
                            onSubmit={handleCreateSeason}
                        />
                    </UniversalModal>
                )
            }
            <div className="seasons-list">
                {seasons.map((seasonsItem: any) => (
                    <div key={seasonsItem.id}>    
                        <Link to={`${seasonsItem.name}`}>
                            <div className="seasons-item">
                                <h2>{seasonsItem.name}</h2>
                                <p>Создан: {formatDate(seasonsItem.created_at)}</p>
                            </div>
                        </Link>

                        <button 
                            onClick={() => {
                                setInitialData(seasonsItem); 
                                setIsModalOpen(true)
                            }}
                            title="Редактировать сезон"
                        >
                            ✏️
                        </button>

                        <button 
                            onClick={() => handleDeleteSeason(seasonsItem.id)}
                            title="Удалить сезон"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SeasonsPage