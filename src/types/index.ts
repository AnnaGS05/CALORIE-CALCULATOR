export interface Product {
  id: number;
  name: string;
  calories: number;
  portion: number;
  image?: string;
}

export interface Meal {
  id: number;
  name: string;
  calories: number;
  foods: string[];
}

export interface Day {
  date: string;
  meals: Meal[];
  total: number;
  goal: number;
}

export interface UserData {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal: 'lose' | 'maintain' | 'gain';
  calculated: boolean;
  name?: string;
}

export interface ProfileResult {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  bmi: number | string;
  timestamp: string;
}

export interface FormData {
  gender: string;
  weight: string;
  height: string;
  age: string;
  activity: string;
}

export interface NewProduct {
  name: string;
  calories: string;
  portion: number;
  image: string;
}