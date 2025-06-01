import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          Калькулятор калорий
        </NavLink>
        <ul className="navbar__list">
          <li className="navbar__item">
            <NavLink
              to="/"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              Главная
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/diary"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              Дневник
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/calculator"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              Калькулятор
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/products"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              Продукты
            </NavLink>
          </li>
          <li className="navbar__item">
            <NavLink
              to="/profile"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              Профиль
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;