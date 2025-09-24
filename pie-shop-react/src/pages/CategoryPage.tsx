/**
 * CategoryPage Component - React version of category pages
 * Displays pies for a specific category with search functionality
 */

import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { usePies } from '../hooks/usePies';
import PieCard from   '../components/PieCard/PieCard';
import SearchBar from   '../components/SearchBar/SearchBar';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { pies, loading, error } = usePies(category as 'fruit' | 'cheesecake' | 'seasonal');

  const filteredPies = useMemo(() => {
    if (!searchQuery.trim()) return pies;
    
    const query = searchQuery.toLowerCase();
    return pies.filter((pie: any) => 
      pie.name.toLowerCase().includes(query) ||
      pie.description.toLowerCase().includes(query)
    );
  }, [pies, searchQuery]);

  const handleAddToCart = (pie: any) => {
    addToCart(pie);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const getCategoryTitle = (category: string | undefined) => {
    switch (category) {
      case 'fruit': return 'Fruit Pies';
      case 'cheesecake': return 'Cheesecakes';
      case 'seasonal': return 'Seasonal Pies';
      default: return 'All Pies';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading pies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Failed to load pies</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="container">
      <section className="page-header">
        <h1>{getCategoryTitle(category)}</h1>
        <p>Discover our delicious {getCategoryTitle(category).toLowerCase()}</p>
      </section>

      <section className="search-section">
        <SearchBar 
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={`Search ${getCategoryTitle(category).toLowerCase()}...`}
        />
      </section>

      <section className="pies-section">
        <div className="pies-grid">
          {filteredPies.length === 0 ? (
            <div className="no-results">
              <h3>No pies found</h3>
              <p>
                {searchQuery 
                  ? `No pies match "${searchQuery}". Try a different search term.`
                  : 'No pies available in this category.'
                }
              </p>
            </div>
          ) : (
            filteredPies.map((pie: any) => (
              <PieCard 
                key={pie.id} 
                pie={pie} 
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
