import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Issue, Project } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  const loadProject = async () => {
    if (!id) return;
    setLoading(true);

    const [{ data: projectData, error: projectError }, { data: issueData, error: issueError }] = await Promise.all([
      insforge.database.from('projects').select('*').eq('id', id).single(),
      insforge.database.from('issues').select('*').eq('project_id', id).order('created_at', { ascending: false })
    ]);

    if (projectError) setError(projectError.message);
    if (issueError) setError(issueError.message);

    setProject(projectData || null);
    setIssues(issueData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const createIssue = async () => {
    if (!title.trim()) return setError('Issue title is required');
    if (!user) return setError('No user in session');

    const { error } = await insforge.database.from('issues').insert([{ title, description, status: 'open', priority, project_id: id, created_by: user.id }]);
    if (error) {
      setError(`Failed to create issue: ${error.message}`);
      console.error('Issue creation error', error);
      return;
    }

    setTitle('');
    setDescription('');
    setPriority('medium');
    setError('');
    await loadProject();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading project...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center">Project not found</div>;

  const issueCounts = {
    open: issues.filter((i) => i.status === 'open').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    closed: issues.filter((i) => i.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{project.description || 'No project description provided yet.'}</p>
            </div>
            <Link to="/projects" className="inline-flex items-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">Back to Projects</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create New Issue</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-lg border border-slate-300 p-2" />
              <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')} className="rounded-lg border border-slate-300 p-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="h-28 w-full rounded-lg border border-slate-300 p-2 mt-3" />
            <button onClick={createIssue} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">Create Issue</button>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Issue Summary</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-emerald-50 p-2 text-center text-xs font-semibold text-emerald-800">Open<br /><span className="text-2xl">{issueCounts.open}</span></div>
                <div className="rounded-lg bg-amber-50 p-2 text-center text-xs font-semibold text-amber-800">In Progress<br /><span className="text-2xl">{issueCounts.in_progress}</span></div>
              <div className="rounded-lg bg-blue-50 p-2 text-center text-xs font-semibold text-blue-800">Closed<br /><span className="text-2xl">{issueCounts.closed}</span></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Issues</h2>
          {issues.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No issues created yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {issues.map((issue) => (
                <li key={issue.id}>
                  <Link to={`/issues/${issue.id}`} className="block rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-medium text-indigo-700">{issue.title}</p>
                        <p className="text-sm text-slate-500">{issue.description || 'No details.'}</p>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(issue.updated_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{issue.status}</span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">{issue.priority}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
