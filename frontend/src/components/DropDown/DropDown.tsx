import { useState } from "react"
import { Link } from 'react-router-dom';

import './DropDown.css'

interface Team {
  id: number;
  name: string;
  slug: string;
};

interface Props {
    title: string;
    slug: string;
    teams: Team[];
}

function DropDownMenu({title, slug, teams}:Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div 
            className="dropdown"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            
            <span className="dropdown-title">{title}</span>

            <div className={`dropdown-menu-wrapper ${isOpen ? 'open' : ''}`}>
                <ul className="dropdown-menu">
                    {teams.map((team) => (
                        <li key={team.id}>
                            <Link to={`/${slug}/${team.slug}`}>
                                {team.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DropDownMenu
