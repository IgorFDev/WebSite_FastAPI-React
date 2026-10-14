import DropDownMenu from '../DropDown/DropDown'
import { getClubTeams } from "../../api/clubTeams";

import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

import './Header.css'


function Header() {
  const [visible, setVisible] = useState(true)
  const prevScrollY = useRef(0);
  const [clubTeams, setClubTeams] = useState([])
    
  async function loadClubTeams() {
      try {
          const data = await getClubTeams()
          setClubTeams(data)
      } catch (error) {
          console.error(error)
      }
  }

  const [shouldShow, setShouldShow] = useState(true);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > prevScrollY.current && currentScrollY > 500) {
      setShouldShow(false);
    }

    else if (currentScrollY < prevScrollY.current && prevScrollY.current > 500) {
      setShouldShow(true);
    }

    prevScrollY.current = currentScrollY;
  };

  useEffect(() => {
    setVisible(shouldShow);
  }, [shouldShow]);

  useEffect(() => {
    loadClubTeams()
    handleScroll()

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])
    
  return (
    <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
      <div className="header__container">
        <div className="header__logo">
          <Link to={`/`}>
            <img src={`http://localhost:8000/media/Лого.png`}/>
          </Link>
        </div>

        <nav className="header__nav">
          <Link to="/">Главная</Link>
          <Link to="/news">Новости</Link>
          <Link to="/teams">
              <DropDownMenu title="Команды" slug="team" teams={clubTeams}/>
          </Link>
          <Link to="#">
            <DropDownMenu title="Календарь" slug="calendar" teams={clubTeams}/>
          </Link>
        </nav>
      </div>
      <button className="header__button">
        Хочу в команду
      </button>
    </header>
  )
}

export default Header