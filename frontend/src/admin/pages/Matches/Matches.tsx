import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getMatches, createMatch, updateMatch, deleteMatch} from "../../../api/matches"
import { getClubTeams } from "../../../api/clubTeams"
import { getSeasons } from "../../../api/seasons"
import { getTournamentTeams } from "../../../api/tournamentTeam"
import { getMatchFields } from "../../components/Crud/FormField"

import UniversalModal from "../../components/UI/UniversalModal/UniversalModal"
import UniversalForm from "../../components/Forms/UniversalForm/UniversalForm"

export default function Matches() {
    const [matches, setMatches] = useState([])
    const [clubTeams, setClubTeams] = useState([])
    const [seasons, setSeasons] = useState([])
    const [tournamentTeams, setTournamentTeams] = useState([])
    const [initialData, setInitialData] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    async function loadMatches() {
        try {
            const data = await getMatches()
            setMatches(data)
        } catch (error) {
            console.error(error)
        }
    }
    
    async function loadClubTeams() {
        try {
            const data = await getClubTeams()
            setClubTeams(data)
        } catch (error) {
            console.error(error)
        }
    }
    
    async function loadTournamentTeams() {
        try {
            const data = await getTournamentTeams()
            setTournamentTeams(data)
        } catch (error) {
            console.error(error)
        }
    }

    async function loadSeasons() {
        try {
            const data = await getSeasons()
            setSeasons(data)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleCreateMatch(data: any) {
        try {
            await createMatch(data)
            await loadMatches()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleUpdateMatch(slug: string, data: any) {
        try {
            await updateMatch(slug, data)
            await loadMatches()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleDeleteMatch(slug: string) {
        try {
            await deleteMatch(slug)
            await loadMatches()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadMatches()
        loadClubTeams()
        loadSeasons()
        loadTournamentTeams()
    }, [])

    const clubTeamOptions = clubTeams.map(team => ({ value: team.id, label: team.name }))
    const seasonOptions = seasons.map(season => ({ value: season.id, label: season.name }))
    const tournamentTeamOptions = tournamentTeams.map(team => ({ value: team.id, label: team.name }))

    const matchFields = getMatchFields(clubTeamOptions, seasonOptions, tournamentTeamOptions)

    return (
        <div>
            <h1>Матчи</h1>

            <button className="club-team-create-button" onClick={() => {setInitialData(null); setIsModalOpen(true)}}>
                Добавить матч
            </button>

            {
                isModalOpen && (
                    <UniversalModal
                        title="Создание матча"
                        onClose={() => setIsModalOpen(false)}
                    >
                        <UniversalForm
                            fields={matchFields}
                            onSubmit={handleCreateMatch}
                        />
                    </UniversalModal>
                )
            }

            {matches.map((match: any) => (
                <div key={match.id}>
                    <Link to={`/admin/matches/${match.slug}`}>
                        <div key={match.slug}>
                            {match.club_team.name} - {match.opponent_team.name}
                        </div>
                    </Link>
                    
                    <button
                        onClick={() => {
                            setInitialData(match);
                            setIsModalOpen(true);
                        }}
                    >
                        ✏️
                    </button>
                    {
                        isModalOpen && (
                                <UniversalModal
                                    title="Редактирование матча"
                                    onClose={() => setIsModalOpen(false)}
                                >
                                    <UniversalForm
                                        fields={matchFields}
                                        initialData={initialData}
                                        onSubmit={
                                            initialData
                                                ? (data) => handleUpdateMatch(initialData.slug, data)
                                                : handleCreateMatch
                                        }
                                    />
                                </UniversalModal>
                            )
                    }
                    <button
                        onClick={() => {
                            handleDeleteMatch(match.slug);
                        }}
                        title="Удалить матч"
                    >
                        🗑️
                    </button>

                </div>
            ))}
        </div>
    )
}