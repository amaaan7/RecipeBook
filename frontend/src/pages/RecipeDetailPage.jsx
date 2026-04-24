import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Users, ChefHat, Edit2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: recipe, isLoading } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => api.get(`/api/recipes/${id}/`).then(r => r.data)
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/api/recipes/${id}/`),
        onSuccess: () => {
            toast.success('Recipe deleted');
            queryClient.invalidateQueries(['recipes']);
            navigate('/');
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
    if (!recipe) return <div className="text-center py-20">Recipe not found</div>;

    const isAuthor = user?.id === recipe.author.id;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header image */}
            <div className="rounded-2xl overflow-hidden aspect-[16/7] mb-8">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
            </div>

            {/* Title + actions */}
            <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{recipe.title}</h1>
                <div className="flex items-center gap-2 ml-4">
                    <LikeButton recipe={recipe} />
                    <SaveButton recipe={recipe} />
                    {isAuthor && (
                        <>
                            <Link to={`/edit/${id}`} className="p-2 text-gray-500 hover:text-brand-500 rounded-lg hover:bg-gray-100">
                                <Edit2 size={20} />
                            </Link>
                            <button
                                onClick={() => { if (confirm('Delete this recipe?')) deleteMutation.mutate(); }}
                                className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100"
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Author + meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                <Link to={`/profile/${recipe.author.id}`} className="flex items-center gap-2 hover:text-brand-500">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                        {recipe.author.name[0]}
                    </div>
                    {recipe.author.name}
                </Link>
                <span className="flex items-center gap-1"><Clock size={16} /> {recipe.total_time} min total</span>
                <span className="flex items-center gap-1"><Users size={16} /> {recipe.servings} servings</span>
                <span className="flex items-center gap-1"><ChefHat size={16} /> {recipe.difficulty}</span>
                {recipe.category && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: recipe.category.color }}>
                        {recipe.category.name}
                    </span>
                )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">{recipe.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Ingredients */}
                <div className="bg-orange-50 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                    <ul className="space-y-2">
                        {recipe.ingredients.map(ing => (
                            <li key={ing.id} className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                                <span><strong className="text-gray-900">{ing.amount}</strong> {ing.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Time breakdown */}
                <div className="bg-gray-50 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Time</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-gray-500">Prep time</span><strong>{recipe.prep_time} min</strong></div>
                        <div className="flex justify-between"><span className="text-gray-500">Cook time</span><strong>{recipe.cook_time} min</strong></div>
                        <div className="flex justify-between border-t pt-3"><span className="font-semibold">Total</span><strong className="text-brand-500">{recipe.total_time} min</strong></div>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6">Instructions</h2>
                <ol className="space-y-6">
                    {recipe.steps.map(step => (
                        <li key={step.id} className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                                {step.step_number}
                            </span>
                            <p className="text-gray-700 leading-relaxed pt-1">{step.instruction}</p>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Comments */}
            <CommentSection recipeId={id} />
        </div>
    );
}