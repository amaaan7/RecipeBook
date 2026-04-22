import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function LikeButton({ recipe }) {
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(recipe.is_liked);
    const [likes, setLikes] = useState(recipe.like_count);

    const handleLike = async () => {
        if (!isAuthenticated) { toast.error('Log in to like recipes'); return; }
        const prev = liked;
        setLiked(!liked);
        setLikes(l => liked ? l - 1 : l + 1);
        try {
            await api.post(`/api/interactions/recipes/${recipe.id}/like/`);
        } catch {
            setLiked(prev);
            setLikes(l => liked ? l + 1 : l - 1);
        }
    };

    return (
        <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
        >
            <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : ''} />
            <span className="text-sm font-medium">{likes}</span>
        </button>
    );
}
