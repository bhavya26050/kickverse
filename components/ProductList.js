import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (products.length === 0) return <div className="text-center py-10">No products found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
      {products.map((product) => (
        <Link key={product._id} href={`/product/${product._id}`} passHref>
          <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            {product.imageUrl && (
              <div className="relative h-48">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-1">${product.price}</p>
              <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                {product.description}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
