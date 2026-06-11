import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link to={`/`}>
            <img src={`http://localhost:8000/media/Лого.png`}/>
          </Link>
        </div>

        <nav className="header__nav">
          <Link to="/">Главная</Link>
          <a href="#">Новости</a>
          <Link to="/players">Команды</Link>
          <a href="#">Календарь</a>
        </nav>
      </div>
      <button className="header__button">
        Хочу в команду
      </button>
    </header>
  )
}

export default Header