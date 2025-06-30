// src/data/products.ts
export interface Product {
  sku: string;
  name: string;
  price: string;
  image: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { sku: "SKU123", name: "Mechanical Keyboard", price: "$99", image: "/keyboard.jpg" },
  { sku: "SKU456", name: "Gaming Mouse", price: "$49", image: "/mouse.png" },
  { sku: "SKU789", name: "Monitor", price: "$199", image: "/monitor.jpg" },
];