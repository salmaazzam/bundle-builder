export interface Variant {
  id: string;
  name: string;
  color: string;
}

export type StepId = 1 | 2 | 3 | 4;
export type StepIcon = 'camera' | 'shield' | 'sensor' | 'grid';

export interface Product {
  id: string;
  stepId: StepId;
  name: string;
  description: string;
  image: string;
  badge?: string;
  learnMoreUrl?: string;
  price: number;
  comparePrice?: number;
  priceSuffix?: string;
  variants?: Variant[];
  singleSelect?: boolean;
  defaultQty?: number;
  defaultVariantId?: string;
  defaultSelected?: boolean;
  features?: string[];
}

export interface Step {
  id: StepId;
  title: string;
  icon: StepIcon;
  nextLabel?: string;
  products: Product[];
}

export interface ProductsData {
  steps: Step[];
}

export interface ReviewLineItem {
  productId: string;
  variantId: string;
  name: string;
  variantName?: string;
  image: string;
  price: number;
  comparePrice?: number;
  priceSuffix?: string;
  qty: number;
  singleSelect?: boolean;
  stepId: StepId;
}
