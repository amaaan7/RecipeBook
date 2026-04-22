import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function SaveButton({ recipe }) {
    const { isAuthenticated } = useAuth();
    const [saved, setSaved] = useState(recipe.is_saved);

    const handleSave = async () => {
        if (!isAuthenticated) { toast.error('Log in to save recipes'); return; }
        setSaved(!saved);
        try {
            await api.post(`/api/interactions/recipes/${recipe.id}/save/`);
            toast.success(saved ? 'Removed from saved' : 'Saved!');
        } catch {
            setSaved(!saved);
        }
    };

    return (
        <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
        >
            <Bookmark size={18} className={saved ? 'fill-brand-500 text-brand-500' : ''} />
        </button>
    );
}
