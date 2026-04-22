import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Bookmark, ChefHat } from 'lucide-react';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';

const TABS = [
    { key: 'my', label: 'My Recipes', icon: ChefHat },
    { key: 'saved', label: 'Saved', icon: Bookmark },
];

export default function DashboardPage() {
    const [tab, setTab] = useState('my');

    const { data: myRecipes } = useQuery({
        queryKey: ['my-recipes'],
        queryFn: () => api.get('/api/recipes/my-recipes/').then(r => r.data),
        enabled: tab === 'my'
    });

    const { data: savedRecipes } = useQuery({
        queryKey: ['saved-recipes'],
        queryFn: () => api.get('/api/interactions/saved/').then(r => r.data),
        enabled: tab === 'saved'
    });

    const recipes = tab === 'my' ? myRecipes : savedRecipes;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors -mb-px
              ${tab === key ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <Icon size={16} /> {label}
                    </button>
                ))}
            </div>

            {!recipes || recipes.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">
                        {tab === 'my' ? 'You haven\'t posted any recipes yet.' : 'No saved recipes yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(Array.isArray(recipes) ? recipes : recipes?.results)?.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}