import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChefHat } from 'lucide-react';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';

export default function ProfilePage() {
    const { id } = useParams();

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['profile', id],
        queryFn: () => api.get(`/api/users/${id}/`).then(r => r.data)
    });

    const { data: recipes, isLoading: recipesLoading } = useQuery({
        queryKey: ['user-recipes', id],
        queryFn: () => api.get(`/api/recipes/?author=${id}`).then(r => r.data)
    });

    const recipeList = Array.isArray(recipes) ? recipes : recipes?.results ?? [];

    if (profileLoading) return <div className="flex justify-center py-20 text-gray-400">Loading profile...</div>;
    if (!profile) return <div className="text-center py-20 text-gray-500">User not found.</div>;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Profile header */}
            <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-600">
                    {profile.name?.[0] ?? profile.username?.[0] ?? '?'}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name ?? profile.username}</h1>
                    {profile.bio && <p className="text-gray-500 mt-1">{profile.bio}</p>}
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                        <ChefHat size={14} /> {recipeList.length} recipe{recipeList.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Recipes grid */}
            {recipesLoading ? (
                <div className="text-center py-12 text-gray-400">Loading recipes...</div>
            ) : recipeList.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">No recipes published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recipeList.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}
