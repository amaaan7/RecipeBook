import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CommentSection({ recipeId }) {
    const [text, setText] = useState('');
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: comments } = useQuery({
        queryKey: ['comments', recipeId],
        queryFn: () => api.get(`/api/interactions/recipes/${recipeId}/comments/`).then(r => r.data)
    });

    const postMutation = useMutation({
        mutationFn: () => api.post(`/api/interactions/recipes/${recipeId}/comments/`, { text }),
        onSuccess: () => {
            setText('');
            queryClient.invalidateQueries(['comments', recipeId]);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/interactions/comments/${id}/`),
        onSuccess: () => queryClient.invalidateQueries(['comments', recipeId])
    });

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Comments ({comments?.length || 0})</h2>

            {isAuthenticated && (
                <div className="flex gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700 flex-shrink-0">
                        {user.name[0]}
                    </div>
                    <div className="flex-1">
                        <textarea rows={2} value={text} onChange={e => setText(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                        <button onClick={() => { if (text.trim()) postMutation.mutate(); }}
                            disabled={!text.trim() || postMutation.isPending}
                            className="mt-2 px-4 py-1.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                            {postMutation.isPending ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {comments?.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                            {comment.user.name[0]}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <span className="text-gray-400 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                                {user?.id === comment.user.id && (
                                    <button onClick={() => deleteMutation.mutate(comment.id)} className="ml-auto text-gray-300 hover:text-red-400">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm mt-0.5">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}