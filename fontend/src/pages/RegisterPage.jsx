import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register({ username: form.username, email: form.email, password: form.password });
            toast.success('Account created! Welcome 🎉');
            navigate('/');
        } catch (err) {
            const msg = err?.response?.data?.detail ?? 'Registration failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                        <input
                            required value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            placeholder="chef_username"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email" required value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                            type="password" required value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <input
                            type="password" required value={form.confirmPassword}
                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 font-semibold text-base disabled:opacity-60 transition-colors mt-2"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
