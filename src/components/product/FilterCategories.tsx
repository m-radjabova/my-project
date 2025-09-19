import React from 'react'
import useCategories from '../../hooks/useCategories';
import type { Category } from '../../types/types';

type Props = {
    currentFilter: string,
    setCurrentFilter: React.Dispatch<React.SetStateAction<string>>
}

function FilterCategories({ currentFilter, setCurrentFilter }: Props) {
  const { categoryQuery } = useCategories();

  if (categoryQuery.isLoading) {
      return (
        <div className="filter-categories-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading categories...</p>
        </div>
      );
  }

  if (categoryQuery.isError) {
      return (
        <div className="filter-categories-error">
          <div className="error-icon">⚠️</div>
          <p>Error loading categories</p>
          <button onClick={() => categoryQuery.refetch()} className="retry-btn">
            Try Again
          </button>
        </div>
      );
  }

  const categories = categoryQuery.data as Category[];

  return (
    <div className="filter-categories">
      <div className="categories-list">
        {categories.map((category: Category) => (
          <div
            key={category.id}
            className={`category-item ${category.id === currentFilter ? "active" : ""}`}
            onClick={() => setCurrentFilter(category.id)}
          >
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterCategories;