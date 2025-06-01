// src/pages/Calculator.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Product, Meal } from '../types';
import { fetchProductCalories } from '../api/productsApi';
import '../styles/Calculator.css';

interface CalculatorProps {
  products: Product[];
  onSaveMeal: (meal: Meal) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ products, onSaveMeal }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [mealName, setMealName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term) {
      const fetchedProduct = await fetchProductCalories(term);
      if (fetchedProduct && !selectedProducts.some((p) => p.name === fetchedProduct.name)) {
        setSelectedProducts((prev) => [...prev, fetchedProduct]);
      }
    }
  }, [selectedProducts]);

  const handleAddProduct = useCallback((product: Product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts((prev) => [...prev, product]);
    }
  }, [selectedProducts]);

  const handleRemoveProduct = useCallback((id: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const calculateTotalCalories = useMemo(() => {
    return selectedProducts.reduce((sum, product) => sum + product.calories, 0);
  }, [selectedProducts]);

  const handleSaveMeal = useCallback(() => {
    if (!mealName.trim()) {
      alert('Введите название приема пищи!');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Добавьте хотя бы один продукт!');
      return;
    }

    onSaveMeal({
      id: Date.now(),
      name: mealName,
      calories: calculateTotalCalories,
      foods: selectedProducts.map((p) => p.name),
    });

    setSelectedProducts([]);
    setMealName('');
    setSearchTerm('');
  }, [mealName, selectedProducts, calculateTotalCalories, onSaveMeal]);

  return (
    <div className="calculator-page">
      <h2 className="page-title">Калькулятор калорий</h2>
      <div className="calculator-container">
        <div className="product-selection">
          <h3 className="section-title">Выберите продукты</h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск продуктов..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleAddProduct(product)}
              >
                {product.image && (
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                )}
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-calories">{product.calories} ккал/100г</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="selected-products">
          <h3 className="section-title">Выбранные продукты</h3>
          <input
            type="text"
            placeholder="Название приема пищи (завтрак, обед...)"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="meal-name-input"
          />
          
          {selectedProducts.length === 0 ? (
            <p className="empty-message">Нет выбранных продуктов</p>
          ) : (
            <ul className="selected-list">
              {selectedProducts.map((product) => (
                <li key={product.id} className="selected-item">
                  <div className="item-info">
                    <span className="item-name">{product.name}</span>
                    <span className="item-calories">{product.calories} ккал</span>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          <div className="total-calories">
            <span className="total-label">Итого:</span>
            <span className="total-value">{calculateTotalCalories} ккал</span>
          </div>
          
          <button 
            onClick={handleSaveMeal} 
            className="save-button"
          >
            Сохранить прием пищи
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;