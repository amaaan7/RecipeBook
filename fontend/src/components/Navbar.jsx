import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-500">
                        <ChefHat size={28} />
                        RecipeBook
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create"
                                    className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors font-medium"
                                >
                                    <PlusCircle size={18} />
                                    Add Recipe
                                </Link>
                                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <Link to={`/profile/${user.id}`} className="flex items-center gap-2">
                                    {user.avatar
                                        ? <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        : <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">{user.name[0]}</div>
                                    }
                                    <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
                                <Link to="/register" className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors font-medium">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}