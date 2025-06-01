import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="home-page__banner">
        <div className="home-page__banner-content">
          <h1 className="home-page__title">Добро пожаловать в Калькулятор калорий!</h1>
          <p className="home-page__description">
            Следите за питанием, достигайте своих целей и ведите здоровый образ жизни с помощью нашего приложения.
          </p>
          <Link to="/profile" className="home-page__button">
            Начать сейчас
          </Link>
        </div>
      </section>

      <section className="home-page__features">
        <h2 className="home-page__features-title">Что мы предлагаем</h2>
        <div className="home-page__features-grid">
          <div className="feature-card">
            <h3 className="feature-card__title">Дневник питания</h3>
            <p className="feature-card__description">
              Записывайте свои приемы пищи и отслеживайте прогресс в достижении целей по калориям.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card__title">Калькулятор калорий</h3>
            <p className="feature-card__description">
              Рассчитывайте калории для каждого приема пищи, добавляйте продукты и сохраняйте свои блюда.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card__title">Профиль</h3>
            <p className="feature-card__description">
              Настройте свои цели, отслеживайте ИМТ и получайте рекомендации по питанию.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;