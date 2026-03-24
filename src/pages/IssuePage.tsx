import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Comment, Issue, User } from '../types';
import { useAuth } from '../contexts/AuthContext';

const IssuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [commentText, setCommentText] = useState('');
  const [status, setStatus] = useState<'open' | 'in_progress' | 'closed'>('open');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    if (!id) return;

    const [issueRes, commentsRes, usersRes] = await Promise.all([
      insforge.database.from('issues').select('*').eq('id', id).single(),
      insforge.database.from('comments').select('*').eq('issue_id', id).order('created_at', { ascending: true }),
      insforge.database.from('users').select('id, email, profile').order('email', { ascending: true })
    ]);

    if (issueRes.error) setError(issueRes.error.message);
    if (commentsRes.error) setError(commentsRes.error.message);
    if (usersRes.error) setError(usersRes.error.message);

    setIssue(issueRes.data || null);
    setComments(commentsRes.data || []);
    setUsers(usersRes.data || []);

    if (issueRes.data) {
      setStatus(issueRes.data.status);
      setPriority(issueRes.data.priority);
      setAssignedTo(issueRes.data.assigned_to || undefined);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const addComment = async () => {
    if (!commentText.trim() || !user || !issue) return;
    const { error } = await insforge.database.from('comments').insert([{ issue_id: issue.id, user_id: user.id, content: commentText }]);
    if (error) {
      setError(error.message);
      return;
    }
    setCommentText('');
    await loadData();
  };

  const updateIssue = async () => {
    if (!issue) return;
    const { error } = await insforge.database.from('issues').update({ status, priority, assigned_to: assignedTo }).eq('id', issue.id);
    if (error) {
      setError(error.message);
      return;
    }
    await loadData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading issue...</div>;
  if (!issue) return <div className="min-h-screen flex items-center justify-center">Issue not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{issue.title}</h1>
              <p className="text-sm text-slate-500">{issue.description || 'No description provided.'}</p>
            </div>
            <Link to="/issues" className="inline-flex items-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">Back to Issues</Link>
          </div>
          <div className="mt-3 text-sm text-slate-500">Created: {new Date(issue.created_at).toLocaleString()} • Updated: {new Date(issue.updated_at).toLocaleString()}</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Issue Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value as 'open' | 'in_progress' | 'closed')} className="rounded-lg border border-slate-300 p-2">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')} className="rounded-lg border border-slate-300 p-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select value={assignedTo || ''} onChange={(e) => setAssignedTo(e.target.value || undefined)} className="rounded-lg border border-slate-300 p-2">
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option value={u.id} key={u.id}>{u.profile?.name || u.email}</option>
                ))}
              </select>
            </div>
            <button onClick={updateIssue} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">Save Changes</button>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick Stats</h2>
            <p className="mt-2 text-sm text-slate-500">Status: <strong className="text-slate-900">{status}</strong></p>
            <p className="mt-1 text-sm text-slate-500">Priority: <strong className="text-slate-900">{priority}</strong></p>
            <p className="mt-1 text-sm text-slate-500">Assigned: <strong className="text-slate-900">{assignedTo ? 'Yes' : 'No'}</strong></p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Comments</h2>
          {comments.length === 0 ? (
            <p className="text-sm text-slate-500">No comments yet.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm text-slate-700">{comment.content}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(comment.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" className="w-full rounded-lg border border-slate-300 p-2 h-24" />
            <button onClick={addComment} className="mt-2 rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700">Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
