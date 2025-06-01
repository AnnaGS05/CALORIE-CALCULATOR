import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Diary from './pages/Diary';
import Calculator from './pages/Calculator';
import Products from './pages/Products';
import Profile from './pages/Profile';
import { Product, Day, Meal } from './types';
import './styles/App.css';

const INITIAL_DAYS: Day[] = [
  {
    date: new Date().toISOString().split('T')[0],
    meals: [],
    total: 0,
    goal: 2000,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Яблоко', calories: 52, portion: 100, image: '/images/apple.jpg' },
  { id: 2, name: 'Куриная грудка', calories: 165, portion: 100, image: '/images/chicken.jpg' },
  { id: 3, name: 'Рис вареный', calories: 130, portion: 100, image: '/images/rice.jpg' },
  { id: 4, name: 'Банан', calories: 89, portion: 100, image: '/images/banana.jpg' },
  { id: 5, name: 'Апельсин', calories: 47, portion: 100, image: '/images/orange.jpg' },
  { id: 6, name: 'Яйцо вареное', calories: 155, portion: 100, image: '/images/egg.jpg' },
  { id: 7, name: 'Гречка вареная', calories: 132, portion: 100, image: '/images/buckwheat.jpg' },
  { id: 8, name: 'Творог 5%', calories: 121, portion: 100, image: '/images/cottage-cheese.jpg' },
  { id: 9, name: 'Говядина вареная', calories: 250, portion: 100, image: '/images/beef.jpg' },
  { id: 10, name: 'Картофель вареный', calories: 82, portion: 100, image: '/images/potato.jpg' },
];

const App: React.FC = () => {
  const [days, setDays] = useState<Day[]>(() => {
    const saved = localStorage.getItem('diaryData');
    return saved ? JSON.parse(saved) : INITIAL_DAYS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('productsData');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('diaryData', JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem('productsData', JSON.stringify(products));
  }, [products]);

  const addNewProduct = (newProduct: Product) => {
    if (newProduct.name === '' && newProduct.calories === 0) {
      // Удаление продукта
      setProducts((prev) => prev.filter((p) => p.id !== newProduct.id));
    } else {
      // Добавление или обновление продукта
      setProducts((prev) => [...prev, {
        ...newProduct,
        id: Date.now(),
        portion: newProduct.portion || 100,
      }]);
    }
  };

  const addMealToDay = (date: string, newMeal: Meal) => {
    setDays((prevDays) => {
      const dayIndex = prevDays.findIndex((d) => d.date === date);

      if (dayIndex >= 0) {
        return prevDays.map((day, index) =>
          index === dayIndex
            ? {
                ...day,
                meals: [...day.meals, newMeal],
                total: day.total + newMeal.calories,
              }
            : day
        );
      }

      return [
        ...prevDays,
        {
          date,
          meals: [newMeal],
          total: newMeal.calories,
          goal: prevDays[0]?.goal || 2000,
        },
      ];
    });
  };

  const updateCalorieGoal = (newGoal: number) => {
    setDays((prevDays) =>
      prevDays.map((day) => ({
        ...day,
        goal: newGoal,
      }))
    );
  };

  const deleteMeal = (date: string, mealId: number) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date === date) {
          const updatedMeals = day.meals.filter((meal) => meal.id !== mealId);
          const newTotal = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
          return { ...day, meals: updatedMeals, total: newTotal };
        }
        return day;
      })
    );
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/diary"
            element={<Diary days={days} onDeleteMeal={deleteMeal} />}
          />
          <Route
            path="/calculator"
            element={<CalculatorWithRedirect products={products} onSaveMeal={addMealToDay} />}
          />
          <Route
            path="/products"
            element={<Products products={products} onAddProduct={addNewProduct} />}
          />
          <Route
            path="/profile"
            element={<Profile onUpdateGoal={updateCalorieGoal} />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

interface CalculatorWithRedirectProps {
  products: Product[];
  onSaveMeal: (date: string, meal: Meal) => void;
}

const CalculatorWithRedirect: React.FC<CalculatorWithRedirectProps> = ({ products, onSaveMeal }) => {
  const [searchParams] = useSearchParams();

  const handleSave = (meal: Meal) => {
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    onSaveMeal(date, meal);
    window.location.href = '/diary';
  };

  return <Calculator products={products} onSaveMeal={handleSave} />;
};

export default App;