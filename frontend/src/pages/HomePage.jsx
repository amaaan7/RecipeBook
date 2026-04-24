import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
    const [filters, setFilters] = useState({});

    // React Query handles loading, error, and caching automatically
    const { data: recipes, isLoading } = useQuery({
        queryKey: ['recipes', filters],
        queryFn: () => api.get('/api/recipes/', { params: filters }).then(r => r.data)
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api.get('/api/categories/').then(r => r.data)
    });

    return (
        <div>
            {/* Hero */}
            <div className="text-center py-12 mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                    Discover Amazing <span className="text-brand-500">Recipes</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Share your culinary creations and explore thousands of recipes from home cooks around the world.
                </p>
            </div>

            <SearchBar onSearch={setFilters} categories={categories?.results || categories} />

            {isLoading ? (
                <div className="flex justify-center py-20"><LoadingSpinner /></div>
            ) : (
                <>
                    <p className="text-gray-500 text-sm mb-4">
                        {recipes?.count || 0} recipes found
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes?.results?.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                    {recipes?.results?.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-lg">No recipes found. Try different filters.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}