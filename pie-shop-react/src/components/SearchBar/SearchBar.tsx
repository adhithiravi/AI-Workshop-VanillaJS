/**
 * SearchBar Component - Search functionality
 * Converts search input logic to React component
 */

import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search pies...",
  className = ""
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-container">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search pies"
        />
        {value && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
