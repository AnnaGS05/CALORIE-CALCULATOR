import React, { useState, useCallback, useEffect } from 'react';
import '../styles/Profile.css';
import { UserData, ProfileResult } from '../types';

interface ProfileProps {
  onUpdateGoal: (newGoal: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ onUpdateGoal }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('profileData');
    return saved
      ? JSON.parse(saved)
      : {
          gender: 'female',
          age: 25,
          height: 170,
          weight: 60,
          activity: 'light',
          goal: 'maintain',
          calculated: false,
        };
  });

  const [result, setResult] = useState<ProfileResult | null>(() => {
    const saved = localStorage.getItem('profileResult');
    return saved ? JSON.parse(saved) : null;
  });

  const [isEditing, setIsEditing] = useState<boolean>(!userData.calculated);
  const [errors, setErrors] = useState<{ age?: string; height?: string; weight?: string }>({});

  const validateInputs = useCallback((data: UserData) => {
    const newErrors: { age?: string; height?: string; weight?: string } = {};

    if (data.age < 10 || data.age > 120) {
      newErrors.age = 'Возраст должен быть от 10 до 120 лет';
    }
    if (data.height < 100 || data.height > 250) {
      newErrors.height = 'Рост должен быть от 100 до 250 см';
    }
    if (data.weight < 20 || data.weight > 300) {
      newErrors.weight = 'Вес должен быть от 20 до 300 кг';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const calculateCalories = useCallback((data: UserData) => {
    let bmr: number;
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }

    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const goalAdjustments = {
      lose: 0.8,
      maintain: 1,
      gain: 1.2,
    };

    const maintenanceCalories = bmr * activityFactors[data.activity];
    const adjustedCalories = maintenanceCalories * goalAdjustments[data.goal];

    return {
      maintenance: Math.round(maintenanceCalories),
      adjusted: Math.round(adjustedCalories),
    };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev: UserData) => {
      const updatedData = { ...prev, [name]: value === '' ? '' : Number(value) || value };
      validateInputs(updatedData);
      return updatedData;
    });
  }, [validateInputs]);

  const handleGoalChange = (goal: string) => {
    setUserData((prev: UserData) => {
      const updatedData = { ...prev, goal };
      validateInputs(updatedData);
      return updatedData;
    });
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'veryActive'];
    setUserData((prev: UserData) => {
      const updatedData = { ...prev, activity: activityLevels[value] };
      validateInputs(updatedData);
      return updatedData;
    });
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateInputs(userData)) {
        return;
      }

      const newResult = calculateCalories(userData);
      setResult(newResult);
      setUserData((prev: UserData) => ({
        ...prev,
        calculated: true,
      }));
      setIsEditing(false);
      onUpdateGoal(newResult.adjusted);

      localStorage.setItem('profileData', JSON.stringify({ ...userData, calculated: true }));
      localStorage.setItem('profileResult', JSON.stringify(newResult));
    },
    [userData, calculateCalories, onUpdateGoal, validateInputs]
  );

  const handleReset = useCallback(() => {
    setUserData({
      gender: 'female',
      age: 25,
      height: 170,
      weight: 60,
      activity: 'light',
      goal: 'maintain',
      calculated: false,
    });
    setResult(null);
    setErrors({});
    setIsEditing(true);
    localStorage.removeItem('profileData');
    localStorage.removeItem('profileResult');
  }, []);

  useEffect(() => {
    if (userData.calculated && !result) {
      const newResult = calculateCalories(userData);
      setResult(newResult);
      onUpdateGoal(newResult.adjusted);
    }
  }, [userData, result, calculateCalories, onUpdateGoal]);

  // Расчет ИМТ
  const bmi = userData.weight / ((userData.height / 100) * (userData.height / 100));
  const bmiCategory = bmi < 18.5 ? 'Дефицит' : bmi < 25 ? 'Норма' : 'Избыток';

  // Распределение макронутриентов
  const maintenanceCalories = result?.maintenance || calculateCalories(userData).maintenance;
  const protein = Math.round((maintenanceCalories * 0.3) / 4);
  const fat = Math.round((maintenanceCalories * 0.2) / 9);
  const carbs = Math.round((maintenanceCalories * 0.5) / 4);

  // Для отображения уровня активности на ползунке
  const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'veryActive'];
  const activityIndex = activityLevels.indexOf(userData.activity);

  return (
    <div className="profile-page">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <h2 className="main-title">Рассчет каллориев</h2>
          <div className="form-section">
            <h3 className="section-title">Общая информация</h3>
            <div className="gender-selection">
              <label className={`gender-option ${userData.gender === 'female' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userData.gender === 'female'}
                  onChange={handleInputChange}
                />
                Женщина
              </label>
              <label className={`gender-option ${userData.gender === 'male' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userData.gender === 'male'}
                  onChange={handleInputChange}
                />
                Мужчина
              </label>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Возраст, лет</label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleInputChange}
                  min="10"
                  max="120"
                  required
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
              <div className="info-item">
                <label>Рост, см</label>
                <input
                  type="number"
                  name="height"
                  value={userData.height}
                  onChange={handleInputChange}
                  min="100"
                  max="250"
                  required
                />
                {errors.height && <span className="error-message">{errors.height}</span>}
              </div>
              <div className="info-item">
                <label>Вес, кг</label>
                <input
                  type="number"
                  name="weight"
                  value={userData.weight}
                  onChange={handleInputChange}
                  min="20"
                  max="300"
                  required
                />
                {errors.weight && <span className="error-message">{errors.weight}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Дневная активность</h3>
            <div className="activity-description">
              {userData.activity === 'veryActive' && 
                "Очень высокая. Регулярно занимаюсь спортом (бег, гимнастика, тренажерный зал), минимум 5 раз в неделю"}
              {userData.activity === 'active' && 
                "Высокая. Занимаюсь спортом 3-4 раза в неделю"}
              {userData.activity === 'moderate' && 
                "Умеренная. Легкие тренировки 1-3 раза в неделю"}
              {userData.activity === 'light' && 
                "Низкая. Небольшая активность в течение дня"}
              {userData.activity === 'sedentary' && 
                "Сидячий образ жизни. Минимальная активность"}
            </div>
            <div className="activity-slider-container">
              <input
                type="range"
                name="activity"
                min="0"
                max="4"
                value={activityIndex}
                onChange={handleActivityChange}
                className="activity-slider"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Ваша цель</h3>
            <div className="goal-options">
              <button
                type="button"
                className={`goal-option ${userData.goal === 'lose' ? 'active' : ''}`}
                onClick={() => handleGoalChange('lose')}
              >
                Сбросить вес
              </button>
              <button
                type="button"
                className={`goal-option ${userData.goal === 'maintain' ? 'active' : ''}`}
                onClick={() => handleGoalChange('maintain')}
              >
                Поддерживать вес
              </button>
              <button
                type="button"
                className={`goal-option ${userData.goal === 'gain' ? 'active' : ''}`}
                onClick={() => handleGoalChange('gain')}
              >
                Набрать вес
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Формула расчета</h3>
            <div className="formula-options">
              <label className="formula-option">
                <input type="radio" name="formula" checked readOnly />
                Харриса-Бенедикта
              </label>
              <label className="formula-option">
                <input type="radio" name="formula" readOnly />
                Миффинна-Сан Жеора
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="calculate-button" disabled={Object.keys(errors).length > 0}>
              Рассчитать
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-result">
          <h2 className="main-title">Результаты расчета</h2>
          <div className="result-card bmi-card">
            <h4 className="card-title">Индекс массы тела (ИМТ)</h4>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${(bmi / 40) * 100}%`, background: getBmiColor(bmi) }}
                ></div>
              </div>
              <p className="bmi-value">
                {bmi.toFixed(1)} <span className="bmi-category">{bmiCategory}</span>
              </p>
            </div>
          </div>

          <div className="result-card calorie-card">
            <h4 className="card-title">Суточная норма калорий</h4>
            <div className="calorie-section">
              <div className="calorie-circle">
                <span className="calorie-value">{result?.adjusted || 0}</span>
                <span className="calorie-unit">ккал/день</span>
              </div>
              <div className="nutrients">
                <p>
                  Из них: <span className="nutrient-value">{protein} г</span> Белки,{' '}
                  <span className="nutrient-value">{fat} г</span> Жиры,{' '}
                  <span className="nutrient-value">{carbs} г</span> Углеводы
                </p>
              </div>
            </div>
            <p className="note">
              Данные результаты являются рекомендательными, для более точных результатов обратитесь к специалисту.
            </p>
          </div>

          <div className="form-actions">
            <button className="action-button edit-button" onClick={() => setIsEditing(true)}>
              Редактировать
            </button>
            <button className="action-button reset-button" onClick={handleReset}>
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getBmiColor = (bmi: number) => {
  if (bmi < 18.5) return '#42A5F5';
  if (bmi < 25) return '#66BB6A';
  return '#EF5350';
};

export default Profile;