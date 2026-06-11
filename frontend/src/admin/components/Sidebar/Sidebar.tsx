import { NavLink } from "react-router-dom"

import "./Sidebar.css"

function Sidebar() {
    return (
        <aside className="admin-sidebar">
            <nav>
                <ul className="sidebar__ul">
                    <li className="sidebar__nav">
                        <NavLink to="/admin">Главная</NavLink>
                    </li>
                    <li className="sidebar__nav">
                        <NavLink to="/admin/players">Игроки</NavLink>
                    </li>
                    <li className="sidebar__nav">
                        <NavLink to="/admin/teams">Команды</NavLink>
                    </li>
                    <li className="sidebar__nav">
                        <NavLink to="/admin/media">Медиа</NavLink>
                    </li>
                    <li className="sidebar__nav">
                        <NavLink to="/admin/seasons">Сезоны</NavLink>
                    </li>
                    <li className="sidebar__nav">
                        <NavLink to="/admin/matches">Матчи</NavLink>
                    </li>
                    <li className="sidebar__nav">
                        <NavLink to="/admin/news">Новости</NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
