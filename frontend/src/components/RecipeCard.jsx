import { Link } from 'react-router-dom';
import { Heart, Bookmark, Clock, ChefHat, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RecipeCard({ recipe, onUpdate }) {
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(recipe.is_liked);
    const [saved, setSaved] = useState(recipe.is_saved);
    const [likes, setLikes] = useState(recipe.like_count);

    const handleLike = async (e) => {
        e.preventDefault();  // don't navigate to detail page
        if (!isAuthenticated) { toast.error('Log in to like recipes'); return; }
        const prev = liked;
        setLiked(!liked);  // optimistic update — feels instant
        setLikes(l => liked ? l - 1 : l + 1);
        try {
            await api.post(`/api/interactions/recipes/${recipe.id}/like/`);
        } catch {
            setLiked(prev);  // revert if request fails
            setLikes(l => liked ? l + 1 : l - 1);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { toast.error('Log in to save recipes'); return; }
        setSaved(!saved);
        try {
            await api.post(`/api/interactions/recipes/${recipe.id}/save/`);
            toast.success(saved ? 'Removed from saved' : 'Saved!');
        } catch {
            setSaved(!saved);
        }
    };

    const difficultyColor = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800',
    };

    return (
        <Link to={`/recipes/${recipe.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category badge */}
                {recipe.category && (
                    <span
                        className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: recipe.category.color }}
                    >
                        {recipe.category.name}
                    </span>
                )}
                {/* Save button */}
                <button
                    onClick={handleSave}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                    <Bookmark size={16} className={saved ? 'fill-brand-500 text-brand-500' : 'text-gray-400'} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Author */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                        {recipe.author.name[0]}
                    </div>
                    <span className="text-sm text-gray-500">{recipe.author.name}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[recipe.difficulty]}`}>
                        {recipe.difficulty}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-500 transition-colors">
                    {recipe.title}
                </h3>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {recipe.total_time}m
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={14} />
                        {recipe.servings}
                    </span>
                    {/* Like button */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1 ml-auto hover:text-red-500 transition-colors"
                    >
                        <Heart size={14} className={liked ? 'fill-red-500 text-red-500' : ''} />
                        {likes}
                    </button>
                </div>
            </div>
        </Link>
    );
}