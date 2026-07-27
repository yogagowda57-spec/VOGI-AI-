export interface ChatMessage {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: 'dress' | 'shirt' | 'pant' | 'shoes' | 'jacket' | 'accessories';
  image: string;
  color: string;
  price: string;
  rating: number;
  isFavorite?: boolean;
  link?: string;
  occasion?: string[];
}

export interface UserSilhouette {
  id: string;
  label: 'Front' | 'Left' | 'Right' | 'Back';
  image: string;
}

export interface TryOnResult {
  id: string;
  url: string;
  confidence: number;
  remarks: string;
  fitSize: string;
  bodyMeasurements?: {
    chest: number;
    waist: number;
    hips: number;
    height: number;
  };
  color: string;
  background: string;
  timestamp: string;
}

export interface BackgroundPreset {
  id: string;
  label: string;
  value: string;
  color: string;
}
