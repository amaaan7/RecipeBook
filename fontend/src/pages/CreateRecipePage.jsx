import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import api from '../api/axios';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

export default function CreateRecipePage() {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [form, setForm] = useState({
        title: '', description: '', category_id: '', difficulty: 'medium',
        prep_time: '', cook_time: '', servings: 4,
    });
    const [ingredients, setIngredients] = useState([
        { amount: '', name: '' }  // start with one empty row
    ]);
    const [steps, setSteps] = useState([
        { step_number: 1, instruction: '' }
    ]);

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api.get('/api/categories/').then(r => r.data)
    });

    const mutation = useMutation({
        mutationFn: (data) => api.post('/api/recipes/', data),
        onSuccess: (res) => {
            toast.success('Recipe published!');
            navigate(`/recipes/${res.data.id}`);
        },
        onError: () => toast.error('Something went wrong')
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!imageUrl) { toast.error('Please upload an image'); return; }
        const filledIngredients = ingredients.filter(i => i.amount && i.name);
        const filledSteps = steps.filter(s => s.instruction);
        if (filledIngredients.length === 0) { toast.error('Add at least one ingredient'); return; }
        if (filledSteps.length === 0) { toast.error('Add at least one step'); return; }
        mutation.mutate({
            ...form,
            image: imageUrl,
            ingredients: filledIngredients,
            steps: filledSteps,
        });
    };

    // Ingredient helpers
    const addIngredient = () => setIngredients([...ingredients, { amount: '', name: '' }]);
    const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));
    const updateIngredient = (i, field, val) => {
        setIngredients(ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));
    };

    // Step helpers
    const addStep = () => setSteps([...steps, { step_number: steps.length + 1, instruction: '' }]);
    const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step_number: idx + 1 })));
    const updateStep = (i, val) => setSteps(steps.map((s, idx) => idx === i ? { ...s, instruction: val } : s));

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Share a Recipe</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image upload */}
                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Recipe Photo</h2>
                    <ImageUpload onUpload={setImageUrl} currentUrl={imageUrl} />
                </section>

                {/* Basic info */}
                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold">Basic Info</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Title *</label>
                        <input
                            required value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. Creamy Tuscan Pasta"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            required rows={3} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Describe your recipe..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                                <option value="">None</option>
                                {(Array.isArray(categories) ? categories : categories?.results)?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prep (min) *</label>
                            <input type="number" required min={0} value={form.prep_time}
                                onChange={e => setForm({ ...form, prep_time: e.target.value })}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cook (min) *</label>
                            <input type="number" required min={0} value={form.cook_time}
                                onChange={e => setForm({ ...form, cook_time: e.target.value })}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        </div>
                    </div>
                </section>

                {/* Ingredients */}
                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
                    <div className="space-y-3">
                        {ingredients.map((ing, i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <input placeholder="Amount (e.g. 2 cups)" value={ing.amount}
                                    onChange={e => updateIngredient(i, 'amount', e.target.value)}
                                    className="w-36 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                                <input placeholder="Ingredient name" value={ing.name}
                                    onChange={e => updateIngredient(i, 'name', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                                <button type="button" onClick={() => removeIngredient(i)}
                                    className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addIngredient}
                        className="mt-3 flex items-center gap-2 text-brand-500 hover:text-brand-600 font-medium text-sm">
                        <Plus size={16} /> Add ingredient
                    </button>
                </section>

                {/* Steps */}
                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Instructions</h2>
                    <div className="space-y-4">
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <span className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                                    {i + 1}
                                </span>
                                <textarea rows={2} placeholder={`Step ${i + 1}...`} value={step.instruction}
                                    onChange={e => updateStep(i, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none" />
                                <button type="button" onClick={() => removeStep(i)}
                                    className="p-2 text-gray-300 hover:text-red-400 transition-colors mt-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addStep}
                        className="mt-3 flex items-center gap-2 text-brand-500 hover:text-brand-600 font-medium text-sm">
                        <Plus size={16} /> Add step
                    </button>
                </section>

                {/* Submit */}
                <button type="submit" disabled={mutation.isPending}
                    className="w-full py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 font-semibold text-lg disabled:opacity-60 transition-colors">
                    {mutation.isPending ? 'Publishing...' : 'Publish Recipe'}
                </button>
            </form>
        </div>
    );
}