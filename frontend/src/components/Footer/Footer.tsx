import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    return (
        <footer className='footer'>
            <div className='container'>
                <div className="footer-grid">
                    <div className="footer-block">
                        <h3>Контакты</h3>
                        <div className="contact-list">
                            <div className="contact-item">
                                <div className="contact-text">
                                    <span className="address-text">Приморский проспект 50Б</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-text">
                                    <a href="mailto:vollsamurais@gmail.com">vollsamurais@gmail.com</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-text">
                                    <a href="tel:+79313054363">+7 (931) 305 43 63</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-block social-section">
                        <h3>Мы в соцсетях</h3>
                        <div className="social-icons">
                            <a href="#" className="social-icon-link" target="_blank" rel="noopener noreferrer" aria-label="VK">
                                <i className="fab fa-vk"></i>
                            </a>
                            <a href="#" className="social-icon-link" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <i className="fab fa-telegram-plane"></i>
                            </a>
                            <a href="#" className="social-icon-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        &copy; 2025 Voll Samurais. Все права защищены.
                    </div>
                    <div className="footer-links">
                        <a href="#">Политика конфиденциальности</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">Пользовательское соглашение</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer