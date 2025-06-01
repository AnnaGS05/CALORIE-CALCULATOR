import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Day } from '../types';
import '../styles/Diary.css';

interface DiaryProps {
  days: Day[];
  onDeleteMeal: (date: string, mealId: number) => void;
}

const Diary: React.FC<DiaryProps> = ({ days, onDeleteMeal }) => {
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const navigate = useNavigate();

  const currentDay = days.find((d) => d.date === currentDate) || {
    date: currentDate,
    meals: [],
    total: 0,
    goal: 2000,
  };

  const progressWidth = Math.min(100, (currentDay.total / currentDay.goal) * 100);
  const remainingCalories = currentDay.goal - currentDay.total;

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
  }, []);

  const handleAddMeal = useCallback(() => {
    navigate(`/calculator?date=${currentDate}`);
  }, [currentDate, navigate]);

  return (
    <div className="diary-page">
      <h2>Дневник питания</h2>
      <div className="date-picker">
        <input type="date" value={currentDate} onChange={handleDateChange} />
      </div>
      <div className="day-summary">
        <h3>Итого за {currentDate}:</h3>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${progressWidth}%`,
                backgroundColor: progressWidth >= 100 ? '#f44336' : '#4CAF50',
              }}
            ></div>
          </div>
          <div className="calories-info">
            <span className="calories-consumed">{currentDay.total}</span>
            <span className="calories-separator">/</span>
            <span className="calories-goal">{currentDay.goal}</span>
            <span className="calories-unit">ккал</span>
            {remainingCalories > 0 && (
              <span className="remaining-calories">Осталось: {remainingCalories} ккал</span>
            )}
          </div>
        </div>
      </div>
      <div className="meals-list">
        {currentDay.meals && currentDay.meals.length > 0 ? (
          currentDay.meals.map((meal) => (
            <div key={meal.id} className="meal-card">
              <div className="meal-header">
                <h4>{meal.name}</h4>
                <span className="meal-calories">{meal.calories} ккал</span>
                <button
                  onClick={() => onDeleteMeal(currentDate, meal.id)}
                  className="delete-meal-btn"
                >
                  ✕
                </button>
              </div>
              <div className="meal-products">
                <h5>Продукты:</h5>
                <ul>
                  {meal.foods.map((food, index) => (
                    <li key={index}>{food}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="no-meals">Нет записей о приемах пищи за этот день</p>
        )}
      </div>
      <button
        onClick={handleAddMeal}
        className="add-meal-btn"
      >
        + Добавить прием пищи
      </button>
    </div>
  );
};

export default Diary;