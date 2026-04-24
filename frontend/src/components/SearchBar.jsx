import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, categories }) {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ search: query, category, difficulty });
    };

    const handleClear = () => {
        setQuery(''); setCategory(''); setDifficulty('');
        onSearch({});
    };

    return (
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Text search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search recipes, ingredients..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>

                {/* Category filter */}
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                    <option value="">All categories</option>
                    {categories?.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                </select>

                {/* Difficulty filter */}
                <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                    <option value="">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <button type="submit" className="px-6 py-2.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 font-medium">
                    Search
                </button>
                {(query || category || difficulty) && (
                    <button type="button" onClick={handleClear} className="px-3 py-2.5 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                )}
            </div>
        </form>
    );
}