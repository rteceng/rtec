import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { products } from './data/products';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return activeCategory === 'All'
      ? products
      : products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="container" style={{ padding: '2rem 20px' }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Fresh Groceries Delivered</h1>
          <p style={styles.subtitle}>Premium quality products for your daily needs</p>
        </div>

        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.categoryBtn,
                ...(activeCategory === cat ? styles.activeCategory : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))}
        </div>
      </main>

      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </div>
  );
}

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: 'var(--color-text-light)',
    fontSize: '1.125rem',
  },
  categories: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    paddingBottom: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    padding: '0.75rem 1.5rem',
    borderRadius: '30px',
    backgroundColor: 'white',
    color: 'var(--color-text)',
    fontWeight: '600',
    border: '1px solid var(--color-border)',
    fontSize: '0.9rem',
  },
  activeCategory: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderColor: 'var(--color-primary)',
    boxShadow: 'var(--shadow-md)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  }
};

export default App;
