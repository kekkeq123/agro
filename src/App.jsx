import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояние для корзины (поднято на уровень App)
  const [cartCount, setCartCount] = useState(0);

  // Бонусные состояния для загрузки и ошибок
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/products');
        
        if (!response.ok) {
          throw new Error('Ошибка сервера');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Функция для увеличения счетчика корзины
  function handleAddToCart(product) {
    setCartCount(cartCount + 1);
  }

  // Фильтрация товаров по поиску
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="catalog-app">
      {/* Шапка с выводом счетчика корзины */}
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#2e7d32', color: 'white' }}>
        <h1>🌾 АгроМаркет</h1>
        <div className="cart-info">
          Корзина: {cartCount}
        </div>
      </header>

      <main className="catalog" style={{ padding: '2rem' }}>
        <h2>Каталог</h2>

        {/* Управляемый инпут поиска */}
        <input
          type="text"
          placeholder="Поиск товара..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Условный рендеринг: Загрузка, Ошибка или Список */}
        {loading && <p>Загрузка...</p>}
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={handleAddToCart} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;