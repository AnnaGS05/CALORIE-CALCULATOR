// src/pages/Products.tsx
import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import { fetchProductCalories } from '../api/productsApi';
import '../styles/Products.css';

interface ProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ products, onAddProduct }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    calories: '',
    portion: 100,
    image: '',
  });

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    if (name === 'name' && value) {
      const fetchedProduct = await fetchProductCalories(value);
      if (fetchedProduct) {
        setNewProduct((prev) => ({
          ...prev,
          calories: fetchedProduct.calories.toString(),
          image: fetchedProduct.image,
        }));
      }
    }
  }, []);

  const handleAddProduct = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProduct.name.trim() || !newProduct.calories) {
        alert('Заполните название и калорийность!');
        return;
      }

      onAddProduct({
        ...newProduct,
        id: Date.now(),
        calories: Number(newProduct.calories),
        portion: Number(newProduct.portion) || 100,
      } as Product);

      setNewProduct({
        name: '',
        calories: '',
        portion: 100,
        image: '',
      });
      setIsAdding(false);
    },
    [newProduct, onAddProduct]
  );

  const handleDeleteProduct = useCallback((id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
      onAddProduct({ id, name: '', calories: 0, portion: 100, image: '' } as Product);
    }
  }, [onAddProduct]);

  return (
    <div className="products-page">
      <div className="page-header">
        <h2 className="page-title">База продуктов</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="add-button"
        >
          {isAdding ? 'Отмена' : '+ Добавить продукт'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProduct} className="product-form">
          <h3 className="form-title">Добавить новый продукт</h3>
          <div className="form-group">
            <label htmlFor="product-name">Название продукта:</label>
            <input
              id="product-name"
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Например: Банан"
              required
              className="form-input"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-calories">Калории (на 100г):</label>
              <input
                id="product-calories"
                type="number"
                name="calories"
                value={newProduct.calories}
                onChange={handleInputChange}
                placeholder="Например: 89"
                min="0"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-portion">Порция (г):</label>
              <input
                id="product-portion"
                type="number"
                name="portion"
                value={newProduct.portion}
                onChange={handleInputChange}
                placeholder="Например: 100"
                min="1"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="product-image">Изображение (URL):</label>
            <input
              id="product-image"
              type="text"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="cancel-button"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img src={product.image} alt={product.name} className="product-image" />
            )}
            <div className="product-content">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-calories">{product.calories} ккал/100г</p>
            </div>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="delete-button"
              title="Удалить продукт"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;