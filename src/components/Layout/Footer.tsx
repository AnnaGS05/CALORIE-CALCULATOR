import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">
          © {new Date().getFullYear()} Калькулятор калорий. Все права защищены.
        </p>
        <div className="footer__links">
          <a href="#" className="footer__link">О нас</a>
          <a href="#" className="footer__link">Контакты</a>
          <a href="#" className="footer__link">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;