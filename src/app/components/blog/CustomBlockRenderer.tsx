import React from 'react';
import { CustomBlock } from '@/lib/types';
import { MOCK_PRODUCTS, Product } from '@/data/products';
import Image from 'next/image';

interface CustomBlockRendererProps {
  block: CustomBlock;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="border p-4 rounded-lg shadow-md flex flex-col items-center text-center">
    <Image src={product.image} alt={product.name} width={100} height={100} className="mb-2" />
    <h4 className="font-semibold text-lg">{product.name}</h4>
    <p className="text-gray-600">{product.price}</p>
    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buy Now</button>
  </div>
);

const CustomBlockRenderer: React.FC<CustomBlockRendererProps> = ({ block }) => {
  switch (block.name) {
    case 'Top Picks':
    case 'Product List':
      const productsToDisplay = block.products
        ? MOCK_PRODUCTS.filter(p => block.products?.includes(p.sku))
        : [];
      return (
        <div className="my-8 p-6 bg-background rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold mb-4 text-center">{block.name}</h3>
          {block.image && (
            <div className="mb-4 text-center">
              <Image src={block.image} alt={block.name} width={400} height={200} className="mx-auto rounded-md" />
            </div>
          )}
          {productsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToDisplay.map(product => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products available for this block.</p>
          )}
        </div>
      );
    case 'Image Showcase':
      return (
        <div className="my-8 p-4 bg-background rounded-lg text-center">
          {block.image && (
            <Image src={block.image} alt="Image Showcase" width={800} height={400} className="mx-auto rounded-md" />
          )}
        </div>
      );
    // Add more cases for different block names
    default:
      return (
        <div className="my-4 p-4 border border-red-300 bg-red-50 rounded text-red-700">
          Unknown block: {block.name}
        </div>
      );
  }
};

export default CustomBlockRenderer;