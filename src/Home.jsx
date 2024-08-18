import React, { useState, useEffect, useCallback } from 'react';

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Initialize page number
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://groww-intern-assignment.vercel.app/v1/api/order-details?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setHasMore(data.products.length > 0); // Check if more products are available
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main
      style={{
        background: '#f9fafe',
        minHeight: 'calc(100vh - 73px)',
      }}
      className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh - 73px)]"
    >
      <h1 className="text-4xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-md shadow-md bg-white"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-lg font-medium text-gray-600">
              ₹{product.price.toFixed(2)}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more products to load</div>}
    </main>
  );
};

export default Home;
