import { useEffect, useState } from "react"
import TeamCard from "../../components/TeamCard/TeamCard"

import { getClubTeams } from "../../api/clubTeams"

import "./TeamsPage.css"

function Teams() {
    
    const [teams, setTeams] = useState([])

    async function loadTeams() {
        try {
            const data = await getClubTeams()
            setTeams(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadTeams()
    }, [])

    return (
        <div className="container">
            <h1 className="title-h1">Команды ВК "SAMURAIS"</h1>

            <div className="teams-grid">
                {teams.map((team:any) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                    />
                ))}
            </div>
        </div>
    )
}

export default Teams