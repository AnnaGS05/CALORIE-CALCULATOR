export interface Product {
  id: number;
  name: string;
  calories: number;
  portion: number;
  image: string;
}

export const fetchProductCalories = async (productName: string): Promise<Product | null> => {
  try {
    const response = await fetch(`https://api.example.com/products?name=${encodeURIComponent(productName)}`);
    if (!response.ok) throw new Error('Ошибка при загрузке данных');
    const data = await response.json();
    return {
      id: Date.now(),
      name: productName,
      calories: data.calories || 0,
      portion: data.portion || 100,
      image: data.image || '/images/default.jpg',
    };
  } catch (error) {
    console.error('Ошибка API:', error);
    return null;
  }
};